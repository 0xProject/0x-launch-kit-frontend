import React from 'react';
import styled from 'styled-components';

import { BuySellContainer } from '../components/marketplace/buy_sell';
import { OrderBookTableContainer } from '../components/marketplace/order_book';
import { OrderHistoryContainer } from '../components/marketplace/order_history';

const MarketplaceWrapper = styled.div`
    flex-shrink: 1;
    width: 100%;
`;
class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <MarketplaceWrapper>
                <OrderHistoryContainer />
                <OrderBookTableContainer />
                <BuySellContainer />
            </MarketplaceWrapper>
        );
    };
}

export { Marketplace };
