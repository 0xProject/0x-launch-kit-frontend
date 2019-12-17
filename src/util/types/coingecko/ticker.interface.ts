export interface TickerCoingGecko {
    base: string;
    target: string;
    market: {
        name: string;
        identifier: string;
        has_trading_incentive: boolean;
    };
    last: number;
    volume: number;
    converted_last: {
        btc: number;
        eth: number;
        usd: number;
    };
    converted_volume: {
        btc: number;
        eth: number;
        usd: number;
    };
    timestamp: Date;
    is_anomaly: boolean;
    is_stale: boolean;
    trade_url: string;
    coin_id: string;
}
