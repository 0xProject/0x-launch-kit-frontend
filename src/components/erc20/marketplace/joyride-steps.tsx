import { Step } from 'react-joyride';

const commonSteps: Step[] = [
    {
        target: '.markets-list',
        content: 'Markets Lists: Lists all markets listed in this dex',
    },
    {
        target: '.market-details',
        content: 'Market Stats: Show all market details related to the selected pair and respective graphic',
    },
    {
        target: '.wallet-balance',
        content: 'Wallet Balances: Shows your balances of current active pair',
        placementBeacon: 'bottom',
        placement: 'bottom',
    },
    {
        target: '.buy-sell',
        content:
            'Buy or sell the current active pair with limit and market options. Market buy/sell will buy directly from orders on orderbook, market limit buy/sell will buy or sell at the fixed price, if no order with that value it will place a order.',
        placement: 'bottom',
        placementBeacon: 'bottom',
    },
    {
        target: '.orderbook',
        content: 'OrderBook: Shows bid and asks for active current pair',
    },
    {
        target: '.orderhistory',
        content:
            'My Current Orders: Shows your open orders for active current pair. You can check filled balance and cancel orders here.',
    },
    {
        target: '.market-fills',
        content: 'Market History: Shows most recent market fills for the current active pair.',
    },
    {
        target: '.order-fills',
        content: '0x Mesh Trades: Shows all recent trades on 0x network for the listed pairs on this dex.',
    },
];

export const marketPlaceSteps: Step[] = [
    {
        target: '.theme-switcher',
        content: 'Choose a theme between Light or Dark',
        disableBeacon: true,
        floaterProps: { disableAnimation: true },
    },
    {
        target: '.buy-eth',
        content:
            'Buy ETH with Apple Pay, Credit or Debit Cards using our integrated fiat on ramps from our parterns: Wyre and Coindirect',
    },
    {
        target: '.my-wallet',
        content:
            'Navigate to your Wallet. Here you can check all token balances, transfer tokens and buy tokens instantly',
    },
    {
        target: '.wallet-dropdown',
        content:
            'Check the navigation menu. Here you can copy to clipboard, set alerts, check your etherscan wallet, go to launchpad or lend tokens at lending page',
    },
    {
        target: '.markets-dropdown',
        content: 'Check all markets clicking on this dropdown',
    },
    {
        target: '.notifications',
        content: 'Check all related blockchain notifications here from market buy, market sell and token transfers.',
    },
];

const noLoginWallet: Step[] = [
    {
        target: '.connect-wallet',
        content: 'Connect Wallet to start use the platform clicking here',
        disableBeacon: true,
        floaterProps: { disableAnimation: true },
    },
];

export const allSteps = marketPlaceSteps.concat(commonSteps);

export const noWalletSteps = noLoginWallet.concat(commonSteps);
// export const noWalletSteps = commonSteps;
