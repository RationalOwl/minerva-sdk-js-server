import { Logger } from "../Logger";


export class PropertyCache {
    private static readonly TAG = "PropertyInfoFetcher";

    private static readonly DEFAULT_KEEP_ALIVE_INTERVAL = 30;

    properties: {
        gateUrl: string;
        channelUrl: string;
        privateChannelUrl: string;
        keepAliveInterval: number;
        serverRegId: string;
        serviceId: string;
    } = {
            gateUrl: null,
            channelUrl: null,
            privateChannelUrl: null,
            keepAliveInterval: null,
            serverRegId: null,
            serviceId: null,
        }


    public PropertyCache(option: Object) {
        Object.assign(this.properties, option);
    }

    // public setGateServerUrl(url: string) {
    //     this.properties.gateUrl = url;
    // }


    // public getGateServerUrl(): string {
    //     return this.properties.gateUrl;
    // }



    public setChannelUrl(url: string) {
        this.properties.channelUrl = url;
    }


    public getChannelUrl(): string {
        return this.properties.channelUrl;
    }


    public setPrivateChannelURL(url: string) {
        this.properties.privateChannelUrl = url;
    }


    public getPrivateChannelURL(): string {
        return this.properties.privateChannelUrl;
    }


    // public setKeepAliveInterval(interval: number) {
    //     this.properties.keepAliveInterval = interval;
    // }


    // public getKeepAliveInterval(): number {
    //     return this.properties.keepAliveInterval;
    // }


    public setAppServerRegId(serverRegId: string) {
        this.properties.serverRegId = serverRegId;
    }


    public getAppServerRegId(): string {
        return this.properties.serverRegId;
    }


    public setServiceId(serviceId: string) {
        this.properties.serviceId = serviceId;
    }


    public getServiceId(): string {
        return this.properties.serviceId;
    }

    private setDefault() {
        Logger.debug(PropertyCache.TAG, "setDefault enter");
        this.properties.keepAliveInterval = PropertyCache.DEFAULT_KEEP_ALIVE_INTERVAL;
    }

}