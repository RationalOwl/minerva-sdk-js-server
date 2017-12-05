import * as _ from "lodash";
import { Packet } from "./Packet";

export type RequestJson = {
    cId: number;
    st: number;
    pm: { [id: string]: any };
}
export abstract class Request extends Packet {
    protected mReqJson: RequestJson;
    mIsReceive: boolean = false;

    constructor(reqJson: RequestJson | string | number) {
        super();
        if ('string' == typeof reqJson) {
            this.mReqJson = _.cloneDeep(JSON.parse(reqJson));
            this.mIsReceive = true;
        }
        if ('number' == typeof reqJson) {
            this.mReqJson = {
                cId: reqJson, st: Date.now(), pm: {}
            };
        }
        if ('object' == typeof reqJson) {
            this.mReqJson = _.cloneDeep(reqJson);
            this.mIsReceive = true;
        }
    }

    public getCmdId(): number {
        return Number(this.mReqJson.cId);
    }


    public getSrcTime(): number {
        return Number(this.mReqJson.st);
    }


    public setSrcTime(srcTime: number): void {
        this.mReqJson.st = srcTime;
    }


    public getReqParam(): { [id: string]: any } {
        return this.mReqJson.pm;
    }

    public getJson(): RequestJson {
        return this.mReqJson;
    }
}
