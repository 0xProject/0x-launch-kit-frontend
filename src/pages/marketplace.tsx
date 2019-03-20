import React from 'react';

import { MainContent } from '../components/common/main_content';
import { Sidebar } from '../components/common/sidebar';
import { BuySellContainer } from '../components/marketplace/buy_sell';
import { OrderBookTableContainer } from '../components/marketplace/order_book';
import { OrderHistoryContainer } from '../components/marketplace/order_history';
import { WalletBalanceContainer } from '../components/marketplace/wallet_balance';

class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <>
                <Sidebar>
                    <WalletBalanceContainer />
                    <BuySellContainer />
                </Sidebar>
                <MainContent>
                    <OrderHistoryContainer />
                </MainContent>
                <Sidebar>
                    <OrderBookTableContainer />
                </Sidebar>
            </>
        );
    };
}

export { Marketplace };
