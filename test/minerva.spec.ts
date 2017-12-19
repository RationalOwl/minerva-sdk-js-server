import { AppServerManager } from "../src/AppServerManager";

import 'source-map-support/register'

import * as assert from 'assert';

const SERVICE_ID = 'ab03d23035e74e2fbd868a6f243c2dd5';

const DEVICE_ID_LIST = [
    '35d612418f354c7eba8c6492813ddf2d',
    '386dda6521bf40d58aa935022a5bb144',
    '3b3e4a3ae2d0412ea3d3eaf3f1eda5c5',
    '40b371b2c2ee460a887015d457e2d956',
    '40bbaaba05c44160963d4d3dc3f95178',
    '40f186b7666f413f83fb0754b02d21e4',
    '425e58901bc3485a819a453a85053dff',
    '466280bfa0994f80ae24a70d9343ddcc',
    '4f1c05c6303245508eb2336314149d12',
    '4f742a6a87494efab017b695181d5043',
    '50535e1edd5c45dd9412cb96889f291e',
    '55529cd8204f42f4874e5ea18b550276',
    '57d12696740244d29dbd1cf01e9694e4',

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