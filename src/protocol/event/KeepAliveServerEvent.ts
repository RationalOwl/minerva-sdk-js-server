import { Event } from '../Event';
import { MinervaProtocol } from "../MinervaProtocol";




export type KeepAliveServerEventParam = {
    sId: string,
    rId: string,
    st: number,
}

export class KeepAliveServerEvent extends Event {

    constructor(regId: string, serviceId: string, srcType: number) {
        super(MinervaProtocol.EVT_HEARTBEAT_SERVER_CMD_ID);
        this.mReqJson.pm.sId = serviceId;
        this.mReqJson.pm.rId = regId;
        this.mReqJson.pm.st = srcType;
    }


    public getServiceId(): string {
        return this.mReqJson.pm.sId;
    }


    // public setServiceId(serviceId: string) {
    //     this.mReqJson.pm.sId = serviceId;
    // }


    public getRegId(): string {
        return this.mReqJson.pm.rId;
    }


    // public setRegId(deviceRegId: string) {
    //     this.mReqJson.pm.rId = deviceRegId;
    // }


    public getSrcType(): number {
        return this.mReqJson.pm.st;
    }


    // public setSrcType(srcType: number) {
    //     this.mReqJson.pm.st = srcType;
    // }
}