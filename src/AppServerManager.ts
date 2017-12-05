import { Logger } from "./Logger";
import { DataManager } from "./data/DataManager";
import { ServerRegReq } from "./protocol/cs/server/register/ServerRegReq";
import { ChannelClientManager, UpstreamMessageListenerType } from "./channel/ChannelClientManager";
import { Response } from './protocol/Response';
import { ServerRegRes } from './protocol/cs/server/register/ServerRegRes';
import { Result } from './Result';
import { ServerUnregReq } from './protocol/cs/server/unregister/ServerUnregReq';
import { ServerUnregRes } from './protocol/cs/server/unregister/ServerUnregRes';
import { DeviceGrpCreateReq } from './protocol/devicegroup/stable/create/DeviceGrpCreateReq';
import { AsyncResDeviceGrpAddedParam, AsyncResDeviceGrpAdded } from './protocol/devicegroup/stable/add/AsyncResDeviceGrpAdded';
import { DeviceGrpAddReq } from './protocol/devicegroup/stable/add/DeviceGrpAddReq';
import { AsyncResDeviceGrpCreated } from './protocol/devicegroup/stable/create/AsyncResDeviceGrpCreated';
import { DeviceGrpSubtractReq } from './protocol/devicegroup/stable/subtract/DeviceGrpSubtractReq';
import { AsyncResDeviceGrpSubtracted } from './protocol/devicegroup/stable/subtract/AsyncResDeviceGrpSubtracted';
import { DeviceGrpDeleteReq } from './protocol/devicegroup/stable/delete/DeviceGrpDeleteReq';
import { SendUnicastMsgReq } from './protocol/msg/downstream/unicast/SendUnicastMsgReq';
import { MinervaProtocol } from './protocol/MinervaProtocol';
import { SendUnicastMsgRes } from './protocol/msg/downstream/unicast/SendUnicastMsgRes';
import { SendMulticastMsgReq } from './protocol/msg/downstream/multicast/SendMulticastMsgReq';
import { SendMulticastMsgRes } from './protocol/msg/downstream/multicast/SendMulticastMsgRes';
import { SendBroadcastMsgReq } from './protocol/msg/downstream/broadcast/SendBroadcastMsgReq';
import { SendBroadcastMsgRes } from './protocol/msg/downstream/broadcast/SendBroadcastMsgRes';
import { SendGroupMsgReq } from './protocol/msg/group/downstream/SendGroupMsgReq';
import { SendGroupMsgRes } from './protocol/msg/group/downstream/SendGroupMsgRes';

export class AppServerManager {
    private static readonly TAG = "PushManager";

    private static instance: AppServerManager;


    public static getInstance(): AppServerManager {
        if (this.instance == null) {
            this.instance = new AppServerManager();
        }
        return this.instance;
    }

    private constructor() { }


    public initAppServer(option: { channel: { host: string, port: number } }) {
        Logger.debug(AppServerManager.TAG, "initAppServer enter");

        //init push service            
        const dataMgr: DataManager = DataManager.getInstance();
        const channelUrl = dataMgr.getChannelUrl();

        //not yet registered
        if (channelUrl === null) {
            //do nothing
            Logger.info("app server not yet registered...")
            return;
        }
        // ChannelClientManager.getInstance()
        //     .request({ msgType: MinervaTypes.MSG_TYPE_INIT, mData: channelUrl });
    }


    ////////////////////////////////////////////////
    // register app server
    ////////////////////////////////////////////////    

    public registerAppServer(serviceId: string, regName: string,
        gateHost: string = 'gate.rationalowl.com', gatePort: number = 9081)
        : Promise<{ resultCode: number, resultMsg: string, appServerRegId: string }> {
        Logger.debug(AppServerManager.TAG, "registerAppServer enter");
        const dataMgr: DataManager = DataManager.getInstance();
        dataMgr.setServiceId(serviceId);
        // dataMgr.setGateServerUrl(gateUrl);
        const req: ServerRegReq = new ServerRegReq();
        //set request fields.
        req.setServiceId(serviceId);
        req.setRegisterName(regName);
        req.setType(MinervaProtocol.SERVER_TYPE_JAVASCRIPT);
        // req.setIp(dataMgr.getIp());
        // req.setHostName(dataMgr.getHostName());
        // req.setMacAddr(dataMgr.getMacAddress());

        ChannelClientManager.getInstance().init();
        return ChannelClientManager.getInstance()
            .requestToGate({ packet: req, data: { gate: { host: gateHost, port: gatePort } } }).then((res: ServerRegRes) => {
                const resultCode = res.getResultCode();
                return { resultCode, resultMsg: Result.getResultMessage(resultCode), appServerRegId: res.getServerRegId() };
            });
    }


    public unregisterAppServer(serviceId: string, serverRegId: string)
        : Promise<{ resultCode: number, resultMsg: string }> {
        Logger.debug(AppServerManager.TAG, "unregisterAppServer enter");
        const req: ServerUnregReq = new ServerUnregReq();
        req.setServiceId(serviceId);
        req.setServerRegId(serverRegId);

        return ChannelClientManager.getInstance()
            .requestToGate({ packet: req }).then((res: ServerUnregRes) => {
                const resultCode = res.getResultCode();
                return { resultCode, resultMsg: Result.getResultMessage(resultCode) };
            });
    }


    // ////////////////////////////////////////////////
    // // device group
    // ////////////////////////////////////////////////     


    public createDeviceGroup(groupName: string, groupDesc: string, deviceList: string[]) {
        Logger.debug(AppServerManager.TAG, "createDeviceGroup enter");
        const dataMgr: DataManager = DataManager.getInstance();
        const req: DeviceGrpCreateReq = new DeviceGrpCreateReq();
        req.setServiceId(dataMgr.getServiceId());
        req.setServerRegId(dataMgr.getAppServerRegId());
        req.setGroupName(groupName);
        req.setGroupDesc(groupDesc);
        req.setDeviceList(deviceList);

        return ChannelClientManager.getInstance()
            .request({ packet: req }).then((res: AsyncResDeviceGrpCreated) => {
                const resultCode = res.getAsyncResultCode();
                return {
                    resultCode, resultMsg: Result.getResultMessage(resultCode),
                    deviceGrpId: res.getGrpId(),
                    deviceGrpName: groupName,
                    deviceSize: res.getDeviceSize(),
                    desc: groupDesc,
                    failedDevcies: res.getFailedDevices()
                };
            });
    }


    public addDeviceGroup(groupId: string, deviceList: string[]) {
        Logger.debug(AppServerManager.TAG, "addDeviceGroup enter");
        const dataMgr: DataManager = DataManager.getInstance();
        const req: DeviceGrpAddReq = new DeviceGrpAddReq();
        req.setServiceId(dataMgr.getServiceId());
        req.setServerRegId(dataMgr.getAppServerRegId());
        req.setGrpId(groupId);
        req.setDeviceList(deviceList);

        return ChannelClientManager.getInstance()
            .request({ packet: req }).then((res: AsyncResDeviceGrpAdded) => {
                const resultCode = res.getAsyncResultCode();
                return {
                    resultCode, resultMsg: Result.getResultMessage(resultCode),
                    deviceGrpId: res.getGrpId(),
                    totalDeviceSize: res.getTotalDeviceSize(),
                    addedDeviceSize: res.getAddedDeviceSize(),
                    failedDevcies: res.getFailedDevices()
                };
            });
    }

    public subtractDeviceGroup(groupId: string, deviceList: string[]) {
        Logger.debug(AppServerManager.TAG, "subtractDeviceGroup enter");
        const dataMgr: DataManager = DataManager.getInstance();
        const req: DeviceGrpSubtractReq = new DeviceGrpSubtractReq();
        req.setServiceId(dataMgr.getServiceId());
        req.setServerRegId(dataMgr.getAppServerRegId());
        req.setGrpId(groupId);
        req.setDeviceList(deviceList);

        return ChannelClientManager.getInstance()
            .request({ packet: req }).then((res: AsyncResDeviceGrpSubtracted) => {
                const resultCode = res.getAsyncResultCode();
                return {
                    resultCode, resultMsg: Result.getResultMessage(resultCode),
                    deviceGrpId: res.getGrpId(),
                    totalDeviceSize: res.getTotalDeviceSize(),
                    subtractDeviceSize: res.getSubtractDeviceSize(),
                    failedDevcies: res.getFailedDevices()
                };
            });
    }


    public deleteDeviceGroup(groupId: string) {
        Logger.debug(AppServerManager.TAG, "deleteDeviceGroup enter");
        const dataMgr: DataManager = DataManager.getInstance();
        const req: DeviceGrpDeleteReq = new DeviceGrpDeleteReq();
        req.setServiceId(dataMgr.getServiceId());
        req.setServerRegId(dataMgr.getAppServerRegId());
        req.setGrpId(groupId);


        return ChannelClientManager.getInstance()
            .request({ packet: req }).then((res: AsyncResDeviceGrpSubtracted) => {
                const resultCode = res.getAsyncResultCode();
                return {
                    resultCode, resultMsg: Result.getResultMessage(resultCode),
                    deviceGrpId: res.getGrpId()
                };
            });
    }

    // ////////////////////////////////////////////////
    // // send data
    // ////////////////////////////////////////////////     


    // /**
    //  * unicast 메시지를 보낸다.
    //  * @param data 단말앱에 전달할 메시지       
    //  * @param notiMsg 단말앱이 구동중이 아닐때 표시할 알림 문자
    //  *        - 만약 null이면 data를 알림 창에 표시
    //  * @param deviceRegId 메시지를 전달 할 대상 단말 앱의 단말 등록 아이디
    //  * @param supportMsgQ 단말앱이 비활성일 때 미 전달 메시지를 큐잉할지 여부 
    //  *        - false 단말이 비활성으로 메시지 수신하지 않더라도 재발송하지 않는다.
    //  *        - true 미전달 메시지를 메시징 서버에서 메시지 큐잉기간(디폴트 7일)동안 큐잉하고 있다가 단말상태가 활성상태가 되면 미전달 메시지를 단말 앱에 전달한다.
    //  * @return request id 
    //  */

    // public sendUnicastMsg(data: string, notiMsg: string, deviceRegId: string, isSupportMsgQ: boolean) {
    //     Logger.debug(AppServerManager.TAG, "sendUnicastMsg enter");
    //     const dataMgr: DataManager = DataManager.getInstance();
    //     const req: SendUnicastMsgReq = new SendUnicastMsgReq();
    //     //set request fields.
    //     req.setDeviceRegId(deviceRegId);
    //     req.setData(data);
    //     req.setServiceId(dataMgr.getServiceId());
    //     req.setServerRegId(dataMgr.getAppServerRegId());
    //     const supportMsgQ = isSupportMsgQ ? MinervaProtocol.MSG_Q_SUPPORT : MinervaProtocol.MSG_Q_NOT_SUPPORT;
    //     req.setSupportMsgQ(supportMsgQ);

    //     if (!notiMsg) {
    //         req.setNotiStr(notiMsg);
    //     }

    //     return ChannelClientManager.getInstance()
    //         .request({ packet: req }).then((res: SendUnicastMsgRes) => {
    //             const resultCode = res.getResultCode();
    //             return {
    //                 resultCode, resultMsg: Result.getResultMessage(resultCode)
    //             };
    //         });
    // }

    public sendMulticastMsg(data: string, deviceRegIds: string[], supportMsgQ: boolean, notiTitle: string = null, notiMsg: string = null) {
        Logger.debug(AppServerManager.TAG, "sendMulticastMsg enter");
        const dataMgr: DataManager = DataManager.getInstance();
        const req: SendMulticastMsgReq = new SendMulticastMsgReq();
        //set request fields.
        req.setData(data);
        req.setDeviceRegIds(deviceRegIds);
        req.setServiceId(dataMgr.getServiceId());
        req.setServerRegId(dataMgr.getAppServerRegId());
        const supportMsgQ_ = (supportMsgQ == true) ? MinervaProtocol.MSG_Q_SUPPORT : MinervaProtocol.MSG_Q_NOT_SUPPORT;
        req.setSupportMsgQ(supportMsgQ_);

        if (notiTitle) {
            req.setNotiTitle(notiTitle);
        }

        if (notiMsg) {
            req.setNotiBody(notiMsg);
        }

        return ChannelClientManager.getInstance()
            .request({ packet: req }).then((res: SendMulticastMsgRes) => {
                const resultCode = res.getResultCode();
                return {
                    resultCode, resultMsg: Result.getResultMessage(resultCode)
                };
            });
    }


    public sendBroadcastMsg(data: string, supportMsgQ: boolean, notiTitle: string = null, notiMsg: string = null) {
        Logger.debug(AppServerManager.TAG, "sendBroadcastMsg enter");
        const dataMgr: DataManager = DataManager.getInstance();
        const req: SendBroadcastMsgReq = new SendBroadcastMsgReq();
        //set request fields.
        req.setData(data);
        req.setServiceId(dataMgr.getServiceId());
        req.setServerRegId(dataMgr.getAppServerRegId());
        const supportMsgQ_ = (supportMsgQ == true) ? MinervaProtocol.MSG_Q_SUPPORT : MinervaProtocol.MSG_Q_NOT_SUPPORT;
        req.setSupportMsgQ(supportMsgQ_);


        if (notiTitle) {
            req.setNotiTitle(notiTitle);
        }

        if (notiMsg) {
            req.setNotiBody(notiMsg);
        }

        return ChannelClientManager.getInstance()
            .request({ packet: req }).then((res: SendBroadcastMsgRes) => {
                const resultCode = res.getResultCode();
                return {
                    resultCode, resultMsg: Result.getResultMessage(resultCode)
                };
            });
    }

    public sendGroupMsg(data: string, deviceGroupId: string, supportMsgQ: boolean, notiTitle: string = null, notiMsg: string = null) {
        Logger.debug(AppServerManager.TAG, "sendGroupMsg enter");
        const dataMgr: DataManager = DataManager.getInstance();
        const req: SendGroupMsgReq = new SendGroupMsgReq();
        //set request fields.
        req.setData(data);
        req.setDeviceGroupId(deviceGroupId);
        req.setServiceId(dataMgr.getServiceId());
        req.setServerRegId(dataMgr.getAppServerRegId());
        const supportMsgQ_ = (supportMsgQ == true) ? MinervaProtocol.MSG_Q_SUPPORT : MinervaProtocol.MSG_Q_NOT_SUPPORT;
        req.setSupportMsgQ(supportMsgQ_);

        if (notiTitle) {
            req.setNotiTitle(notiTitle);
        }

        if (notiMsg) {
            req.setNotiBody(notiMsg);
        }

        return ChannelClientManager.getInstance()
            .request({ packet: req }).then((res: SendGroupMsgRes) => {
                const resultCode = res.getResultCode();
                return {
                    resultCode, resultMsg: Result.getResultMessage(resultCode)
                };
            });
    }

    addReceivedUpstreamMsgListener(listener: UpstreamMessageListenerType) {
        ChannelClientManager.getInstance().addReceivedUpstreamMsgListener(listener);
    }

    removeReceivedUpstreamMsgListener(listener: UpstreamMessageListenerType) {
        ChannelClientManager.getInstance().removeReceivedUpstreamMsgListener(listener);
    }


    release(done: Function) {
        ChannelClientManager.getInstance().release(done);
    }
}