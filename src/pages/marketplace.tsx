import React from 'react';

import { OrderHistoryContainer } from '../components/marketplace/order_history';

class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <div>
                <OrderHistoryContainer />
            </div>
        );
    }
}

export { Marketplace };
