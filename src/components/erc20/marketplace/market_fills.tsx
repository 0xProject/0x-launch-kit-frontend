import React from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import styled from 'styled-components';

import { USE_RELAYER_MARKET_UPDATES } from '../../../common/constants';
import { changeMarket, goToHome } from '../../../store/actions';
import { getBaseToken, getMarketFills, getQuoteToken, getWeb3State } from '../../../store/selectors';
import { getCurrencyPairByTokensSymbol } from '../../../util/known_currency_pairs';
import { isWeth } from '../../../util/known_tokens';
import { marketToStringFromTokens } from '../../../util/markets';
import { tokenAmountInUnits } from '../../../util/tokens';
import { CurrencyPair, Fill, MarketFill, OrderSide, StoreState, Token, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../../common/table';

const MarketTradesList = styled(Card)`
    height: 100%;
    overflow: auto;
`;

interface StateProps {
    baseToken: Token | null;
    quoteToken: Token | null;
    web3State?: Web3State;
    marketFills: MarketFill;
}

interface DispatchProps {
    changeMarket: (currencyPair: CurrencyPair) => any;
    goToHome: () => any;
}

type Props = StateProps & DispatchProps;

export const SideTD = styled(CustomTD)<{ side: OrderSide }>`
    color: ${props =>
        props.side === OrderSide.Buy ? props.theme.componentsTheme.green : props.theme.componentsTheme.red};
`;

const fillToRow = (fill: Fill, index: number) => {
    const sideLabel = fill.side === OrderSide.Sell ? 'Sell' : 'Buy';
    let amountBase;
    let amountQuote;
    if (USE_RELAYER_MARKET_UPDATES) {
        amountBase = fill.amountBase.toFixed(fill.tokenBase.displayDecimals);
        amountQuote = fill.amountQuote.toFixed(fill.tokenQuote.displayDecimals);
    } else {
        amountBase = tokenAmountInUnits(fill.amountBase, fill.tokenBase.decimals, fill.tokenBase.displayDecimals);
        amountQuote = tokenAmountInUnits(fill.amountQuote, fill.tokenQuote.decimals, fill.tokenQuote.displayDecimals);
    }

    const displayAmountBase = `${amountBase} ${fill.tokenBase.symbol.toUpperCase()}`;

    const tokenQuoteSymbol = isWeth(fill.tokenQuote.symbol) ? 'ETH' : fill.tokenQuote.symbol.toUpperCase();
    const displayAmountQuote = `${amountQuote} ${tokenQuoteSymbol}`;
    let currencyPair: CurrencyPair;
    try {
        currencyPair = getCurrencyPairByTokensSymbol(fill.tokenBase.symbol, fill.tokenQuote.symbol);
    } catch {
        return null;
    }
    const price = parseFloat(fill.price.toString()).toFixed(currencyPair.config.pricePrecision);

    return (
        <TR key={index}>
            <SideTD side={fill.side}>{sideLabel}</SideTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{price}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{displayAmountBase}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{displayAmountQuote}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                <TimeAgo date={fill.timestamp} />;
            </CustomTD>
        </TR>
    );
};

class MarketFills extends React.Component<Props> {
    public render = () => {
        const { marketFills, baseToken, quoteToken, web3State } = this.props;
        let content: React.ReactNode;
        const defaultBehaviour = () => {
            if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
                content = <LoadingWrapper minHeight="120px" />;
            } else if (!Object.keys(marketFills).length || !baseToken || !quoteToken) {
                content = <EmptyContent alignAbsoluteCenter={true} text="There are no trades to show" />;
            } else if (!marketFills[marketToStringFromTokens(baseToken, quoteToken)]) {
                content = <EmptyContent alignAbsoluteCenter={true} text="There are no trades to show" />;
            } else {
                const market = marketToStringFromTokens(baseToken, quoteToken);
                const tokenQuoteSymbol = isWeth(quoteToken.symbol) ? 'ETH' : quoteToken.symbol.toUpperCase();
                const tokenBaseSymbol = isWeth(baseToken.symbol) ? 'ETH' : baseToken.symbol.toUpperCase();
                content = (
                    <Table isResponsive={false}>
                        <THead>
                            <TR>
                                <TH>Side</TH>
                                <TH styles={{ textAlign: 'right' }}>Price ({tokenQuoteSymbol})</TH>
                                <TH styles={{ textAlign: 'right' }}>Amount ({tokenBaseSymbol})</TH>
                                <TH styles={{ textAlign: 'right' }}>Total ({tokenQuoteSymbol})</TH>
                                <TH styles={{ textAlign: 'right' }}>Age</TH>
                            </TR>
                        </THead>
                        <tbody>{marketFills[market].map((marketFill, index) => fillToRow(marketFill, index))}</tbody>
                    </Table>
                );
            }
        };

        if (USE_RELAYER_MARKET_UPDATES) {
            defaultBehaviour();
        } else {
            switch (web3State) {
                case Web3State.Locked:
                case Web3State.Connect:
                case Web3State.Connecting:
                case Web3State.NotInstalled: {
                    content = <EmptyContent alignAbsoluteCenter={true} text="Connect wallet to show market history" />;
                    break;
                }
                case Web3State.Loading: {
                    content = <LoadingWrapper minHeight="120px" />;
                    break;
                }
                default:
                    defaultBehaviour();
                    break;
            }
        }

        return (
            <MarketTradesList title="Market History" minHeightBody={'190px'}>
                {content}
            </MarketTradesList>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseToken(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
        marketFills: getMarketFills(state),
    };
};
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        changeMarket: (currencyPair: CurrencyPair) => dispatch(changeMarket(currencyPair)),
        goToHome: () => dispatch(goToHome()),
    };
};

const MarketFillsContainer = connect(mapStateToProps, mapDispatchToProps)(MarketFills);

export { MarketFills, MarketFillsContainer };
