import React from 'react';

import { CheckMetamaskStateModalContainer } from '../../common/check_metamask_state_modal_container';
import { ColumnNarrow } from '../../common/column_narrow';
import { ColumnWide } from '../../common/column_wide';
import { Content } from '../common/content_wrapper';
import { BuySellContainer } from '../marketplace/buy_sell';
// import GoogleADS from '../../common/google';
import { OrderBookTableContainer } from '../marketplace/order_book';
import { OrderFillsContainer } from '../marketplace/order_fills';
import { OrderHistoryContainer } from '../marketplace/order_history';
import { WalletBalanceContainer } from '../marketplace/wallet_balance';




class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <Content>
                <ColumnNarrow>
                    <WalletBalanceContainer />
                    <BuySellContainer />
                </ColumnNarrow>
                <ColumnNarrow>
                    <OrderBookTableContainer />
                </ColumnNarrow>
                <ColumnWide>
                    <OrderHistoryContainer />
                    <OrderFillsContainer />
                   { /*<GoogleADS client={'ca-pub-8425903251487932'} slot={'3929149992'}  format={'auto'} responsive={'auto'}/>
                    <GoogleADS client={'ca-pub-8425903251487932'} slot={'2421724683'}  format={'auto'} responsive={'auto'}/>
        <GoogleADS client={'ca-pub-8425903251487932'} slot={'7055050362'}  format={'auto'} responsive={'auto'}/> */}
                </ColumnWide>
                <CheckMetamaskStateModalContainer />
            </Content>
        );
    };
}



export { Marketplace };
