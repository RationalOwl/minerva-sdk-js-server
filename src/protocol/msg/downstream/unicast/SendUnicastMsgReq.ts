import { Request } from '../../../Request';
import { MinervaProtocol } from "../../../MinervaProtocol";


export type SendBroadcastMsgReqParam = {
    sId: string,
    sRId: string,
    dRId: string,
    data: string,
    q: number,
    noti?: string;
}

export class SendUnicastMsgReq extends Request {

    constructor() {
        super(MinervaProtocol.MSG_SEND_UNICAST_CMD_ID);
    }


    public getServiceId(): string {
        return this.mReqJson.pm.sId;
    }

    public setServiceId(serviceId: string) {
        this.mReqJson.pm.sId = serviceId;
    }


    public getServerRegId(): string {
        return this.mReqJson.pm.sRId;
    }


    public setServerRegId(serverRegId: string) {
        this.mReqJson.pm.sRId = serverRegId;
    }


    public getDeviceRegId(): string {
        return this.mReqJson.pm.dRId;
    }


    public setDeviceRegId(deviceRegId: string) {
        this.mReqJson.pm.dRId = deviceRegId;
    }

    public getData(): string {
        return this.mReqJson.pm.data;
    }


    public setData(data: string) {
        this.mReqJson.pm.data = data;
    }


    public getSupportMsgQ(): number {
        return this.mReqJson.pm.q;
    }


    public setSupportMsgQ(mSupportMsgQ: number) {
        this.mReqJson.pm.q = mSupportMsgQ;
    }


    public getNotiStr(): string {
        return this.mReqJson.pm.noti;
    }


    public setNotiStr(mNotiStr: string) {
        this.mReqJson.pm.noti = mNotiStr;
    }
}