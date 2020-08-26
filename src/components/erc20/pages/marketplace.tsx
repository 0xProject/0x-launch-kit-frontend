import React from 'react';

import { CheckMetamaskStateModalContainer } from '../../common/check_metamask_state_modal_container';
import { Column, ColumnsWrapper } from '../../common/column';
import { Content } from '../common/content_wrapper';
import { BuySellContainer } from '../marketplace/buy_sell';
import { OrderBookTableContainer } from '../marketplace/order_book';
import { OrderHistoryContainer } from '../marketplace/order_history';
import { WalletBalanceContainer } from '../marketplace/wallet_balance';

class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <Content>
                <ColumnsWrapper>
                    <Column>
                        <WalletBalanceContainer />
                        <BuySellContainer />
                    </Column>
                    <Column>
                        <OrderBookTableContainer />
                    </Column>
                    <Column isWide={true}>
                        <OrderHistoryContainer />
                    </Column>
                    <CheckMetamaskStateModalContainer />
                </ColumnsWrapper>
            </Content>
        );
    };
}

export { Marketplace };
