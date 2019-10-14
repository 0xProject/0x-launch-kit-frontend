import React from 'react';
import styled from 'styled-components';


import { themeBreakPoints } from '../../../themes/commons';
import { FiatOnRampModalContainer } from '../../account/fiat_modal';
import { CheckWalletStateModalContainer } from '../../common/check_wallet_state_modal_container';
import { ColumnNarrow } from '../../common/column_narrow';
import { ColumnWide } from '../../common/column_wide';
import { Content } from '../common/content_wrapper';
import { MarketDetailsContainer } from '../common/market_details';
import { MarketsListContainer } from '../common/markets_list';
import { BuySellContainer } from '../marketplace/buy_sell';
import { MarketFillsContainer } from '../marketplace/market_fills';
// import GoogleADS from '../../common/google';
import { OrderBookTableContainer } from '../marketplace/order_book';
import { OrderFillsContainer } from '../marketplace/order_fills';
import { OrderHistoryContainer } from '../marketplace/order_history';
import { WalletBalanceContainer } from '../marketplace/wallet_balance';

const ColumnWideDouble = styled.div`
    @media (min-width: ${themeBreakPoints.md}) {
        flex-grow: 3;
    }
`;

const ContentDoubleHeight = styled(Content)`
    @media (min-width: ${themeBreakPoints.xl}) {
        height: calc(200% - ${themeDimensions.footerHeight});
    }
`;

class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <>
                <ContentDoubleHeight>
                    <ColumnWide>
                        <MarketsListContainer />
                    </ColumnWide>
                    <ColumnWideDouble>
                        <MarketDetailsContainer />
                    </ColumnWideDouble>
                </Content>
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
                        <MarketFillsContainer />
                        <OrderFillsContainer />
                        {/*<GoogleADS client={'ca-pub-8425903251487932'} slot={'3929149992'}  format={'auto'} responsive={'auto'}/>
                    <GoogleADS client={'ca-pub-8425903251487932'} slot={'2421724683'}  format={'auto'} responsive={'auto'}/>
        <GoogleADS client={'ca-pub-8425903251487932'} slot={'7055050362'}  format={'auto'} responsive={'auto'}/> */}
                    </ColumnWide>
                    <CheckWalletStateModalContainer />
                    <FiatOnRampModalContainer />
                </Content>
            </>
        );
    };
}

export { Marketplace };
