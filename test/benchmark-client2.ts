
import { createServer, Socket } from 'net';

import { setInterval, clearInterval } from 'timers';

import * as uuid from 'uuid/v1';

const SERVICE_ID = '11d98dc3805a4229aaab960e46137524';
const REGISTER_ID = '4ab600096ae449758f82b70335645d84';

const property = {
    deviceRegId: null,
    channelUrl: null,
}

const gateClient = new Socket();
const channelClient = new Socket();

channelClient.on('data', (msg) => {
    const message = msg.toString();
    // console.log(`[Recive] : ${message}`);
    const res = JSON.parse(message.replace('|', ''));
    const cId = res.cId;

    switch (cId) {
        //CH_SETUP_DEVICE_CHANNEL_CMD_ID
        // {"cId":401,"rc": 1,"st":111111111,"syncT":1919199191,"pm":{"hb":30}}
        case 401: {
            console.log("[Send HeartBeat]")
            channelClient.write(JSON.stringify({ cId: 1, st: Date.now(), pm: { st: 1, rId: property.deviceRegId, sId: SERVICE_ID } }) + '|');
            setInterval(() => {
                console.log("[Send HeartBeat]")
                channelClient.write(JSON.stringify({ cId: 1, st: Date.now(), pm: { st: 1, rId: property.deviceRegId, sId: SERVICE_ID } }) + '|');
            }, res.pm.hb * 60 * 1000);
            break;
        }
        //EVT_HEARTBEAT_DEVICE_CMD_ID
        case 1: {
            console.log("[HeartBeat]")
            break;
        }
        //MSG_SEND_UPSTREAM_CMD_ID
        // {"cId":511,"rc": 1,"st":111111111,"syncT":1919199191,,"pm":{"umi":"090909"}}
        case 511: {
            // console.log(res);
            break;
        }
        //MSG_DELIVER_CMD_ID
        // {"cId":504,'st":111111111,"pm":{"sId":"service1","msgs":[{"s":"11111","data":"hi","mId":"090909","svrT":29092920902,     
        case 504: {
            // console.log(res);
            break;
        }
    }
});

gateClient.on('data', (msg) => {
    // {"cId":311,"rc": 1,"st":111111111,"syncT":1919199191,"pm":{"dRId":"adsf09090","cu":"200.42.33.11:9999"}}
    const message = msg.toString();
    console.log(`[Gate Recive] : ${message}`);
    const deviceRegRes = JSON.parse(message.replace('|', ''));

    property.deviceRegId = deviceRegRes.pm.dRId;
    property.channelUrl = deviceRegRes.pm.cu;

    console.log(property);
    gateClient.destroy();

    const addr = deviceRegRes.pm.cu.split(':');

    channelClient.connect(Number(addr[1]), addr[0], () => {
        channelClient.write(JSON.stringify({ cId: 401, st: Date.now(), pm: { st: 1, rId: property.deviceRegId, sId: SERVICE_ID } }) + '|');
    });
});

gateClient.connect(9082, 'gate.rationalowl.com', () => {
    console.time('test');
    gateClient.write(JSON.stringify({ cId: 311, st: Date.now(), pm: { sId: SERVICE_ID, ma: uuid(), dt: 1, drn: "test-device", pn: "010123412324" } }) + '|');
});


let count = 0;

setTimeout(() => {
    const time = setInterval(() => {
        if (count < 10000) {
            channelClient.write(JSON.stringify({ cId: 511, st: Date.now(), pm: { sId: SERVICE_ID, sRId: REGISTER_ID, dRId: property.deviceRegId, data: "hi", umi: "adsfk" } }) + '|');
            ++count;
        } else {
            console.log('end');
            clearInterval(time);
        }
    }, 200);
}, 10000);