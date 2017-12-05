import { Logger } from "../Logger";

import { networkInterfaces, NetworkInterfaceInfoIPv4, hostname } from 'os';

export class HostDataCache {
    static readonly TAG = "DeviceInfoFetcher";

    mIp: string;
    mMacAddr: string;
    mHostName: string;

    public HostDataCache() {
        this.load();
    }

    public getIp(): string {
        return this.mIp;
    }

    public getMacAddress(): string {
        return this.mMacAddr;
    }

    public getHostName(): string {
        return this.mHostName;
    }

    private async load() {
        Logger.debug(HostDataCache.TAG, "load enter");

        this.mHostName = hostname();

        const networkInterface: NetworkInterfaceInfoIPv4 = [].concat.apply([], Object.values(networkInterfaces()))
            .filter((details: NetworkInterfaceInfoIPv4) => details.family === 'IPv4' && !details.internal)
            .pop();

        this.mIp = networkInterface.address;

        this.mMacAddr = networkInterface.mac;
    }
}