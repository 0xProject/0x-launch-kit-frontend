import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { changeMarket, goToHome } from '../../../store/actions';
import {
    getBaseToken,
    getCurrencyPair,
    getCurrentMarketLastPrice,
    getCurrentMarketTodayClosedOrders,
    getCurrentMarketTodayHighPrice,
    getCurrentMarketTodayLowerPrice,
    getCurrentMarketTodayVolume,
    getQuoteToken,
    getWeb3State,
} from '../../../store/selectors';
import { marketToString } from '../../../util/markets';
import { tokenAmountInUnits } from '../../../util/tokens';
import { CurrencyPair, StoreState, Token, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../../common/table';
import { TVChartContainer } from '../marketplace/tv_chart';

const MarketDetailCard = styled(Card)`
    max-height: 600px;
    min-height: 520px;
    overflow: auto;
    margin-top: 5px;
`;

const StyledHr = styled.hr`
    border-color: ${props => props.theme.componentsTheme.dropdownBorderColor};
`;

interface StateProps {
    baseToken: Token | null;
    quoteToken: Token | null;
    web3State?: Web3State;
    currencyPair: CurrencyPair;
    highPrice: BigNumber | number | null;
    lowerPrice: BigNumber | number | null;
    volume: BigNumber | null;
    closedOrders: number | null;
    lastPrice: string | null;
}

interface DispatchProps {
    changeMarket: (currencyPair: CurrencyPair) => any;
    goToHome: () => any;
}

type Props = StateProps & DispatchProps;

interface MarketStats {
    highPrice: BigNumber | null | number;
    lowerPrice: BigNumber | null | number;
    volume: BigNumber | null;
    closedOrders: number | null;
    lastPrice: string | null;
}

const statsToRow = (marketStats: MarketStats, baseToken: Token) => {
    return (
        <TR>
            <CustomTD>{baseToken.name}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{marketStats.lastPrice || '-'}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                {(marketStats.highPrice && marketStats.highPrice.toString()) || '-'}
            </CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                {(marketStats.lowerPrice && marketStats.lowerPrice.toString()) || '-'}
            </CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                {(marketStats.volume &&
                    `${tokenAmountInUnits(
                        marketStats.volume,
                        baseToken.decimals,
                        baseToken.displayDecimals,
                    ).toString()} ${baseToken.symbol.toUpperCase()}`) ||
                    '-'}{' '}
            </CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{marketStats.closedOrders || '-'}</CustomTD>
        </TR>
    );
};

class MarketDetails extends React.Component<Props> {
    public render = () => {
        const { baseToken, quoteToken, web3State, currencyPair } = this.props;
        let content: React.ReactNode;
        switch (web3State) {
            case Web3State.Locked:
            case Web3State.NotInstalled:
            case Web3State.Loading: {
                content = <EmptyContent alignAbsoluteCenter={true} text="There are no market details to show" />;
                break;
            }
            default: {
                if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
                    content = <LoadingWrapper minHeight="120px" />;
                } else if (!baseToken || !quoteToken) {
                    content = <EmptyContent alignAbsoluteCenter={true} text="There are no market details to show" />;
                } else {
                    const { highPrice, lowerPrice, volume, closedOrders, lastPrice } = this.props;
                    const marketStats = {
                        highPrice,
                        lowerPrice,
                        volume,
                        closedOrders,
                        lastPrice,
                    };
                    content = (
                        <>
                            <Table isResponsive={true}>
                                <THead>
                                    <TR>
                                        <TH>Project</TH>
                                        <TH styles={{ textAlign: 'right' }}>Last Price</TH>
                                        <TH styles={{ textAlign: 'right' }}>Max Price 24H</TH>
                                        <TH styles={{ textAlign: 'right' }}>Min Price 24H</TH>
                                        <TH styles={{ textAlign: 'right' }}>Volume 24H</TH>
                                        <TH styles={{ textAlign: 'right' }}>Orders Closed</TH>
                                    </TR>
                                </THead>
                                <tbody>{statsToRow(marketStats, baseToken)}</tbody>
                            </Table>
                            <StyledHr />
                            <TVChartContainer symbol={marketToString(currencyPair)} />
                        </>
                    );
                }
                break;
            }
        }
        const title = `Market Stats: ${marketToString(currencyPair)}`;

        return (
            <MarketDetailCard title={title} minHeightBody={'90px'}>
                {content}
            </MarketDetailCard>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseToken(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
        currencyPair: getCurrencyPair(state),
        highPrice: getCurrentMarketTodayHighPrice(state),
        lowerPrice: getCurrentMarketTodayLowerPrice(state),
        volume: getCurrentMarketTodayVolume(state),
        closedOrders: getCurrentMarketTodayClosedOrders(state),
        lastPrice: getCurrentMarketLastPrice(state),
    };
};
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        changeMarket: (currencyPair: CurrencyPair) => dispatch(changeMarket(currencyPair)),
        goToHome: () => dispatch(goToHome()),
    };
};

const MarketDetailsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MarketDetails);

export { MarketDetails, MarketDetailsContainer };
