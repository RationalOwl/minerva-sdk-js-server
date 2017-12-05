import { Request } from '../../../Request';
import { MinervaProtocol } from "../../../MinervaProtocol";


export type ServerRegReqJson = {
    cId: string;
    st: string;
    pm: {
        sId: string,
        rn: string,
        t: string,
        [id: string]: any
    };
}


export class ServerRegReq extends Request {
    constructor() {
        super(MinervaProtocol.CS_SERVER_REG_CMD_ID);
    }

    public getServiceId(): string {
        return this.mReqJson.pm.sId;
    }


    public setServiceId(serviceId: string): void {
        this.mReqJson.pm.sId = serviceId;
    }


    public getRegisterName(): string {
        return this.mReqJson.pm.rn;
    }


    public setRegisterName(mRegisterName: string): void {
        this.mReqJson.pm.rn = mRegisterName;
    }

    public getType(): number {
        return this.mReqJson.pm.t;
    }

    public setType(type: number) {
        this.mReqJson.pm.t = type;
    }
}