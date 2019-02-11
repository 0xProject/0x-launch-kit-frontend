import React from 'react';

import { OrderBookTableContainer } from '../components/marketplace/order_book';
import { OrderHistoryContainer } from '../components/marketplace/order_history';

class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <div>
                <OrderHistoryContainer />
                <OrderBookTableContainer />
            </div>
        );
    }
}

export { Marketplace };
