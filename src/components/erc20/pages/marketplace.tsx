import React from 'react';

import { CheckMetamaskStateModalContainer } from '../../common/check_metamask_state_modal_container';
import { ColumnNarrow } from '../../common/column_narrow';
import { ColumnWide } from '../../common/column_wide';
import { BuySellContainer } from '../marketplace/buy_sell';
import { OrderBookTableContainer } from '../marketplace/order_book';
import { OrderHistoryContainer } from '../marketplace/order_history';
import { WalletBalanceContainer } from '../marketplace/wallet_balance';

class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <>
                <ColumnNarrow>
                    <WalletBalanceContainer />
                    <BuySellContainer />
                </ColumnNarrow>
                <ColumnNarrow>
                    <OrderBookTableContainer />
                </ColumnNarrow>
                <ColumnWide>
                    <OrderHistoryContainer />
                </ColumnWide>
                <CheckMetamaskStateModalContainer />
            </>
        );
    };
}

export { Marketplace };
