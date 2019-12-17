import { TickerCoingGecko } from './ticker.interface';

/*

curl -X GET https://api.coingecko.com/api/v3/coins/verisafe?tickers=true&market_data=false -H accept: application/json

{
  id: verisafe,
  symbol: vsf,
  name: VeriSafe,
  block_time_in_minutes: 0,
  categories: [
    Business Platform
  ],
  localization: {
    en: VeriSafe,
    es: VeriSafe,
    de: VeriSafe,
    nl: VeriSafe,
    pt: VeriSafe,
    fr: VeriSafe,
    it: VeriSafe,
    hu: VeriSafe,
    ro: VeriSafe,
    sv: VeriSafe,
    pl: VeriSafe,
    id: VeriSafe,
    zh: VeriSafe,
    zh-tw: VeriSafe,
    ja: VeriSafe,
    ko: VeriSafe,
    ru: VeriSafe,
    ar: VeriSafe,
    th: VeriSafe,
    vi: VeriSafe,
    tr: VeriSafe
  },
  description: {
    en: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    es: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    de: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    nl: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    pt: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    fr: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    it: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    hu: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    ro: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    sv: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    pl: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    id: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    zh: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    zh-tw: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    ja: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    ko: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    ru: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    ar: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    th: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    vi: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.,
    tr: VeriSafe will be the catalyst for projects, exchanges and communities to collaborate, creating an ecosystem where transparency, accountability, communication, and expertise go hand-in-hand to set a standard in the industry.
  },
  links: {
    homepage: [
      https://www.verisafe.io/,
      ,

    ],
    blockchain_site: [
      https://etherscan.io/token/0xba3a79d758f19efe588247388754b8e4d6edda81,
      ,
      ,
      ,

    ],
    official_forum_url: [
      ,
      ,

    ],
    chat_url: [
      ,
      ,

    ],
    announcement_url: [
      https://medium.com/@cpollo,

    ],
    twitter_screen_name: VeriSafeProject,
    facebook_username: verisafeprojectio,
    bitcointalk_thread_identifier: 5069236,
    telegram_channel_identifier: cpollo2,
    subreddit_url: null,
    repos_url: {
      github: [
        https://github.com/VeriSafe/Desktop-Wallet
      ],
      bitbucket: []
    }
  },
  image: {
    thumb: https://assets.coingecko.com/coins/images/7862/thumb/F9zWPLBf_400x400.jpg?1551233528,
    small: https://assets.coingecko.com/coins/images/7862/small/F9zWPLBf_400x400.jpg?1551233528,
    large: https://assets.coingecko.com/coins/images/7862/large/F9zWPLBf_400x400.jpg?1551233528
  },
  country_origin: NL,
  genesis_date: null,
  contract_address: 0xba3a79d758f19efe588247388754b8e4d6edda81,
  market_cap_rank: 2464,
  coingecko_rank: 3408,
  coingecko_score: 6.409,
  developer_score: 0,
  community_score: 14.216,
  liquidity_score: 1.87,
  public_interest_score: 24.808,
  community_data: {
    facebook_likes: 3445,
    twitter_followers: 4578,
    reddit_average_posts_48h: 0,
    reddit_average_comments_48h: 0,
    reddit_subscribers: 0,
    reddit_accounts_active_48h: 0,
    telegram_channel_user_count: 7775
  },
  developer_data: {
    forks: 0,
    stars: 0,
    subscribers: 0,
    total_issues: 0,
    closed_issues: 0,
    pull_requests_merged: 0,
    pull_request_contributors: 0,
    commit_count_4_weeks: 0
  },
  public_interest_stats: {
    alexa_rank: 2110430,
    bing_matches: 31500
  },
  status_updates: [
    {
      description: Earn monthly VSF by becoming a VeriSafe Ambassador. Anyone can enroll in this program and begin performing simple tasks that help bring awareness to VeriSafe, and earn themselves VSF. Submit the form below for more information. \r\n\r\nhttps://www.verisafe.io/verisafe-ambassador-program,
      category: general,
      created_at: 2019-04-09T22:29:51.405Z,
      user: João Campos,
      user_title: Lead Blockchain Developer,
      pin: true,
      project: {
        type: Coin,
        id: verisafe,
        name: VeriSafe,
        symbol: vsf,
        image: {
          thumb: https://assets.coingecko.com/coins/images/7862/thumb/F9zWPLBf_400x400.jpg?1551233528,
          small: https://assets.coingecko.com/coins/images/7862/small/F9zWPLBf_400x400.jpg?1551233528,
          large: https://assets.coingecko.com/coins/images/7862/large/F9zWPLBf_400x400.jpg?1551233528
        }
      }
    },
    {
      description: Want to get your hands on some easy $VSF? We will be opening up an Ambassador program that will reward contributors for completing easy to perform tasks that will help spread awareness of VeriSafe. Join http://t.me/cpollo2  to learn more. ,
      category: general,
      created_at: 2019-04-06T06:47:21.319Z,
      user: João Campos,
      user_title: Lead Blockchain Developer,
      pin: false,
      project: {
        type: Coin,
        id: verisafe,
        name: VeriSafe,
        symbol: vsf,
        image: {
          thumb: https://assets.coingecko.com/coins/images/7862/thumb/F9zWPLBf_400x400.jpg?1551233528,
          small: https://assets.coingecko.com/coins/images/7862/small/F9zWPLBf_400x400.jpg?1551233528,
          large: https://assets.coingecko.com/coins/images/7862/large/F9zWPLBf_400x400.jpg?1551233528
        }
      }
    }
  ],
  last_updated: 2019-04-17T08:17:50.290Z,
  tickers: [
    {
      base: VSF,
      target: ETH,
      market: {
        name: EtherFlyer,
        identifier: etherflyer,
        has_trading_incentive: false
      },
      last: 0.000001,
      converted_last: {
        btc: 0.0000000319,
        eth: 0.00000099994217752430518,
        usd: 0.000166310501773977737
      },
      volume: 0,
      converted_volume: {
        btc: 0.0,
        eth: 0.0,
        usd: 0.0
      },
      timestamp: 2019-04-17T08:20:58+00:00,
      is_anomaly: true,
      is_stale: false,
      coin_id: verisafe
    },
    {
      base: VSF,
      target: BTC,
      market: {
        name: CoinBene,
        identifier: coinbene,
        has_trading_incentive: true
      },
      last: 8e-9,
      converted_last: {
        btc: 0.000000008,
        eth: 0.000000250753034605396,
        usd: 0.00004172096946767144
      },
      volume: 21393897.88,
      converted_volume: {
        btc: 0.17115118304,
        eth: 5.36458481544794812096048,
        usd: 892.5741602459607487525472
      },
      timestamp: 2019-04-17T04:44:45+00:00,
      is_anomaly: false,
      is_stale: true,
      coin_id: verisafe
    },
    {
      base: VSF,
      target: BTC,
      market: {
        name: Idax,
        identifier: idax,
        has_trading_incentive: false
      },
      last: 1e-8,
      converted_last: {
        btc: 0.00000001,
        eth: 0.000000312216159482373,
        usd: 0.0000519132435186206
      },
      volume: 100205,
      converted_volume: {
        btc: 0.00100205,
        eth: 0.031285620260931186465,
        usd: 5.201966566783377223
      },
      timestamp: 2019-04-16T23:31:06+00:00,
      is_anomaly: false,
      is_stale: true,
      coin_id: verisafe
    },
    {
      base: VSF,
      target: WETH,
      market: {
        name: TokenJar,
        identifier: tokenjar,
        has_trading_incentive: false
      },
      last: 0,
      converted_last: {
        btc: 0.0,
        eth: 0.0,
        usd: 0.0
      },
      volume: 0,
      converted_volume: {
        btc: 0.0,
        eth: 0.0,
        usd: 0.0
      },
      timestamp: 2019-04-12T04:26:26+00:00,
      is_anomaly: false,
      is_stale: true,
      coin_id: verisafe
    },
    {
      base: VSF,
      target: BTC,
      market: {
        name: BITKER,
        identifier: bitker,
        has_trading_incentive: false
      },
      last: 2e-8,
      converted_last: {
        btc: 0.00000002,
        eth: 0.000000579632627558528,
        usd: 0.0000796984195604698
      },
      volume: 0,
      converted_volume: {
        btc: 0.0,
        eth: 0.0,
        usd: 0.0
      },
      timestamp: 2019-03-19T00:19:34+00:00,
      is_anomaly: false,
      is_stale: true,
      coin_id: verisafe
    },
    {
      base: VSF,
      target: BTC,
      market: {
        name: STEX,
        identifier: stocks_exchange,
        has_trading_incentive: false
      },
      last: 0,
      converted_last: {
        btc: 0.00000001,
        eth: 0.000000312315627596678,
        usd: 0.0000519731198887258
      },
      volume: 0,
      converted_volume: {
        btc: 0.00021492,
        eth: 0.006712287468307803576,
        usd: 1.1170062926484948936
      },
      timestamp: 2019-04-17T01:49:44+00:00,
      is_anomaly: true,
      is_stale: true,
      coin_id: verisafe
    },
    {
      base: VSF,
      target: BTC,
      market: {
        name: bleutrade,
        identifier: bleutrade,
        has_trading_incentive: false
      },
      last: 0,
      converted_last: {
        btc: 0.0,
        eth: 0.0,
        usd: 0.0
      },
      volume: 0,
      converted_volume: {
        btc: 0.0,
        eth: 0.0,
        usd: 0.0
      },
      timestamp: 2019-03-30T05:48:11+00:00,
      is_anomaly: true,
      is_stale: true,
      coin_id: verisafe
    }
  ]
}
*/

export interface CoinDetailCoinGecko {
    id: string;
    symbol: string;
    name: string;
    block_time_in_minutes: number;
    categories: string[];
    url: string;
    localization: { [key: string]: string };
    description: { [key: string]: string };
    trade_volume_24h_btc: number;
    links: {
        homepage: string[];
        blockchain_site: string[];
        official_forum_url: string[];
        chat_url: string[];
        announcement_url: string[];
        twitter_screen_name: string;
        facebook_username: string;
        bitcointalk_thread_identifier: number;
        telegram_channel_identifier: string;
        subreddit_url: string | null;
        repos_url: {
            github: string[];
            bitbucket: string[];
        };
    };
    image: {
        thumb: string;
        small: string;
        large: string;
    };
    country_origin: string;
    genesis_date: string | null;
    contract_address: string;
    market_cap_rank: number;
    coingecko_rank: number;
    coingecko_score: number;
    developer_score: number;
    community_score: number;
    liquidity_score: number;
    public_interest_score: number;
    community_data: {
        facebook_likes: number;
        twitter_followers: number;
        reddit_average_posts_48h: number;
        reddit_average_comments_48h: number;
        reddit_subscribers: number;
        reddit_accounts_active_48h: number;
        telegram_channel_user_count: number;
    };
    developer_data: {
        forks: number;
        stars: number;
        subscribers: number;
        total_issues: number;
        closed_issues: number;
        pull_requests_merged: number;
        pull_request_contributors: number;
        commit_count_4_weeks: number;
        last_4_weeks_commit_activity_series: any[];
    };
    public_interest_stats: {
        alexa_rank: number;
        bing_matches: number;
    };
    last_updated: Date;
    tickers: TickerCoingGecko[];
}
