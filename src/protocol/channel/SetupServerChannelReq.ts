import { Request } from '../Request';
import { MinervaProtocol } from "../MinervaProtocol";

export type SetupServerChannelReqJson = {
    cId: string;
    st: string;
    pm: {
        sId: string,
        rId: string,
        st: number,
        [id: string]: any
    };
}

export class SetupServerChannelReq extends Request {

    constructor(serviceId: string, regId: string, srcType: number) {
        super(MinervaProtocol.CH_SETUP_SERVER_CHANNEL_CMD_ID);
        this.mReqJson.pm.sId = serviceId;
        this.mReqJson.pm.st = srcType;
        this.mReqJson.pm.rId = regId;
    }

    public getRegId(): string {
        return this.mReqJson.pm.rId;
    }


    // public setRegId(regId: string): void {
    //     this.mReqJson.pm.rId = regId;
    // }


    public getSrcType(): number {
        return this.mReqJson.pm.st;
    }


    // public setSrcType(srcType: number): void {
    //     this.mReqJson.pm.st = srcType;
    // }


    public getServiceId(): string {
        return this.mReqJson.pm.sId;
    }


    // public setServiceId(mServiceId: string): void {
    //     this.mReqJson.pm.rId = mServiceId;
    // }
}