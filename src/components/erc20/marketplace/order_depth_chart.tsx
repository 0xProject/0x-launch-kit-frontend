import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import { AreaSeries, FlexibleWidthXYPlot, LineSeries, XAxis, YAxis } from 'react-vis';
import 'react-vis/dist/style.css';
import styled, { withTheme } from 'styled-components';

import {
    getBaseToken,
    getOrderBook,
    getQuoteToken,
    getSpread,
    getSpreadInPercentage,
    getUserOrders,
    getWeb3State,
} from '../../../store/selectors';
import { Theme } from '../../../themes/commons';
import { hexToRgba } from '../../../util/color_utils';
import { OrderBook, OrderBookItem, StoreState, Token, UIOrder, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';

interface StateProps {
    orderBook: OrderBook;
    baseToken: Token | null;
    quoteToken: Token | null;
    userOrders: UIOrder[];
    web3State?: Web3State;
    absoluteSpread: BigNumber;
    percentageSpread: BigNumber;
}

interface OwnProps {
    theme: Theme;
}

interface Cords {
    x: number;
    y: number;
}

interface DepthChartData {
    midMarketPrice: BigNumber;
    bidLine: Cords[];
    askLine: Cords[];
}

interface OrderDepthChartMetadata {
    midMarketPrice: BigNumber;
    minPrice: BigNumber;
    maxPrice: BigNumber;
}

type Props = OwnProps & StateProps;

const DEFAULT_XY_PLOT_PROPS = {
    height: 200,
    margin: { left: 2, right: 2, top: 10, bottom: 40 },
};

enum LineType {
    Bid,
    Ask,
}

enum AreaAxesType {
    Price,
    VolumeRight,
    VolumeLeft,
}

const MidMarketPriceIndicatorWell = styled.div`
    padding: 0.5rem;
    position: absolute;
    width: 10rem;
    margin: auto;
    right: 0;
    left: 0;
    top: 1rem;
    background-color: ${props => props.theme.componentsTheme.simplifiedTextBoxColor};
    border-color: ${props => props.theme.componentsTheme.cardBorderColor};
    border-style: solid;
    border-radius: 3px;
    border-width: 1px;
    text-align: center;
`;

interface MidMarketPriceCardProps {
    price: number;
}

const MidMarketPriceText = styled.p`
    font-size: 14px;
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme.componentsTheme.textColorCommon};
`;

const MidMarketPriceLabel = styled.p`
    font-size: 12px;
    margin: 0;
    color: ${props => props.theme.componentsTheme.textDark};
`;

const MidMarketPriceCard = (props: MidMarketPriceCardProps) => {
    return (
        <MidMarketPriceIndicatorWell>
            <MidMarketPriceText>{props.price}</MidMarketPriceText>
            <MidMarketPriceLabel>Mid market price</MidMarketPriceLabel>
        </MidMarketPriceIndicatorWell>
    );
};

class OrderDepthChart extends React.Component<Props> {
    public state = {
        bound: new BigNumber(0.00008),
        midMarketPrice: new BigNumber(0),
    };

    constructor(props: Props) {
        super(props);
    }

    public render = () => {
        const { orderBook, baseToken, quoteToken, web3State } = this.props;
        const { sellOrders, buyOrders } = orderBook;

        let content: React.ReactNode;

        if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
            content = <LoadingWrapper />;
        } else if ((!buyOrders.length && !sellOrders.length) || !baseToken || !quoteToken) {
            content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
        } else {
            const { askLine, bidLine, midMarketPrice } = this._convertOrderBookToDepthChartData(
                orderBook,
                baseToken,
                quoteToken,
            );

            content = (
                <>
                    <MidMarketPriceCard price={midMarketPrice.toNumber()} />
                    <FlexibleWidthXYPlot {...DEFAULT_XY_PLOT_PROPS}>
                        <AreaSeries data={askLine} {...this._generateAreaSeriesStyle(LineType.Ask)} />
                        <AreaSeries data={bidLine} {...this._generateAreaSeriesStyle(LineType.Bid)} />
                        <LineSeries data={askLine} {...this._generateLineSeriesStyle(LineType.Ask)} />
                        <LineSeries data={bidLine} {...this._generateLineSeriesStyle(LineType.Bid)} />
                        <XAxis {...this._generateAreaAxesStyle(AreaAxesType.Price)} />
                        <YAxis {...this._generateAreaAxesStyle(AreaAxesType.VolumeRight)} />
                        <YAxis {...this._generateAreaAxesStyle(AreaAxesType.VolumeLeft)} />
                    </FlexibleWidthXYPlot>
                </>
            );
        }
        return <Card title="Depth Chart">{content}</Card>;
    };

    private readonly _generateAreaAxesStyle = (type: AreaAxesType): object => {
        const { theme } = this.props;

        const style = {
            tick: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.2 },
            text: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.7 },
            line: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.2 },
        };

        if (type === AreaAxesType.VolumeRight) {
            return {
                style,
                tickSizeOuter: 0,
                tickSizeInner: 6,
                tickPadding: -16,
                orientation: 'right',
            };
        } else if (type === AreaAxesType.VolumeLeft) {
            return {
                style,
                tickSizeOuter: 0,
                tickSizeInner: 6,
                tickPadding: -16,
                orientation: 'left',
            };
        } else {
            return {
                style,
                tickSizeOuter: 6,
                tickSizeInner: 0,
            };
        }
    };

    private readonly _generateAreaSeriesStyle = (type: LineType): object => {
        const { theme } = this.props;
        if (type === LineType.Ask) {
            return {
                color: hexToRgba(theme.componentsTheme.red, 0),
                fill: hexToRgba(theme.componentsTheme.red, 0.2),
            };
        } else {
            return {
                color: hexToRgba(theme.componentsTheme.green, 0),
                fill: hexToRgba(theme.componentsTheme.green, 0.2),
            };
        }
    };

    private readonly _generateLineSeriesStyle = (type: LineType): object => {
        const { theme } = this.props;
        if (type === LineType.Ask) {
            return {
                color: hexToRgba(theme.componentsTheme.red, 1),
            };
        } else {
            return {
                color: hexToRgba(theme.componentsTheme.green, 1),
            };
        }
    };

    private readonly _generateDepthChartMetadata = (
        orderBook: OrderBook,
        bound: BigNumber,
    ): OrderDepthChartMetadata => {
        const highestBidPrice = orderBook.buyOrders[0].price;
        const lowestAskPrice = orderBook.sellOrders[orderBook.sellOrders.length - 1].price;

        const midMarketPriceDiff = lowestAskPrice.minus(highestBidPrice).dividedBy(2);

        const midMarketPrice = highestBidPrice.plus(midMarketPriceDiff);

        return {
            midMarketPrice,
            minPrice: midMarketPrice.minus(bound),
            maxPrice: midMarketPrice.plus(bound),
        };
    };

    private readonly _convertOrderBookToDepthChartData = (
        orderBook: OrderBook,
        baseToken: Token | null,
        quoteToken: Token | null,
    ): DepthChartData => {
        const { decimals } = quoteToken || { decimals: 18 };
        const { bound } = this.state;
        const { midMarketPrice, minPrice, maxPrice } = this._generateDepthChartMetadata(orderBook, bound);

        const filteredBuyOrder = orderBook.buyOrders.filter((value: OrderBookItem) =>
            value.price.isGreaterThanOrEqualTo(minPrice),
        );
        const filteredAskOrder = orderBook.sellOrders
            .reverse()
            .filter((value: OrderBookItem) => value.price.isLessThanOrEqualTo(maxPrice));

        const bidLine = filteredBuyOrder
            .reduce(
                (
                    a: { aggVolume: number; line: Cords[] },
                    c: OrderBookItem,
                    i: number,
                ): { aggVolume: number; line: Cords[] } => {
                    const newAcc = { ...a };
                    const { price: priceInBigNumber, size: sizeInBigNUmber } = c;
                    const price = priceInBigNumber.toNumber();
                    const newAggVolumeDelta = priceInBigNumber.multipliedBy(sizeInBigNUmber).toNumber();
                    const newAggVolume = a.aggVolume + newAggVolumeDelta / Math.pow(10, decimals);
                    newAcc.line = newAcc.line.concat([{ x: price, y: a.aggVolume }, { x: price, y: newAggVolume }]);
                    newAcc.aggVolume = newAggVolume;
                    return newAcc;
                },
                {
                    aggVolume: 0,
                    line: [] as Cords[],
                },
            )
            .line.reverse();

        const askLine = filteredAskOrder.reduce(
            (
                a: { aggVolume: number; line: Cords[] },
                c: OrderBookItem,
                i: number,
            ): { aggVolume: number; line: Cords[] } => {
                const newAcc = { ...a };
                const { price: priceInBigNumber, size: sizeInBigNUmber } = c;
                const price = priceInBigNumber.toNumber();
                const newAggVolumeDelta = priceInBigNumber.multipliedBy(sizeInBigNUmber).toNumber();
                const newAggVolume = a.aggVolume + newAggVolumeDelta / Math.pow(10, decimals);
                newAcc.line = newAcc.line.concat([{ x: price, y: a.aggVolume }, { x: price, y: newAggVolume }]);
                newAcc.aggVolume = newAggVolume;
                return newAcc;
            },
            {
                aggVolume: 0,
                line: [] as Cords[],
            },
        ).line;

        const scaledBidLine = [{ x: minPrice.toNumber(), y: bidLine[0].y }].concat(bidLine);
        const scaledAskLine = askLine.concat([{ x: maxPrice.toNumber(), y: askLine[askLine.length - 1].y }]);

        return {
            bidLine: scaledBidLine,
            askLine: scaledAskLine,
            midMarketPrice,
        };
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        orderBook: getOrderBook(state),
        baseToken: getBaseToken(state),
        userOrders: getUserOrders(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
        absoluteSpread: getSpread(state),
        percentageSpread: getSpreadInPercentage(state),
    };
};

const OrderDepthChartContainer = withTheme(connect(mapStateToProps)(OrderDepthChart));
const OrderDepthChartWithTheme = withTheme(OrderDepthChart);

export { OrderDepthChart, OrderDepthChartWithTheme, OrderDepthChartContainer };
