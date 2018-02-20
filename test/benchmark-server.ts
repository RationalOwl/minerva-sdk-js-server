import { AppServerManager } from '../src/AppServerManager';
import * as logUpdate from 'log-update';

import { createLogger } from 'bunyan';
import { setLogger } from '../src/Logger';

process.setMaxListeners(0);


const log = createLogger({
    name: 'bench',
    streams: [
        {
            path: './log/foo.log',
        }
    ]
});

setLogger(log);


const ulog = logUpdate.create(process.stdout);

const SERVICE_ID = 'b4a2166853ad4f19acc77b193d89c497';

const bench = {
    total: 0,
    tickCount: 0,
}

AppServerManager.getInstance().addReceivedUpstreamMsgListener((result) => {
    // console.log(result);
    ++bench.total;
    ++bench.tickCount;
});

AppServerManager.getInstance()
    .registerAppServer(SERVICE_ID, 'bench-node-app-server', 'gate.rationalowl.com', 9081).then(
    () => {
        setInterval(() => {
            ulog(`Total: ${bench.total}, TickCount: ${bench.tickCount}`);
            bench.tickCount = 0;
        }, 1000);
    });
