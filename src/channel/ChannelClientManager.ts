import { Logger } from "../Logger";

import { fork, ChildProcess } from 'child_process';
import { Packet } from "../protocol/Packet";

import { MinervaProtocol } from "../protocol/MinervaProtocol";
import { SendUnicastMsgRes } from "../protocol/msg/downstream/unicast/SendUnicastMsgRes";
import { ServerRegRes } from "../protocol/cs/server/register/ServerRegRes";
import { RegIdGen } from "../util/RegIdGen";
import { Request } from "../protocol/Request";
import { Response } from "../protocol/Response";
import { DataManager } from "../data/DataManager";
import { SetupServerChannelReq } from "../protocol/channel/SetupServerChannelReq";
import { SetupServerChannelRes } from "../protocol/channel/SetupServerChannelRes.";
import { Result } from "../Result";
import { SendBroadcastMsgRes } from "../protocol/msg/downstream/broadcast/SendBroadcastMsgRes";
import { SendMulticastMsgRes } from "../protocol/msg/downstream/multicast/SendMulticastMsgRes";
import { SendGroupMsgRes } from "../protocol/msg/group/downstream/SendGroupMsgRes";
import { DeliverUpstreamMsgReq } from "../protocol/msg/upstream/DeliverUpstreamMsgReq";
import { AsyncResDeviceGrpCreated } from "../protocol/devicegroup/stable/create/AsyncResDeviceGrpCreated";
import { AsyncResDeviceGrpAdded } from "../protocol/devicegroup/stable/add/AsyncResDeviceGrpAdded";
import { AsyncResDeviceGrpSubtracted } from "../protocol/devicegroup/stable/subtract/AsyncResDeviceGrpSubtracted";
import { AsyncResDeviceGrpDeleted } from "../protocol/devicegroup/stable/delete/AsyncResDeviceGrpDeleted";
import { ServerUnregRes } from "../protocol/cs/server/unregister/ServerUnregRes";
import { ConsoleEvent } from "../protocol/ConsoleEvent";
import { DeliverUpstreamMsgRes } from "../protocol/msg/upstream/DeliverUpstreamMsgRes";


export type UpstreamMessageListenerType = (result : { sender: string, serverTime: number, data: string }) => void;

export class ChannelClientManager {

    private static readonly TAG = "ChannelClientPool";

    private static readonly TIMEOUT = 20000;

    private static instance: ChannelClientManager;

    worker: ChildProcess;

    handlerMap: { [id: string]: any } = {};

    receivedUpstreamMsgListener: UpstreamMessageListenerType[] = [];

    mCheckMsgHash: Function[] = [];

    public static getInstance(): ChannelClientManager {

        if (ChannelClientManager.instance == null) {
            ChannelClientManager.instance = new ChannelClientManager();
        }

        return ChannelClientManager.instance;
    }


    private constructor() {
        Logger.debug(ChannelClientManager.TAG, "constructor enter");
    }

    init() {
        this.worker = fork(__dirname + '/ChanneClientWorker.js');
        // this.worker.send({ cmd: 'init', message: { port, host } });

        this.worker.on('message', this.onMessageHandler.bind(this));
    }

    release(done: Function) {
        // this.worker.disconnect();
        this.worker.kill('SIGKILL');
        this.worker.on('exit', () => {
            console.log('exit');
            if (this.worker) {
                this.worker.removeListener('message', this.onMessageHandler);
                // this.worker.kill();
            }
            this.worker = null;
            this.handlerMap = {};
            this.receivedUpstreamMsgListener = [];
            this.mCheckMsgHash = [];
            if (done) {
                done();
            }
        });
    }


    private timeoutPromise = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + ChannelClientManager.TIMEOUT + 'ms.')
        }, ChannelClientManager.TIMEOUT)
    })

    request(msg: { packet: Request, data?: any }): Promise<Response | ConsoleEvent> {
        this.worker.send({ cmd: 'job', message: { packet: msg.packet.getJson(), data: msg.data } });

        const promise = new Promise((resolve, reject) => {
            this.handlerMap[RegIdGen.getRequestId(msg.packet)] = { resolve, reject };
        });
        return <Promise<Response | ConsoleEvent>>Promise.race([promise, this.timeoutPromise]);
    }

    requestToGate(msg: { packet: Request, data?: any }): Promise<Response> {
        this.worker.send({ cmd: 'gate', message: { packet: msg.packet.getJson(), data: msg.data } });

        const promise = new Promise((resolve, reject) => {
            this.handlerMap[RegIdGen.getRequestId(msg.packet)] = { resolve, reject };
        });
        return <Promise<Response>>Promise.race([promise, this.timeoutPromise]);
    }

    private requestConnect(msg: { port: number, host: string, serviceId: string, regId: string }): Promise<Response | {}> {

        const req: Request = new SetupServerChannelReq(DataManager.getInstance().getServiceId(),
            DataManager.getInstance().getAppServerRegId(), MinervaProtocol.SERVER_TYPE_JAVASCRIPT);
        this.worker.send({ cmd: 'connect', message: { packet: req.getJson(), data: msg } });

        const promise = new Promise((resolve, reject) => {
            this.handlerMap[RegIdGen.getRequestId(req)] = { resolve, reject };
        });
        return Promise.race([promise, this.timeoutPromise]);
    }

    addReceivedUpstreamMsgListener(listener: UpstreamMessageListenerType) {
        this.receivedUpstreamMsgListener.push(listener);
    }

    removeReceivedUpstreamMsgListener(listener: UpstreamMessageListenerType) {
        const index = this.receivedUpstreamMsgListener.indexOf(listener);
        if (index > -1) {
            this.receivedUpstreamMsgListener.splice(index, 1);
        }
    }

    private onReceivedUpstreamMsg(req: Request) {
        Logger.debug(ChannelClientManager.TAG, "onReceivedUpstreamMsg enter");

        //if customer server(service provider) has not listening, just ignore.
        if (this.receivedUpstreamMsgListener.length === 0) {
            return;
        }

        const cReq: DeliverUpstreamMsgReq = <DeliverUpstreamMsgReq>req;
        let res: DeliverUpstreamMsgRes = null;
        const msgs = cReq.getMsgs();

        //res field           
        const msgsIds: string[] = []

        for (let i = 0; i < msgs.length; i++) {
            const jsonMsg = msgs[i];
            const msgId = jsonMsg.mId;
            msgsIds.push(msgId);

            //if same message has received duplicate, ignore it.
            if (this.mCheckMsgHash[msgId]) {
                continue;
            }

            //notify customer 
            const sender = jsonMsg.dRId;
            const serverTime = jsonMsg.svrT;
            const data = jsonMsg.data;
            this.receivedUpstreamMsgListener.forEach((listener) => {
                listener({ sender, serverTime, data });
            });

            //add to the check hash
            this.mCheckMsgHash.push(msgId);
        }

        //set res fields
        if (msgsIds.length > 0) {
            const res = new DeliverUpstreamMsgRes(req, Result.RESULT_OK);
            const dataMgr: DataManager = DataManager.getInstance();
            res.setMsgIds(msgsIds);
            res.setServiceId(cReq.getServiceId());
            res.setServerRegId(dataMgr.getAppServerRegId());

            this.worker.send({ cmd: 'job', message: { packet: res.getJson() } });
        }
    }

    private onMessageHandler(msg: { cmd: string, message: any }) {
        console.log('[Manager][onMessageHandler] ', msg);
        if (msg.cmd === 'gate') {
            const object = JSON.parse(msg.message);
            const cId = object.cId;
            switch (cId) {
                case MinervaProtocol.CS_SERVER_REG_CMD_ID: {
                    const res = new ServerRegRes(msg.message);
                    const reqId = RegIdGen.getResponseId(res);
                    const resultCode = res.getResultCode();
                    if(resultCode === Result.RESULT_OK || resultCode === Result.RESULT_SERVER_REGNAME_ALREADY_REGISTERED){
                        DataManager.getInstance().setAppServerRegId(res.getServerRegId());
                        DataManager.getInstance().setChannelUrl(res.getChannelUrl());
                        DataManager.getInstance().setPrivateChannelUrl(res.getPrivateChannelUrl());
                    } else {
                        this.handlerMap[reqId].resolve(res);
                        delete this.handlerMap[reqId];
                        break;
                    }
                    const addr = res.getChannelUrl().split(':');
                    const promise = this.requestConnect({
                        port: Number(addr[1]), host: addr[0],
                        serviceId: DataManager.getInstance().getServiceId(),
                        regId: res.getServerRegId()
                    });
                    promise.then(() => {
                        this.handlerMap[reqId].resolve(res);
                        delete this.handlerMap[reqId];
                    }).catch(err => this.handlerMap[reqId].reject(err));
                    break;
                }
                case MinervaProtocol.CS_SERVER_UNREG_CMD_ID: {
                    const res = new ServerUnregRes(msg.message);
                    DataManager.getInstance().setAppServerRegId(null);
                    const reqId = RegIdGen.getResponseId(res);
                    this.handlerMap[reqId].resolve(res);
                    delete this.handlerMap[reqId];
                    break;
                }
            }
        }
        if (msg.cmd === 'channel') {
            const object = JSON.parse(msg.message);
            const cId = object.cId;
            switch (cId) {
                case MinervaProtocol.EVT_HEARTBEAT_SERVER_CMD_ID: {
                    console.log('[EVT_HEARTBEAT_SERVER_CMD_ID] ', object);
                    break;
                }
                case MinervaProtocol.CH_SETUP_SERVER_CHANNEL_CMD_ID: {
                    const res = new SetupServerChannelRes(msg.message);
                    this.handlerMap[RegIdGen.getResponseId(res)].resolve(res);
                    delete this.handlerMap[RegIdGen.getResponseId(res)];
                    break;
                }

                case MinervaProtocol.MSG_SEND_UNICAST_CMD_ID: {
                    const res = new SendUnicastMsgRes(msg.message);
                    this.handlerMap[RegIdGen.getResponseId(res)].resolve(res);
                    delete this.handlerMap[RegIdGen.getResponseId(res)];
                    break;
                }
                case MinervaProtocol.MSG_SEND_MULTICAST_CMD_ID: {
                    const res = new SendMulticastMsgRes(msg.message);
                    this.handlerMap[RegIdGen.getResponseId(res)].resolve(res);
                    delete this.handlerMap[RegIdGen.getResponseId(res)];
                    break;
                }
                case MinervaProtocol.MSG_SEND_BROADCAST_CMD_ID: {
                    const res = new SendBroadcastMsgRes(msg.message);
                    this.handlerMap[RegIdGen.getResponseId(res)].resolve(res);
                    delete this.handlerMap[RegIdGen.getResponseId(res)];
                    break;
                }
                case MinervaProtocol.MSG_SEND_GROUP_CMD_ID: {
                    const res = new SendGroupMsgRes(msg.message);
                    this.handlerMap[RegIdGen.getResponseId(res)].resolve(res);
                    delete this.handlerMap[RegIdGen.getResponseId(res)];
                    break;
                }


                /* request from channel server */
                // case MinervaProtocol.MSG_DELIVER_UPSTREAM_CMD_ID: {
                //     const res = new DeliverUpstreamMsgReq(msg.message);
                //     this.handlerMap[RegIdGen.getRequestId(res)].resolve(res);
                //     break;
                // }

                /* async result from channel server */
                case MinervaProtocol.ASYNC_RES_DEVICE_GRP_CREATE_CMD_ID: {
                    const res = new AsyncResDeviceGrpCreated(msg.message);
                    this.handlerMap[RegIdGen.getAsyncRequestId(res)].resolve(res);
                    delete this.handlerMap[RegIdGen.getAsyncRequestId(res)];
                    break;

                }
                case MinervaProtocol.ASYNC_RES_DEVICE_GRP_ADD_CMD_ID: {
                    const res = new AsyncResDeviceGrpAdded(msg.message);
                    this.handlerMap[RegIdGen.getAsyncRequestId(res)].resolve(res);
                    delete this.handlerMap[RegIdGen.getAsyncRequestId(res)];
                    break;

                }
                case MinervaProtocol.ASYNC_RES_DEVICE_GRP_SUBTRACT_CMD_ID: {
                    const res = new AsyncResDeviceGrpSubtracted(msg.message);
                    this.handlerMap[RegIdGen.getAsyncRequestId(res)].resolve(res);
                    delete this.handlerMap[RegIdGen.getAsyncRequestId(res)];
                    break;
                }
                case MinervaProtocol.ASYNC_RES_DEVICE_GRP_DELETE_CMD_ID: {
                    const res = new AsyncResDeviceGrpDeleted(msg.message);
                    this.handlerMap[RegIdGen.getAsyncRequestId(res)].resolve(res);
                    delete this.handlerMap[RegIdGen.getAsyncRequestId(res)];
                    break;
                }

                /* request from channel server */
                case MinervaProtocol.MSG_DELIVER_UPSTREAM_CMD_ID:
                    const req = new DeliverUpstreamMsgReq(msg.message);
                    this.onReceivedUpstreamMsg(req);
                    break;
            }
        }
    }
}