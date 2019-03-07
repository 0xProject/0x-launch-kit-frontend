import React from 'react';

import { AddBlockDetector } from '../components/common/addblock_detector';
import { MainContent } from '../components/common/main_content';
import { Sidebar } from '../components/common/sidebar';
import { BuySellContainer } from '../components/marketplace/buy_sell';
import { OrderBookTableContainer } from '../components/marketplace/order_book';
import { OrderHistoryContainer } from '../components/marketplace/order_history';

class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <>
                <AddBlockDetector>
                    <Sidebar>
                        <BuySellContainer />
                    </Sidebar>
                    <MainContent>
                        <OrderHistoryContainer />
                    </MainContent>
                    <Sidebar>
                        <OrderBookTableContainer />
                    </Sidebar>
                </AddBlockDetector>
            </>
        );
    };
}

export { Marketplace };
