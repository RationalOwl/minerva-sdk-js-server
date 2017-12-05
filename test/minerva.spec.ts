import { AppServerManager } from "../src/AppServerManager";

import 'source-map-support/register'

import * as assert from 'assert';

const SERVICE_ID = 'def829b853d046779e2227bdd091653c';

const DEVICE_ID_LIST = [
    '03e43cee8893474399a8541a7991250c',
    '0a51937c8144413aba70d3619cf231bc',
    '217d83599b8f4be288f518ceb1868d97',
    '370a17291bf54ea1b2de86201178f480',
    '3ecd1b5ce6c34a38983cfd4fa433532f',
    '44da5ed018f447f885a9db208efd41f9',
    '4880b4f33fbc4586b71488467364b6cf',
    '5847411a88db41a8ab1b7de51711b892',
    '622e0a5f965a4858911c2ebb434b2ee6',
    '7fa4632ac5004b8391d9245dab4405f6',
    '802d848731884ef692286bd08248565e',
    '8b91009507fe4a7f93d9573829c6beb4',
    '8f6465a0fdce477084f0a4a35a5ccbaa',
    'ab629a5533844366a1125b10684f85bc',
    'bc7bf18cc95840efbcdc963432148a4b',
    'cdeed11ce4644fad99213d36793d8e65',
]

describe('[Minerva]', function () {
    this.timeout(20000);
    let server;

    before(async () => {
        server = await AppServerManager.getInstance()
            .registerAppServer(SERVICE_ID, 'gyeongmin-app-server', 'gate.rationalowl.com', 9081);

    });


    after((done) => {
        AppServerManager.getInstance().release(() => {
            done();
        });
    });

    it.skip('unregisterAppServer', async () => {
        const unRegServer = await AppServerManager.getInstance().unregisterAppServer(SERVICE_ID, server.appServerRegId);
        assert.equal(unRegServer.resultCode, 1);
    });

    it('createDeviceGroup', async () => {
        const newGroup = await AppServerManager.getInstance().createDeviceGroup('groupName', 'groupDesc', DEVICE_ID_LIST.slice(0, 5));

        assert.equal(newGroup.resultCode, 1);
        assert.equal(newGroup.deviceGrpName, 'groupName');
        assert.equal(newGroup.deviceSize, 5);
        assert.equal(newGroup.desc, 'groupDesc');
    });

    it('addDeviceGroup', async () => {
        const newGroup = await AppServerManager.getInstance().createDeviceGroup('groupName', 'groupDesc', DEVICE_ID_LIST.slice(0, 5));
        const addGrpMsg = await AppServerManager.getInstance().addDeviceGroup(newGroup.deviceGrpId, DEVICE_ID_LIST.slice(5, 10));

        assert.equal(addGrpMsg.resultCode, 1);
        assert.equal(addGrpMsg.totalDeviceSize, 10);
        assert.equal(addGrpMsg.addedDeviceSize, 5);
    });


    it('subtractDeviceGroup', async () => {
        const newGroup = await AppServerManager.getInstance().createDeviceGroup('groupName', 'groupDesc', DEVICE_ID_LIST.slice(0, 10));
        const subGrpMsg = await AppServerManager.getInstance().subtractDeviceGroup(newGroup.deviceGrpId, DEVICE_ID_LIST.slice(0, 5));

        assert.equal(subGrpMsg.resultCode, 1);
        assert.equal(subGrpMsg.totalDeviceSize, 5);
        assert.equal(subGrpMsg.subtractDeviceSize, 5);
    });

    it('deleteDeviceGroup', async () => {
        const newGroup = await AppServerManager.getInstance().createDeviceGroup('groupName', 'groupDesc', DEVICE_ID_LIST.slice(0, 5));
        const deleteGrpMsg = await AppServerManager.getInstance().deleteDeviceGroup(newGroup.deviceGrpId);

        assert.equal(deleteGrpMsg.resultCode, 1);
    });


    // it('sendUnicastMsg', async () => {
    //     // const server = await AppServerManager.getInstance()
    //     //     .registerAppServer(SERVICE_ID, 'gyeongmin-app-server', 'gate.rationalowl.com', 9081);
    //     const unicastMsg = await AppServerManager.getInstance().sendUnicastMsg('testMessage', null, DEVICE_ID_LIST[0], false);
    //     assert.equal(unicastMsg.resultCode, 1);
    // });

    // it('sendUnicastMsg with noti', async () => {
    //     // const server = await AppServerManager.getInstance()
    //     //     .registerAppServer(SERVICE_ID, 'gyeongmin-app-server', 'gate.rationalowl.com', 9081);
    //     const unicastMsg = await AppServerManager.getInstance().sendUnicastMsg('testMessage', 'testNoti', DEVICE_ID_LIST[0], false);

    //     assert.equal(unicastMsg.resultCode, 1);
    // });


    it('sendMulticastMsg', async () => {
        const multicastMsg = await AppServerManager.getInstance().sendMulticastMsg('testMessage', DEVICE_ID_LIST.slice(0, 5), false);
        assert.equal(multicastMsg.resultCode, 1);
    });

    it('sendMulticastMsg with noti', async () => {
        const multicastMsg = await AppServerManager.getInstance().sendMulticastMsg('testMessage', DEVICE_ID_LIST.slice(0, 5), false, 'notiTitle', 'notiMessage');
        assert.equal(multicastMsg.resultCode, 1);
    });

    it('sendBroadcastMsg', async () => {
        const broadcastMsg = await AppServerManager.getInstance().sendBroadcastMsg('testMessage', false);
        assert.equal(broadcastMsg.resultCode, 1);
    });

    it('sendBroadcastMsg with noti', async () => {
        const broadcastMsg = await AppServerManager.getInstance().sendBroadcastMsg('testMessage', false, 'notiTitle', 'notiMessage');
        assert.equal(broadcastMsg.resultCode, 1);
    });

    it('sendGroupMsg', async () => {
        const newGroup = await AppServerManager.getInstance().createDeviceGroup('groupName', 'groupDesc', DEVICE_ID_LIST.slice(0, 5));
        const groupMsg = await AppServerManager.getInstance().sendGroupMsg('testGroupMessage', newGroup.deviceGrpId, false);
        assert.equal(groupMsg.resultCode, 1);
    });

    it('sendGroupMsg with noti', async () => {
        const newGroup = await AppServerManager.getInstance().createDeviceGroup('groupName', 'groupDesc', DEVICE_ID_LIST.slice(0, 5));
        const groupMsg = await AppServerManager.getInstance().sendGroupMsg('testGroupMessage', newGroup.deviceGrpId, false, 'notiTitle', 'notiMessage');
        assert.equal(groupMsg.resultCode, 1);
    });

    it.skip('upstreamMessage', (done) => {
        AppServerManager.getInstance().addReceivedUpstreamMsgListener((res => {
            console.log(res);
            done();
        }));
    });
});