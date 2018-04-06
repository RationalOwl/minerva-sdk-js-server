import { AppServerManager } from "../src/AppServerManager";

import 'source-map-support/register'

import * as assert from 'assert';
import { Logger, setLogger } from "../src/Logger";

const SERVICE_ID = '4ac065b2b7b842628f6964a95f09dfc9';

const DEVICE_ID_LIST = [
    "4ac065b2b7b842628f6964a95f09dfc9",
    "c55f20d922344c9f95faaed1fed9207e",
    "b66d666c656644498e56a457a8bd6066",
    "32b316f7dbec4ab1af51aa4701947626",
    "4f3961685dd3452ea1185868578a6b5c",
    "bbb6194408e8435284c823666b51b4ad"
]

describe('[Minerva]', function () {
    this.timeout(20000);
    let server;

    before(async () => {
        setLogger(console);

        server = await AppServerManager.getInstance()
            .registerAppServer(SERVICE_ID, 'gyeongmin-app-server', 'localhost', 9081);

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
        const newGroup = await AppServerManager.getInstance().createDeviceGroup('groupName', 'groupDesc', DEVICE_ID_LIST.slice(0, 3));

        assert.equal(newGroup.resultCode, 1);
        assert.equal(newGroup.deviceGrpName, 'groupName');
        assert.equal(newGroup.deviceSize, 3);
        assert.equal(newGroup.desc, 'groupDesc');
    });

    it('addDeviceGroup', async () => {
        const newGroup = await AppServerManager.getInstance().createDeviceGroup('groupName', 'groupDesc', DEVICE_ID_LIST.slice(0, 3));
        const addGrpMsg = await AppServerManager.getInstance().addDeviceGroup(newGroup.deviceGrpId, DEVICE_ID_LIST.slice(3, 5));

        assert.equal(addGrpMsg.resultCode, 1);
        assert.equal(addGrpMsg.totalDeviceSize, 5);
        assert.equal(addGrpMsg.addedDeviceSize, 2);
    });


    it('subtractDeviceGroup', async () => {
        const newGroup = await AppServerManager.getInstance().createDeviceGroup('groupName', 'groupDesc', DEVICE_ID_LIST.slice(0, 5));
        const subGrpMsg = await AppServerManager.getInstance().subtractDeviceGroup(newGroup.deviceGrpId, DEVICE_ID_LIST.slice(0, 3));

        assert.equal(subGrpMsg.resultCode, 1);
        assert.equal(subGrpMsg.totalDeviceSize, 2);
        assert.equal(subGrpMsg.subtractDeviceSize, 3);
    });

    it('deleteDeviceGroup', async () => {
        const newGroup = await AppServerManager.getInstance().createDeviceGroup('groupName', 'groupDesc', DEVICE_ID_LIST.slice(0, 3));
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