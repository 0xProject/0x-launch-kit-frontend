import React from 'react';
import styled from 'styled-components';

import { MainContent } from '../components/common/main_content';
import { Sidebar } from '../components/common/sidebar';
import { OrderBookTableContainer } from '../components/marketplace/order_book';
import { OrderHistoryContainer } from '../components/marketplace/order_history';

class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <>
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
