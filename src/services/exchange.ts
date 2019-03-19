import { DecodedLogEvent, ExchangeEvents, ExchangeFillEventArgs, ExchangeWrapper, LogWithDecodedArgs } from '0x.js';

interface SubscribeToFillEventsParams {
    exchange: ExchangeWrapper;
    fromBlock: number;
    toBlock: number;
    ethAccount: string;
    fillEventCallback: (log: LogWithDecodedArgs<ExchangeFillEventArgs>) => any;
}

export const subscribeToFillEvents = async ({
    exchange,
    fromBlock,
    toBlock,
    ethAccount,
    fillEventCallback,
}: SubscribeToFillEventsParams): Promise<string> => {
    const subscription = exchange.subscribe(
        ExchangeEvents.Fill,
        { makerAddress: ethAccount },
        (err: Error | null, logEvent?: DecodedLogEvent<ExchangeFillEventArgs>) => {
            if (err || !logEvent) {
                // tslint:disable-next-line:no-console
                console.error('There was a problem with the ExchangeFill event', err, logEvent);
                return;
            }
            fillEventCallback(logEvent.log);
        },
    );

    const pastFillEvents = await exchange.getLogsAsync<ExchangeFillEventArgs>(
        ExchangeEvents.Fill,
        {
            fromBlock,
            toBlock,
        },
        {
            makerAddress: ethAccount,
        },
    );

    pastFillEvents.forEach(fillEventCallback);

    return subscription;
};
