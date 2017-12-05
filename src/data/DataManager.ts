import { Logger } from "../Logger";
import { PropertyCache } from "./PropertyCache";
import { HostDataCache } from "./HostDataCache";



export class DataManager {

    private static readonly TAG = "DataManager";

    private static instance: DataManager;
    private mPropertyFetcher: PropertyCache;
    private mDeviceFetcher: HostDataCache;

    public static getInstance(): DataManager {

        if (DataManager.instance == null) {
            DataManager.instance = new DataManager();
        }

        return DataManager.instance;
    }


    private constructor() {
        Logger.debug(DataManager.TAG, "constructor enter");
        this.mPropertyFetcher = new PropertyCache();
        this.mDeviceFetcher = new HostDataCache();
    }


    ////////////////////////////////////////////////
    // data operations related to device
    ////////////////////////////////////////////////      

    public getMacAddress(): string {
        return this.mDeviceFetcher.getMacAddress();
    }


    public getHostName(): string {
        return this.mDeviceFetcher.getHostName();
    }


    public getIp(): string {
        return this.mDeviceFetcher.getIp();
    }


    ////////////////////////////////////////////////
    // data operations related install & registration
    ////////////////////////////////////////////////    

    // public setGateServerUrl(url: string) {
    //     this.mPropertyFetcher.setGateServerUrl(url);
    // }


    // public getGateServerUrl() {
    //     return this.mPropertyFetcher.getGateServerUrl();
    // }


    public setChannelUrl(url: string) {
        this.mPropertyFetcher.setChannelUrl(url);
    }


    public getChannelUrl(): string {
        return this.mPropertyFetcher.getChannelUrl();
    }


    public setPrivateChannelUrl(url: string) {
        this.mPropertyFetcher.setPrivateChannelURL(url);
    }


    public getPrivateChannelUrl(): string {
        return this.mPropertyFetcher.getPrivateChannelURL();
    }


    // public setKeepAliveInterval(interval: number) {
    //     this.mPropertyFetcher.setKeepAliveInterval(interval);
    // }


    // public getKeepAliveInterval(): number {
    //     return this.mPropertyFetcher.getKeepAliveInterval();
    // }


    public setAppServerRegId(serverRegId: string) {
        this.mPropertyFetcher.setAppServerRegId(serverRegId);
    }


    public getAppServerRegId(): string {
        return this.mPropertyFetcher.getAppServerRegId();
    }


    public setServiceId(serviceId: string) {
        this.mPropertyFetcher.setServiceId(serviceId);
    }


    public getServiceId(): string {
        return this.mPropertyFetcher.getServiceId();
    }
}