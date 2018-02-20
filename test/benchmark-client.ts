
import { createServer, Socket } from 'net';
import { setInterval, clearInterval } from 'timers';
import { waterfall, each } from 'async';

import * as uuid from 'uuid/v1';
import * as logUpdate from 'log-update';


const ulog = logUpdate.create(process.stdout);

// const DEVICE_COUNT = 4;
// const DEVICE_PER_MESSAGE_ON_SECOND = 5;
// const TOTAL_MESSAGE_COUNT = 50;
const DEVICE_COUNT = 10;
const DEVICE_PER_MESSAGE_ON_SECOND = 5;
const TOTAL_MESSAGE_COUNT = 200;

const SERVICE_ID = 'b4a2166853ad4f19acc77b193d89c497';
// const REGISTER_ID = 'f4046fbe6ccb461daabdfa8862edbbe4';  // PYTHON
// const REGISTER_ID = 'a409c2888e484d3f9777b8fd073be502'; // JAVA
// const REGISTER_ID = '340867db7a594df4a1d05645920d5ea9'; // NODE
const REGISTER_ID = '7987953c138d42d596379208fc24b45c'; // CPP

type Property = {
    deviceRegId: string,
    channelUrl: string,
    socket: Socket;
}

const channelClientList: Property[] = new Array(DEVICE_COUNT);

const count = {
    send: 0,
    receive: 0,
    maxTime: 0,
    minTime: 10000,
    avrTime: 0
}

for (let index = 0; index < channelClientList.length; index++) {
    channelClientList[index] = {
        deviceRegId: null,
        channelUrl: null,
        socket: new Socket()
    }
}

channelClientList.map((prop, idx, array) => {
    const gateClient = new Socket();
    gateClient.on('data', (msg) => {
        // {"cId":311,"rc": 1,"st":111111111,"syncT":1919199191,"pm":{"dRId":"adsf09090","cu":"200.42.33.11:9999"}}
        const message = msg.toString();
        // console.log(`[Gate Recive] : ${message}`);
        const deviceRegRes = JSON.parse(message.replace('|', ''));

        prop.deviceRegId = deviceRegRes.pm.dRId;
        prop.channelUrl = deviceRegRes.pm.cu;

        gateClient.destroy();


        prop.socket.on('data', (msg) => {
            const message = msg.toString();
            // console.log(`[Recive] : ${message}`);
            const res = JSON.parse(message.replace('|', ''));
            const cId = res.cId;

            switch (cId) {
                // MinervaProtocol.CH_SETUP_DEVICE_CHANNEL_CMD_ID
                case 401: {
                    prop.socket.write(JSON.stringify({ cId: 1, st: Date.now(), pm: { st: 1, rId: prop.deviceRegId, sId: SERVICE_ID } }) + '|');
                    setInterval(() => {
                        prop.socket.write(JSON.stringify({ cId: 1, st: Date.now(), pm: { st: 1, rId: prop.deviceRegId, sId: SERVICE_ID } }) + '|');
                    }, res.pm.hb * 60 * 1000);
                    break;
                }
                // MinervaProtocol.MSG_SEND_UPSTREAM_CMD_ID
                case 511: {
                    ++count.receive;
                    // const diff = Date.now() - res.st;
                    // if(count.maxTime < diff){
                    //     count.maxTime = diff;
                    // }
                    // if(count.minTime > diff){
                    //     count.minTime = diff;
                    // }
                    // count.avrTime = ((count.avrTime * (count.receive - 1)) + diff ) / count.receive;
                    if (res.rc != 1) {
                        console.error(JSON.stringify(res));
                    }
                    break;
                }
            }
        });
        const addr = deviceRegRes.pm.cu.split(':');
        // console.log(addr);
        prop.socket.connect(Number(addr[1]), addr[0], () => {
            prop.socket.write(JSON.stringify({ cId: 401, st: Date.now(), pm: { st: 1, rId: prop.deviceRegId, sId: SERVICE_ID } }) + '|');
        });
    });

    gateClient.connect(9082, 'gate.rationalowl.com', () => {
        console.time('test');
        gateClient.write(JSON.stringify({ cId: 311, st: Date.now(), pm: { sId: SERVICE_ID, ma: uuid(), dt: 1, drn: "test-device", pn: "010123412324" } }) + '|');
    });
});


setTimeout(() => {
    channelClientList.forEach((prop) => {
        const MAX = TOTAL_MESSAGE_COUNT / (DEVICE_COUNT);
        let iter = 0;
        let interval = setInterval(() => {
            if (iter >= MAX) {
                clearInterval(interval);
            } else {
                ++count.send;
                ++iter;
                const data = { cId: 511, st: Date.now(), pm: { sId: SERVICE_ID, sRId: REGISTER_ID, dRId: prop.deviceRegId, data: "hi", umi: "adsfk" } };
                // console.log(data);
                prop.socket.write(JSON.stringify(data) + '|');
            }
        }, 1000 / DEVICE_PER_MESSAGE_ON_SECOND);
    });
}, 5000);

// setInterval(() => ulog(`Send : ${count.send}, Receive: ${count.receive}, Max: ${count.maxTime}, Min: ${count.minTime}, Avr: ${count.avrTime}`), 500);
setInterval(() => ulog(`Send : ${count.send}, Receive: ${count.receive}`), 500);