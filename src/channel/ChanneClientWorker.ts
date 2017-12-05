import { setInterval } from 'timers';
import { Logger } from "../Logger";
import { Socket } from 'net';
import { Request } from "../protocol/Request";
import { SetupServerChannelReq } from "../protocol/channel/SetupServerChannelReq";
import { MinervaProtocol } from "../protocol/MinervaProtocol";
import { Response } from "../protocol/Response";
import { Packet } from "../protocol/Packet";
import { SendUnicastMsgRes } from "../protocol/msg/downstream/unicast/SendUnicastMsgRes";
import { SendMulticastMsgRes } from "../protocol/msg/downstream/multicast/SendMulticastMsgRes";
import { SendBroadcastMsgRes } from "../protocol/msg/downstream/broadcast/SendBroadcastMsgRes";
import { SendGroupMsgRes } from "../protocol/msg/group/downstream/SendGroupMsgRes";
import { DeliverUpstreamMsgReq } from "../protocol/msg/upstream/DeliverUpstreamMsgReq";
import { AsyncResDeviceGrpCreated } from "../protocol/devicegroup/stable/create/AsyncResDeviceGrpCreated";
import { AsyncResDeviceGrpAdded } from "../protocol/devicegroup/stable/add/AsyncResDeviceGrpAdded";
import { AsyncResDeviceGrpSubtracted } from "../protocol/devicegroup/stable/subtract/AsyncResDeviceGrpSubtracted";
import { AsyncResDeviceGrpDeleted } from "../protocol/devicegroup/stable/delete/AsyncResDeviceGrpDeleted";
import { SetupServerChannelRes } from "../protocol/channel/SetupServerChannelRes.";
import { Result } from "../Result";
import { KeepAliveServerEvent } from '../protocol/event/KeepAliveServerEvent';
import { ServerRegRes } from '../protocol/cs/server/register/ServerRegRes';

const client = new Socket();
client.setDefaultEncoding('UTF-8');
client.setTimeout(0);

let readBufferString = '';

let serviceId: string, regId: string;

let gatePort: number, gateHost: string;

let keepAliveSender: NodeJS.Timer;

const process = global.process;

process.on('message', (msg: { cmd: string, message: { packet: { [id: string]: any }, data: any } }, handle) => {
    if (msg.cmd === 'connect') {
        client.connect(msg.message.data.port, msg.message.data.host, () => {
            serviceId = msg.message.data.serviceId;
            regId = msg.message.data.regId;
            writeData(client, JSON.stringify(msg.message.packet));
        });
    } else if (msg.cmd === 'job') {
        writeData(client, JSON.stringify(msg.message.packet));
    } else if (msg.cmd === 'gate') {
        if (msg.message.packet.cId === MinervaProtocol.CS_SERVER_REG_CMD_ID) {
            const gateServerClient = new Socket();
            let readBuffer = '';
            gateServerClient.setDefaultEncoding('UTF-8');
            gatePort = msg.message.data.gate.port;
            gateHost = msg.message.data.gate.host;
            gateServerClient.connect(msg.message.data.gate.port, msg.message.data.gate.host, () => {
                gateServerClient.on('data', (buffer) => {
                    readBuffer += buffer.toString();
                    if (readBuffer.includes('|')) {
                        const dataList = readBuffer.split('|');
                        console.log('[Worker][read-from-gate] ', dataList[0]);
                        process.send({ cmd: 'gate', message: dataList[0] });
                        gateServerClient.destroy();
                    }
                });
                console.log('[Worker][write-to-gate] ', msg.message.packet);
                gateServerClient.write(JSON.stringify(msg.message.packet) + '|');
            });
        }
        if (msg.message.packet.cId === MinervaProtocol.CS_SERVER_UNREG_CMD_ID) {
            const gateServerClient = new Socket();
            let readBuffer = '';
            gateServerClient.setDefaultEncoding('UTF-8');
            gateServerClient.connect(gatePort, gateHost, () => {
                gateServerClient.on('data', (buffer) => {
                    readBuffer += buffer.toString();
                    if (readBuffer.includes('|')) {
                        const dataList = readBuffer.split('|');
                        console.log('[Worker][read-from-gate] ', dataList[0]);
                        process.send({ cmd: 'gate', message: dataList[0] });
                        gateServerClient.destroy();
                    }
                });
                console.log('[Worker][write-to-gate] ', msg.message.packet);
                gateServerClient.write(JSON.stringify(msg.message.packet) + '|');
            });
        }
    }
});

client.on('data', function (buffer) {
    readBufferString += buffer.toString();

    const dataList = readBufferString.split('|');
    for (let i = 0; i < dataList.length - 1; i++) {
        handleData(dataList[i]);
    }
    readBufferString = dataList[dataList.length - 1];
});

process.on('exit', () => {
    console.log('[Worker][exit]');
    clearInterval(keepAliveSender);
    client.end();
    client.destroy();
});

process.on('disconnect', () => {
    console.log('[Worker][disconnect]');
});

client.on('error', function (err) {
    console.log('[Worker][error] ', err);
});

function handleData(data: string) {
    let object: any;
    let pack: Packet | null = null;
    console.log('[Worker][read-from-channel] ', JSON.parse(data));
    if(process.connected){
        process.send({ cmd: 'channel', message: data });
        try {
            object = JSON.parse(data);
            if (object.rc) {
                const cId = object.cId;
                switch (cId) {
                    case MinervaProtocol.CH_SETUP_SERVER_CHANNEL_CMD_ID:
                        onResSetupChannel(object);
                        break;
                }
            }
        } catch (e) {
            // process.send('');
        }
    }
}


function writeData(socket: Socket, data: string) {
    console.log('[Worker][write-to-channel] ', data);
    const success = !socket.write(data + '|');
    if (!success) {
        (function (socket, data) {
            socket.once('drain', function () {
                writeData(socket, data + '|');
            });
        })(socket, data)
    }
}


function onResKeepAlive(object: any) {
}


function onResSetupChannel(object: any) {
    const res: SetupServerChannelRes = new SetupServerChannelRes(object);
    const result: number = res.getResultCode();

    if (result === Result.RESULT_OK) {
        const keepAliveInterval: number = res.getKeepAlive();

        if (keepAliveInterval > 0) {
            if (keepAliveSender) {
                clearInterval(keepAliveSender);
                keepAliveSender = null;
            }
            const mKeepAliveSender: KeepAliveServerEvent = new KeepAliveServerEvent(regId, serviceId, MinervaProtocol.SERVER_TYPE_JAVASCRIPT);
            // writeData(client, JSON.stringify(mKeepAliveSender.getJson()));
            keepAliveSender = setInterval(() => {
                writeData(client, JSON.stringify(mKeepAliveSender.getJson()));
            }, keepAliveInterval * 1000 * 60)
        }
    }
}
