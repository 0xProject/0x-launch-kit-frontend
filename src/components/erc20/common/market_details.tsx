import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { USE_RELAYER_MARKET_UPDATES } from '../../../common/constants';
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
import { isMobile } from '../../../util/screen';
import { tokenAmountInUnits } from '../../../util/tokens';
import { CurrencyPair, StoreState, Token, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { withWindowWidth } from '../../common/hoc/withWindowWidth';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../../common/table';

const TVChartContainer = React.lazy(() => import('../marketplace/tv_chart'));

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

interface OwnProps {
    windowWidth: number;
}

type Props = StateProps & DispatchProps & OwnProps;

interface MarketStats {
    highPrice: BigNumber | null | number;
    lowerPrice: BigNumber | null | number;
    volume: BigNumber | null;
    closedOrders: number | null;
    lastPrice: string | null;
}

const statsToRow = (marketStats: MarketStats, baseToken: Token, currencyPair: CurrencyPair) => {
    const lastPrice = marketStats.lastPrice
        ? new BigNumber(marketStats.lastPrice).toFixed(currencyPair.config.pricePrecision)
        : '-';
    let volume;
    if (USE_RELAYER_MARKET_UPDATES) {
        volume =
            (marketStats.volume &&
                `${marketStats.volume.toFixed(baseToken.displayDecimals)} ${baseToken.symbol.toUpperCase()}`) ||
            '- ';
    } else {
        volume =
            (marketStats.volume &&
                `${tokenAmountInUnits(
                    marketStats.volume,
                    baseToken.decimals,
                    baseToken.displayDecimals,
                ).toString()} ${baseToken.symbol.toUpperCase()}`) ||
            '- ';
    }

    return (
        <TR>
            <CustomTD>{baseToken.name}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{lastPrice}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                {(marketStats.highPrice && marketStats.highPrice.toFixed(currencyPair.config.pricePrecision)) || '-'}
            </CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                {(marketStats.lowerPrice && marketStats.lowerPrice.toFixed(currencyPair.config.pricePrecision)) || '-'}
            </CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{volume}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{marketStats.closedOrders || '-'}</CustomTD>
        </TR>
    );
};

const DesktopTable = (marketStats: MarketStats, baseToken: Token, currencyPair: CurrencyPair) => {
    return (
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
            <tbody>{statsToRow(marketStats, baseToken, currencyPair)}</tbody>
        </Table>
    );
};

const MobileTable = (marketStats: MarketStats, baseToken: Token, currencyPair: CurrencyPair) => {
    const lastPrice = marketStats.lastPrice
        ? new BigNumber(marketStats.lastPrice).toFixed(currencyPair.config.pricePrecision)
        : '-';

    return (
        <Table isResponsive={true}>
            <tbody>
                <TR>
                    <TH>Project</TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>{baseToken.name}</CustomTD>
                </TR>
                <TR>
                    <TH>Last Price</TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>{lastPrice || '-'}</CustomTD>
                </TR>
                <TR>
                    <TH>Max Price 24H</TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                        {(marketStats.highPrice && marketStats.highPrice.toFixed(currencyPair.config.pricePrecision)) ||
                            '-'}
                    </CustomTD>
                </TR>
                <TR>
                    <TH>Min Price 24H</TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                        {(marketStats.lowerPrice &&
                            marketStats.lowerPrice.toFixed(currencyPair.config.pricePrecision)) ||
                            '-'}
                    </CustomTD>
                </TR>
                <TR>
                    <TH>Volume 24H</TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                        {(marketStats.volume &&
                            `${tokenAmountInUnits(
                                marketStats.volume,
                                baseToken.decimals,
                                baseToken.displayDecimals,
                            ).toString()} ${baseToken.symbol.toUpperCase()}`) ||
                            '-'}{' '}
                    </CustomTD>
                </TR>
                <TR>
                    <TH>Orders Closed</TH>
                    <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                        {marketStats.closedOrders || '-'}
                    </CustomTD>
                </TR>
            </tbody>
        </Table>
    );
};

class MarketDetails extends React.Component<Props> {
    public render = () => {
        const { baseToken, quoteToken, web3State, currencyPair } = this.props;
        let content: React.ReactNode;
        switch (web3State) {
            case Web3State.Locked:
            case Web3State.NotInstalled: {
                content = <EmptyContent alignAbsoluteCenter={true} text="There are no market details to show" />;
                break;
            }
            case Web3State.Loading: {
                content = <LoadingWrapper minHeight="120px" />;
                break;
            }
            default: {
                if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
                    content = <LoadingWrapper minHeight="120px" />;
                } else if (!baseToken || !quoteToken) {
                    content = <EmptyContent alignAbsoluteCenter={true} text="There are no market details to show" />;
                } else {
                    const { highPrice, lowerPrice, volume, closedOrders, lastPrice, windowWidth } = this.props;

                    const marketStats = {
                        highPrice,
                        lowerPrice,
                        volume,
                        closedOrders,
                        lastPrice,
                    };
                    let tableMarketDetails;

                    isMobile(windowWidth)
                        ? (tableMarketDetails = MobileTable(marketStats, baseToken, currencyPair))
                        : (tableMarketDetails = DesktopTable(marketStats, baseToken, currencyPair));

                    content = (
                        <>
                            {tableMarketDetails}
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

const MarketDetailsContainer = withWindowWidth(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(MarketDetails),
);

export { MarketDetails, MarketDetailsContainer };
