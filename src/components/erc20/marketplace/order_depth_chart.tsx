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
import { lerp } from '../../../util/lerp';
import { clamp } from '../../../util/clamp';
import { OrderBook, OrderBookItem, StoreState, Token, UIOrder, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { ZoomInIcon } from '../../common/icons/zoom_in';
import { ZoomOutIcon } from '../../common/icons/zoom_out';
import { LoadingWrapper } from '../../common/loading';
import { Crosshair, CrosshairProps } from '../common/chart/crosshair';
import { getDepthChartStyle } from '../common/chart/depth_chart_style';
import { MidMarketPriceCard } from '../common/chart/mid_market_price_card';
import { ChartDimensions, Cord, OrderSide } from '../common/chart/types';

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
    dimension?: ChartDimensions;
}

type Props = OwnProps & StateProps;

const ORDER_DEPTH_CHART_KEY = 'order-depth-chart';
const DEFAULT_DEPTH_CHART_BOUNDS_PERCENTAGE = 0.6;
const DEFAULT_DEPTH_CHART_BOUNDS_PERCENTAGE_DELTA = 0.1;
const DEFAULT_TICK_WIDTH_IN_PX = 150;
const DEFAULT_TICK_TOTAL = 8;
const DEFAULT_DIMENSION: ChartDimensions = {
    height: 200,
    margin: { left: 2, right: 2, top: 10, bottom: 20 },
};

interface DepthChartData {
    midMarketPrice: BigNumber;
    minPrice: BigNumber;
    maxPrice: BigNumber;
    bound: BigNumber;
    bidLine: Cord[];
    askLine: Cord[];
}

const GraphContentWrapper = styled.div`
    position: relative;
`;

const ActionWrapper = styled.div`
    display: flex;
    color: ${props => props.theme.componentsTheme.textLight};
`;

const ActionIconWrapper = styled.div``;

class OrderDepthChart extends React.Component<Props> {
    public state = {
        boundPercentage: DEFAULT_DEPTH_CHART_BOUNDS_PERCENTAGE,
        hoverCord: null as Cord | null,
    };

    private readonly _graphContentWrapper: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this._graphContentWrapper = React.createRef();
    }

    public render = () => {
        const { orderBook, baseToken, quoteToken, web3State, theme, dimension = DEFAULT_DIMENSION } = this.props;
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
            const bidChartStyle = getDepthChartStyle(theme, OrderSide.Bid);
            const askChartStyle = getDepthChartStyle(theme, OrderSide.Ask);
            const crosshairProps = this._generateCrossHairProps(askLine, bidLine);
            content = (
                <GraphContentWrapper
                    key={ORDER_DEPTH_CHART_KEY}
                    ref={this._graphContentWrapper}
                    onMouseMove={this._onMouseMoveInGraphContent}
                >
                    {!!crosshairProps && <Crosshair {...crosshairProps} />}
                    <MidMarketPriceCard price={midMarketPrice.toNumber()} />
                    <FlexibleWidthXYPlot {...dimension}>
                        <AreaSeries data={askLine} {...askChartStyle.areaSeries} />
                        <AreaSeries data={bidLine} {...bidChartStyle.areaSeries} />
                        <LineSeries data={askLine} {...askChartStyle.lineSeries} />
                        <LineSeries data={bidLine} {...bidChartStyle.lineSeries} />
                        <XAxis
                            {...askChartStyle.axesBottom}
                            tickTotal={this._getXAxisTickTotal()}
                            tickFormat={this._getXAxisTickFormatter}
                        />
                        <YAxis {...askChartStyle.axesLeft} tickFormat={this._getYAxisTickFormatter} />
                        <YAxis {...askChartStyle.axesRight} tickFormat={this._getYAxisTickFormatter} />
                    </FlexibleWidthXYPlot>
                </GraphContentWrapper>
            );
            return (
                <Card title="Depth Chart" action={this._renderAction()}>
                    {content}
                </Card>
            );
        }
        return <Card title="Depth Chart">{content}</Card>;
    };

    private readonly _renderAction = () => {
        return (
            <ActionWrapper>
                <ActionIconWrapper
                    onClick={this._changeBoundPercentageBy.bind(this, DEFAULT_DEPTH_CHART_BOUNDS_PERCENTAGE_DELTA * -1)}
                >
                    <ZoomOutIcon />
                </ActionIconWrapper>
                <ActionIconWrapper
                    onClick={this._changeBoundPercentageBy.bind(this, DEFAULT_DEPTH_CHART_BOUNDS_PERCENTAGE_DELTA)}
                >
                    <ZoomInIcon />
                </ActionIconWrapper>
            </ActionWrapper>
        );
    };

    private readonly _changeBoundPercentageBy = (delta: number) => {
        const { boundPercentage } = this.state;
        this.setState({ boundPercentage: clamp(0.1, 1, boundPercentage + delta) });
    };

    private readonly _getXAxisTickTotal = () => {
        if (!!this._graphContentWrapper.current) {
            const rect = ((this._graphContentWrapper.current as any) as HTMLDivElement).getBoundingClientRect();
            return Math.floor(rect.width / DEFAULT_TICK_WIDTH_IN_PX);
        }
        return DEFAULT_TICK_TOTAL;
    };

    private readonly _getYAxisTickFormatter = (value: number): string => {
        if (value === 0) {
            return '';
        }
        if (value > 999) {
            return `${(value / 1000).toPrecision(2)}k`;
        }
        return value.toPrecision(3);
    };

    private readonly _getXAxisTickFormatter = (value: number): string => {
        return value.toPrecision(3);
    };

    private readonly _onMouseMoveInGraphContent = (e: any) => {
        const dimension = this.props.dimension || DEFAULT_DIMENSION;
        const rect = ((this._graphContentWrapper.current as any) as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left - dimension.margin.left;
        const y = dimension.height - (e.clientY - rect.top) - dimension.margin.bottom;
        this.setState({ hoverCord: { x, y } });
    };

    private readonly _getClosestCordPairByX = (cords: Cord[], x: number): Cord => {
        const cordsDifferences = cords.map(c => Math.abs(c.x - x));
        const closestCordIndex = cordsDifferences.indexOf(Math.min.apply(null, cordsDifferences));
        return (cords[closestCordIndex] as any) as Cord;
    };

    private readonly _generateCrossHairProps = (askLine: Cord[], bidLine: Cord[]): CrosshairProps | undefined => {
        if (!!this._graphContentWrapper.current && this.state.hoverCord) {
            const { width } = ((this._graphContentWrapper.current as any) as HTMLDivElement).getBoundingClientRect();
            const dimension = this.props.dimension || DEFAULT_DIMENSION;
            const minPrice = bidLine[0].x;
            const maxPrice = askLine[askLine.length - 1].x;
            const hoveredPrice = lerp(minPrice, maxPrice, this.state.hoverCord.x / width);
            const highestBidPrice = bidLine[bidLine.length - 1].x;
            const lowestAskPrice = askLine[0].x;
            const largestVolume = Math.max(bidLine[0].y, askLine[askLine.length - 1].y);

            const quoteSymbol = (!!this.props.quoteToken && this.props.quoteToken.symbol) || '';
            const baseSymbol = (!!this.props.baseToken && this.props.baseToken.symbol) || '';

            // If price is inbetween the two graphs, do not return any hover metadata
            if (hoveredPrice > highestBidPrice && hoveredPrice < lowestAskPrice) {
                return;
            }

            const orderSide = hoveredPrice <= highestBidPrice ? OrderSide.Bid : OrderSide.Ask;
            const accentColor =
                orderSide === OrderSide.Bid
                    ? this.props.theme.componentsTheme.green
                    : this.props.theme.componentsTheme.red;

            const { x: price, y: volume } = this._getClosestCordPairByX(
                orderSide === OrderSide.Bid ? bidLine : askLine.slice(0).reverse(),
                hoveredPrice,
            );

            const contentHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;
            const contentWidth = width - dimension.margin.left - dimension.margin.right;

            const y = lerp(0, contentHeight, volume / largestVolume);
            const x = lerp(0, contentWidth, (price - minPrice) / (maxPrice - minPrice));
            return {
                cord: {
                    x,
                    y,
                },
                price,
                volume,
                cost: price * volume,
                quoteSymbol,
                baseSymbol,
                accentColor,
                parentChartDimensions: { ...dimension, ...{ width } },
            };
        }
    };

    private readonly _generateDepthChartBounds = (orderBook: OrderBook): Partial<DepthChartData> => {
        const highestBidPrice = orderBook.buyOrders[0].price;
        const lowestAskPrice = orderBook.sellOrders[orderBook.sellOrders.length - 1].price;

        const midMarketPriceDiff = lowestAskPrice.minus(highestBidPrice).dividedBy(2);

        const midMarketPrice = highestBidPrice.plus(midMarketPriceDiff);

        const bound = midMarketPrice.multipliedBy(this.state.boundPercentage);

        return {
            bound,
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
        const partialDepthChartData = this._generateDepthChartBounds(orderBook);
        const minPrice = (partialDepthChartData.minPrice as any) as BigNumber;
        const maxPrice = (partialDepthChartData.maxPrice as any) as BigNumber;
        const midMarketPrice = (partialDepthChartData.midMarketPrice as any) as BigNumber;

        const filteredBuyOrder = orderBook.buyOrders
            .slice(0)
            .filter((value: OrderBookItem) => value.price.isGreaterThanOrEqualTo(minPrice));
        const filteredAskOrder = orderBook.sellOrders
            .slice(0)
            .reverse()
            .filter((value: OrderBookItem) => value.price.isLessThanOrEqualTo(maxPrice));

        const bidLine = this._generateDepthChartLine(filteredBuyOrder, decimals).reverse();

        const askLine = this._generateDepthChartLine(filteredAskOrder, decimals);

        let scaledAskLine: Cord[];
        let scaledBidLine: Cord[];

        if (!bidLine.length || !askLine.length) {
            scaledAskLine = [];
            scaledBidLine = [];
        } else {
            scaledBidLine = [{ x: minPrice.toNumber(), y: bidLine[0].y }].concat(bidLine);
            scaledAskLine = askLine.concat([{ x: maxPrice.toNumber(), y: askLine[askLine.length - 1].y }]);
        }

        return {
            bound: (partialDepthChartData.bound as any) as BigNumber,
            bidLine: scaledBidLine,
            askLine: scaledAskLine,
            midMarketPrice,
            minPrice,
            maxPrice,
        };
    };

    private readonly _generateDepthChartLine = (line: OrderBookItem[], decimals: number): Cord[] => {
        return line.reduce(
            (
                a: { aggVolume: number; line: Cord[] },
                c: OrderBookItem,
                i: number,
            ): { aggVolume: number; line: Cord[] } => {
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
                line: [] as Cord[],
            },
        ).line;
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
