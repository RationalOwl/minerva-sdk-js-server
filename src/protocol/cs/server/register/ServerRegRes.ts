import { MinervaProtocol } from "../../../MinervaProtocol";
import { Response } from '../../../Response';


export type ServerRegReqJson = {
    cId: string;
    st: string;
    pm: {
        sRId: string,
        cu: string,
        pcu: string,
    };
}


export class ServerRegRes extends Response {
    constructor(resJSON: string) {
        super(resJSON);
    }

    public getServerRegId(): string {
        return this.mResJson.pm.sRId;
    }


    public setServerRegId(serverRegId: string): void {
        this.mResJson.pm.sRId = serverRegId;
    }


    public getChannelUrl(): string {
        return this.mResJson.pm.cu;
    }


    public setChannelUrl(channelUrl: string): void {
        this.mResJson.pm.cu = channelUrl;
    }


    public getPrivateChannelUrl(): string {
        return this.mResJson.pm.pcu;
    }


    public setPrivateChannelUrl(channelUrl: string): void {
        this.mResJson.pm.pcu = channelUrl;
    }
}