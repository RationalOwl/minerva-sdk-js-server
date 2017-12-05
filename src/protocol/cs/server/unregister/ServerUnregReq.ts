import { Request } from '../../../Request';
import { MinervaProtocol } from "../../../MinervaProtocol";


export type ServerUnregReqParam = {
    sId: string,
    sRId: string,
}

export class ServerUnregReq extends Request {

    constructor() {
        super(MinervaProtocol.CS_SERVER_UNREG_CMD_ID);
    }

    public getServiceId(): string {
        return this.mReqJson.pm.sId;
    }


    public setServiceId(serviceId: string): void {
        this.mReqJson.pm.sId = serviceId;
    }

    public getServerRegId(): string {
        return this.mReqJson.pm.sRId;
    }

    public setServerRegId(serverRegId: string): void {
        this.mReqJson.pm.sRId = serverRegId;
    }

}