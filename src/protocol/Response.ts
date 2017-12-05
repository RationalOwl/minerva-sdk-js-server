import * as _ from "lodash";
import { RequestJson, Request } from "./Request";
import { Result } from "../Result";
import { Packet } from "./Packet";



export type ResponseJson = {
    cId: number | null;
    rc: number;
    st: number | null;
    syncT: number;
    pm: { [id: string]: any };
}

export abstract class Response extends Packet {
    mIsReceive: boolean = false;
    protected mResJson: ResponseJson;

    constructor(reqJson: ResponseJson | string | number | Request, resultCode?: number) {
        super();
        if (!reqJson) {
            reqJson = Result.RESULT_OK;
        }
        if ('string' == typeof reqJson) {
            this.mResJson = _.cloneDeep(JSON.parse(reqJson));
            this.mIsReceive = true;
        } else if ('number' == typeof reqJson) {
            this.mResJson = {
                cId: null,
                rc: reqJson,
                st: null,
                syncT: Date.now(),
                pm: {}
            };
        } else if (reqJson instanceof Request) {
            resultCode = resultCode ? resultCode : Result.RESULT_OK;
            this.mResJson = {
                cId: reqJson.getCmdId(),
                rc: resultCode,
                st: reqJson.getSrcTime(),
                syncT: Date.now(),
                pm: {}
            };
        } else if ('object' == typeof reqJson) {
            this.mResJson = _.cloneDeep(reqJson);
            this.mIsReceive = true;
        }
    }


    public getCmdId(): number {
        return Number(this.mResJson.cId);
    }


    public getResultCode(): number {
        return Number(this.mResJson.rc);
    }


    public setResultCode(resultCode: number): void {
        this.mResJson.rc = resultCode;
    }


    public getSrcTime(): number {
        return Number(this.mResJson.st);
    }


    public setSrcTime(srcTime: number): void {
        this.mResJson.st = srcTime;
    }


    public getSyncTime(): number {
        return Number(this.mResJson.syncT);
    }

    public setSyncTime(syncTime: number): void {
        this.mResJson.syncT = syncTime;
    }

    public getJson(): ResponseJson{
        return this.mResJson;
    }
}
