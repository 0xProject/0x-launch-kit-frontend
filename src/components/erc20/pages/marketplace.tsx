import React from 'react';

import { CheckMetamaskStateModalContainer } from '../../common/check_metamask_state_modal_container';
import { ColumnNarrow } from '../../common/column_narrow';
import { ColumnWide } from '../../common/column_wide';
import { BuySellContainer } from '../marketplace/buy_sell';
import { OrderBookTableContainer } from '../marketplace/order_book';
import { OrderHistoryContainer } from '../marketplace/order_history';
import { WalletBalanceContainer } from '../marketplace/wallet_balance';
import GoogleADS from '../../common/google';


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
                    <GoogleADS client={'ca-pub-8425903251487932'} slot={'3929149992'}  format={'auto'} responsive={'auto'}/>
                    <GoogleADS client={'ca-pub-8425903251487932'} slot={'2421724683'}  format={'auto'} responsive={'auto'}/>
                    <GoogleADS client={'ca-pub-8425903251487932'} slot={'7055050362'}  format={'auto'} responsive={'auto'}/>
                </ColumnWide>
                <CheckMetamaskStateModalContainer />
            </>
        );
    };
}



export { Marketplace };
