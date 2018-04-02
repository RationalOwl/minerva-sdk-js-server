import { Response } from '../Response';
import { MinervaProtocol } from "../MinervaProtocol";

export type SetupServerChannelResJson = {
    cId: string | null;
    rc: string;
    st: string | null;
    syncT: string;
    pm: {
        hb: number,
        [id: string]: any
    };
}

export class SetupServerChannelRes extends Response {

    constructor(resJson: string) {
        super(resJson);
    }

    public getKeepAlive(): number {
        return this.mResJson.pm.hb;
    }

    // public setKeepAlive(keepAlive: number): void {
    //     this.mResJson.pm.hb = keepAlive;
    // }
}