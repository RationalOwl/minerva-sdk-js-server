import { ConsoleJobEventParam } from "./ConsoleJobEvent";
import { AsyncResDeviceGrpAddedParam } from "./devicegroup/stable/add/AsyncResDeviceGrpAdded";
import { Packet } from "./Packet";
import { cloneDeep } from "lodash";

export type ConsoleEventJson = {
    cId: number;
    st: number;
    pm: { [id: string]: any };
}

export abstract class ConsoleEvent extends Packet {
    protected mJson: ConsoleEventJson;
    mIsReceive: boolean = false;

    constructor(data: ConsoleEventJson | string | number) {
        super();
        if ('string' == typeof data) {
            this.mJson = cloneDeep(JSON.parse(data));
            this.mIsReceive = true;
        }
        if ('number' == typeof data) {
            this.mJson = {
                cId: data, st: Date.now(), pm: {}
            };
        }
        if ('object' == typeof data) {
            this.mJson = cloneDeep(data);
            this.mIsReceive = true;
        }
    }

    public getCmdId(): number {
        return this.mJson.cId;
    }


    public getSrcTime(): number {
        return this.mJson.st;
    }


    public setSrcTime(srcTime: number) {
        this.mJson.st = srcTime;
    }


    public getReqParam(): { [id: string]: any } {
        return this.mJson.pm;
    }

    public getJson(): ConsoleEventJson{
        return this.mJson;
    }
}