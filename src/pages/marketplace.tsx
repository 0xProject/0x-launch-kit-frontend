import React from 'react';

import { AdBlockDetector } from '../components/common/adblock_detector';
import { MainContent } from '../components/common/main_content';
import { Sidebar } from '../components/common/sidebar';
import { BuySellContainer } from '../components/marketplace/buy_sell';
import { OrderBookTableContainer } from '../components/marketplace/order_book';
import { OrderHistoryContainer } from '../components/marketplace/order_history';

class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <>
                <AdBlockDetector>
                    <Sidebar>
                        <BuySellContainer />
                    </Sidebar>
                    <MainContent>
                        <OrderHistoryContainer />
                    </MainContent>
                    <Sidebar>
                        <OrderBookTableContainer />
                    </Sidebar>
                </AdBlockDetector>
            </>
        );
    };
}

export { Marketplace };
