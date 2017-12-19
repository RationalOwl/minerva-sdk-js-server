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

/**
 * A module that says hello!
 * @module AppServerManager
 */

export class AppServerManager {
    private static readonly TAG = "AppServerManager";

    private static instance: AppServerManager;


    public static getInstance(): AppServerManager {
        if (this.instance == null) {
            this.instance = new AppServerManager();
        }
        return this.instance;
    }

    private constructor() { }

    /**
     * @deprecated
     */
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

    /**
     * @lends AppServerManager.prototype
     * @method registerAppServer
     * @description 앱서버를 등록 및 구동한다. 최초 앱서버 등록시 뿐 아니라 이후에도 앱서버 재구동시마다 호출하여 라이브러리가 구동하도록 해야 한다.
     * 앱서버 등록 결과는 래셔널아울 콘솔에서도 실시간 확인이 가능하다.
     * @param  {string} serviceId 앱서버가 등록할 대상 고객 서비스의 서비스 아이디
     * @param  {string} regName 앱서버 등록 이름으로 래셔널아울 서비스의 관리자 콘솔에 표시되는 고객 서버의 이름 콘솔에서 앱 서버를 구분하는 역할을 한다.
     * @param  {string} [gateHost='gate.rationalowl.com'] 고객 앱 서버와 가장 가까운 래셔널아울 게이트서버
     * @param  {number} [gatePort=9081] 게이트서버의 포트
     * @returns {Promise} 앱 서버 등록에 대한 응답을 Promise로 리턴
     */
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

        ChannelClientManager.getInstance().init();
        return ChannelClientManager.getInstance()
            .requestToGate({ packet: req, data: { gate: { host: gateHost, port: gatePort } } }).then((res: ServerRegRes) => {
                const resultCode = res.getResultCode();
                return { resultCode, resultMsg: Result.getResultMessage(resultCode), appServerRegId: res.getServerRegId() };
            });
    }

    /**
     * @method unregisterAppServer
     * @description 앱서버를 등록해제한다. 앱서버 등록 해제 결과는 래셔널아울 콘솔에서도 실시간 확인이 가능하다.
     * @param  {string} serviceId 앱서버가 등록된 고객 서비스의 서비스 아이디
     * @param  {string} serverRegId 등록해제할 앱서버 등록 아이디
     * @returns {Promise} 앱 서버 등록해제에 대한 응답을 Promise로 리턴
     */
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



    /**
     * @method createDeviceGroup
     * @description 단말 그룹을 생성한다. 래셔널아울 콘솔에서도 실시간 결과 확인이 가능하다.
     * @param  {string} groupName 생성할 단말 그룹명
     * @param  {string} groupDesc 단말 그룹에 대한 설명 - optional 필드로 null입력가능
     * @param  {string[]} deviceList 단말 그룹 생성시 그룹 내 포함시킬 단말 목록 최대 2000단말 목록까지 포함가능
     * @returns {Promise} 단말그룹 생성에 대한 응답을 Promise로 리턴
     */
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

    /**
     * @method addDeviceGroup
     * @description 단말 그룹에 단말을 추가한다. 래셔널아울 콘솔에서도 실시간 결과 확인이 가능하다.
     * @param  {string} groupId 대상 단말 그룹 아이디
     * @param  {string[]} deviceList 단말 그룹에 추가할 단말 목록 한번에 최대 2000단말 목록까지 포함가능 단말 그룹 내 단말 수는 최대 백만
     *            대까지 포함 가능
     * @returns {Promise} 단말 추가에 대한 응답을 Promise로 리턴
     */
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
    /**
     * @method subtractDeviceGroup
     * @description 단말 그룹에서 단말을 제거한다. 래셔널아울 콘솔에서도 실시간 결과 확인이 가능하다.
     * @param  {string} groupId 대상 단말 그룹 아이디
     * @param  {string[]} deviceList 단말 그룹에서 제거할 단말 목록 한번에 최대 2000단말 목록까지 포함가능
     * @returns {Promise} 단말 제거에 대한 응답을 Promise로 리턴
     */
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

    /**
     * @method deleteDeviceGroup
     * @description 단말 그룹을 삭제한다. 래셔널아울 콘솔에서도 실시간 결과 확인이 가능하다.
     * @param  {string} groupId 대상 단말 그룹 아이디
     * @returns {Promise} 단말 그룹 제거에 대한 응답을 Promise로 리턴
     */
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

    /**
     * @method sendMulticastMsg
     * @description 한대 이상의 단말앱에 다운스트림 메시지를 발신한다. 래셔널아울 콘솔에서도 실시간 결과 확인이 가능하다.
     * @param  {string} data 단말에 전달할 데이터
     * @param  {string[]} deviceRegIds 메시지를 전달할 대상 단말앱의 단말 등록 아이디 목록 최대 2000 단말 목록 제한
     * @param  {boolean} supportMsgQ 메시지 큐잉 지원 여부 true일 경우 단말이 전원꺼짐 등의 이유로 데이터통신이 불가할 경우 기본 3일 동안
     *            래셔널아울 메시징 서버가 보관하다가 3일 이내 단말이 네트워크에 연결될 때 미전달 메시지를 전달한다.
     * @param  {string} [notiTitle=null] 알림 용도로 메시지 전달 시 단말앱이 비활성시 알림 타이틀로 표시할 문자
     * @param  {string} [notiMsg=null] 알림 용도로 메시지 전달 시 단말앱이 비활성시 알림 내용으로 표시할 문자
     * @returns {Promise} 보낸 메시지에 대한 응답을 Promise로 리턴
     */
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

    /**
     * @method sendBroadcastMsg
     * @description 고객 서비스에 등록된 모든 단말앱에 다운스트림 메시지를 발신한다. 래셔널아울 콘솔에서도 실시간 결과 확인이 가능하다.
     * @param  {string} data 단말에 전달할 데이터
     * @param  {boolean} supportMsgQ 메시지 큐잉 지원 여부 true일 경우 단말이 전원꺼짐 등의 이유로 데이터통신이 불가할 경우 기본 3일 동안
     *            래셔널아울 메시징 서버가 보관하다가 3일 이내 단말이 네트워크에 연결될 때 미전달 메시지를 전달한다.
     * @param  {string} [notiTitle=null] 알림 용도로 메시지 전달 시 단말앱이 비활성시 알림 타이틀로 표시할 문자
     * @param  {string} [notiMsg=null] 알림 용도로 메시지 전달 시 단말앱이 비활성시 알림 내용으로 표시할 문자
     * @returns {Promise} 보낸 메시지에 대한 응답을 Promise로 리턴
     */
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

    /**
     * @method sendGroupMsg
     * @description 단말 그룹에 등록된 단말앱에 다운스트림 메시지를 발신한다. 래셔널아울 콘솔에서도 실시간 결과 확인이 가능하다.
     * @param  {string} data 단말에 전달할 데이터
     * @param  {string} deviceGroupId 단말 그룹 아이디
     * @param  {boolean} supportMsgQ 메시지 큐잉 지원 여부 true일 경우 단말이 전원꺼짐 등의 이유로 데이터통신이 불가할 경우 기본 3일 동안
     *            래셔널아울 메시징 서버가 보관하다가 3일 이내 단말이 네트워크에 연결될 때 미전달 메시지를 전달한다.
     * @param  {string} [notiTitle=null] 알림 용도로 메시지 전달 시 단말앱이 비활성시 알림 타이틀로 표시할 문자
     * @param  {string} [notiMsg=null] 알림 용도로 메시지 전달 시 단말앱이 비활성시 알림 내용으로 표시할 문자
     * @returns {Promise} 보낸 메시지에 대한 응답을 Promise로 리턴
     */
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

    /**
     * @method addReceivedUpstreamMsgListener
     * @description 업스트림 메시지에 대한 응답을 받기 위해 리스너를 등록한다.
     * @param  {UpstreamMessageListenerType} listener 콜백 리스너
     */
    public addReceivedUpstreamMsgListener(listener: UpstreamMessageListenerType) {
        ChannelClientManager.getInstance().addReceivedUpstreamMsgListener(listener);
    }

    /**
     * @method removeReceivedUpstreamMsgListener
     * @description 등록한 리스너를 제거한다.
     * @param  {UpstreamMessageListenerType} listener 제거할 콜백 리스너
     */
    public removeReceivedUpstreamMsgListener(listener: UpstreamMessageListenerType) {
        ChannelClientManager.getInstance().removeReceivedUpstreamMsgListener(listener);
    }


    public release(done: Function) {
        ChannelClientManager.getInstance().release(done);
    }
}