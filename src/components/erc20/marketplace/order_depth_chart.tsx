import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import { LineSeries, AreaSeries, FlexibleWidthXYPlot, XAxis, YAxis } from 'react-vis';
import 'react-vis/dist/style.css';
import styled, { withTheme } from 'styled-components';


import {
    UI_DECIMALS_DISPLAYED_ORDER_SIZE,
    UI_DECIMALS_DISPLAYED_PRICE_ETH,
    UI_DECIMALS_DISPLAYED_SPREAD_PERCENT,
} from '../../../common/constants';
import {
    getBaseToken,
    getOrderBook,
    getQuoteToken,
    getSpread,
    getSpreadInPercentage,
    getUserOrders,
    getWeb3State,
} from '../../../store/selectors';
import { Theme, themeBreakPoints } from '../../../themes/commons';
import { tokenAmountInUnits } from '../../../util/tokens';
import { OrderBook, OrderBookItem, OrderSide, StoreState, Token, UIOrder, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { ShowNumberWithColors } from '../../common/show_number_with_colors';
import { hexToRgba } from '../../../util/color_utils';

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
    margin: { left: 2, right: 2, top: 10, bottom: 40},
};

enum LineType {
    Bid, Ask,
}

enum AreaAxesType {
    Price, VolumeRight, VolumeLeft,
}

const MidMarketPriceIndicatorWell = styled.div`
    padding: 0.5rem;
    position: absolute;
    width: 12rem;
    margin: auto;
    right: 0;
    left: 0;
    top: 1rem;
    background-color: ${props => props.theme.componentsTheme.simplifiedTextBoxColor};
    border-color: ${props => props.theme.componentsTheme.cardBorderColor};
    border-style: solid;
    border-radius: 3px;
    border-width: 1px;
    color: white;
    text-align: center;
`;

class OrderDepthChart extends React.Component<Props> {

    public state = {
        bound: new BigNumber(0.00008),
    };

    constructor(props: Props) {
        super(props);
    }

    public render = () => {
        const { orderBook, baseToken, quoteToken, web3State, theme, absoluteSpread, percentageSpread } = this.props;
        const { sellOrders, buyOrders, mySizeOrders } = orderBook;

        let content: React.ReactNode;

        if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
            content = <LoadingWrapper />;
        } else if ((!buyOrders.length && !sellOrders.length) || !baseToken || !quoteToken) {
            content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
        } else {
            const { askLine, bidLine } = this._convertOrderBookToDepthChartData(orderBook, baseToken, quoteToken);

            content = <>
                <MidMarketPriceIndicatorWell>
                    test
                </MidMarketPriceIndicatorWell>
                <FlexibleWidthXYPlot {...DEFAULT_XY_PLOT_PROPS}>
                    <AreaSeries data={askLine} {...this._generateAreaSeriesStyle(LineType.Ask)}/>
                    <AreaSeries data={bidLine} {...this._generateAreaSeriesStyle(LineType.Bid)}/>
                    <LineSeries data={askLine} {...this._generateLineSeriesStyle(LineType.Ask)}/>
                    <LineSeries data={bidLine} {...this._generateLineSeriesStyle(LineType.Bid)}/>
                    <XAxis {...this._generateAreaAxesStyle(AreaAxesType.Price)}/>
                    <YAxis {...this._generateAreaAxesStyle(AreaAxesType.VolumeRight)}/>
                    <YAxis {...this._generateAreaAxesStyle(AreaAxesType.VolumeLeft)}/>
                </FlexibleWidthXYPlot>
            </>;
        }
        return <Card title="Depth Chart">{content}</Card>;
    };

    private readonly _generateAreaAxesStyle = (type: AreaAxesType): object => {
        const { theme } = this.props;
        if (type === AreaAxesType.VolumeRight) {
            return {
                style: {
                    tick: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.2 },
                    text: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.7 },
                    line: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.2 },
                },
                tickSizeOuter: 0,
                tickSizeInner: 6,
                tickPadding: -16,
                orientation: 'right',
            };
        } else if (type === AreaAxesType.VolumeLeft) {
            return {
                style: {
                    tick: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.2 },
                    text: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.7 },
                    line: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.2 },
                },
                tickSizeOuter: 0,
                tickSizeInner: 6,
                tickPadding: -16,
                orientation: 'left',
            };
        } else {
            return {
                style: {
                    tick: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.2 },
                    text: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.7 },
                    line: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.2 },
                },
                tickSizeOuter: 6,
                tickSizeInner: 0,
            };
        }
    }

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
    }

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
    }

    private readonly _generateDepthChartMetadata = (orderBook: OrderBook, bound: BigNumber ): OrderDepthChartMetadata => {
        const highestBidPrice = orderBook.buyOrders[0].price;
        const lowestAskPrice = orderBook.sellOrders[orderBook.sellOrders.length - 1].price;


        const midMarketPriceDiff = (lowestAskPrice).minus(highestBidPrice).dividedBy(2);

        const midMarketPrice = highestBidPrice.plus(midMarketPriceDiff);

        return {
            midMarketPrice,
            minPrice: midMarketPrice.minus(bound),
            maxPrice: midMarketPrice.plus(bound),
        };
    }

    private readonly _convertOrderBookToDepthChartData = (orderBook: OrderBook, baseToken: Token | null, quoteToken: Token | null): DepthChartData => {
        const { decimals } = quoteToken || { decimals: 18 };
        const { bound } = this.state;
        const {midMarketPrice, minPrice, maxPrice} = this._generateDepthChartMetadata(orderBook, bound);

        const filteredBuyOrder = orderBook.buyOrders.filter((value: OrderBookItem) => value.price.isGreaterThanOrEqualTo(minPrice));
        const filteredAskOrder = orderBook.sellOrders.reverse().filter((value: OrderBookItem) => value.price.isLessThanOrEqualTo(maxPrice));

        const bidLine = filteredBuyOrder.reduce((a: { aggVolume: number; line: Cords[] }, c: OrderBookItem, i: number): { aggVolume: number; line: Cords[] } => {
            const newAcc = {...a};
            const { price: priceInBigNumber, size: sizeInBigNUmber } = c;
            const price = priceInBigNumber.toNumber();
            const newAggVolumeDelta = priceInBigNumber.multipliedBy(sizeInBigNUmber).toNumber();
            const newAggVolume = a.aggVolume + (newAggVolumeDelta / Math.pow(10, decimals));
            newAcc.line = newAcc.line.concat([{ x: price, y: a.aggVolume }, { x: price, y: newAggVolume }]);
            newAcc.aggVolume = newAggVolume;
            return newAcc;
        }, {
            aggVolume: 0,
            line: [] as Cords[],
        }).line.reverse();

        const askLine = filteredAskOrder.reduce((a: { aggVolume: number; line: Cords[] }, c: OrderBookItem, i: number): { aggVolume: number; line: Cords[] } => {
            const newAcc = {...a};
            const { price: priceInBigNumber, size: sizeInBigNUmber } = c;
            const price = priceInBigNumber.toNumber();
            const newAggVolumeDelta = priceInBigNumber.multipliedBy(sizeInBigNUmber).toNumber();
            const newAggVolume = a.aggVolume + (newAggVolumeDelta / Math.pow(10, decimals));
            newAcc.line = newAcc.line.concat([{ x: price, y: a.aggVolume }, { x: price, y: newAggVolume }]);
            newAcc.aggVolume = newAggVolume;
            return newAcc;
        }, {
            aggVolume: 0,
            line: [] as Cords[],
        }).line;

        const scaledBidLine = [{x: minPrice.toNumber(), y: bidLine[0].y}].concat(bidLine);
        const scaledAskLine = askLine.concat([{x: maxPrice.toNumber(), y: askLine[askLine.length - 1].y}]);
        //console.log( minPrice.toNumber(), midMarketPrice.toNumber(), maxPrice.toNumber());
        //console.log( bidLine[0].x, askLine[askLine.length - 1].x);
        return {
            bidLine: scaledBidLine,
            askLine: scaledAskLine,
        };
    }
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
