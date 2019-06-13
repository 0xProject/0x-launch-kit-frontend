import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import { AreaSeries, Crosshair, FlexibleWidthXYPlot, LineSeries, XAxis, YAxis } from 'react-vis';
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
import { lerp } from '../../../util/lerp';
import { OrderBook, OrderBookItem, StoreState, Token, UIOrder, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { getDepthChartStyle } from '../common/chart/depth_chart_style';
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

interface DepthChartData {
    midMarketPrice: BigNumber;
    minPrice: BigNumber;
    maxPrice: BigNumber;
    bidLine: Cord[];
    askLine: Cord[];
}

interface HoverCordWithMetadata extends Cord {
    price: number;
    volume: number;
    cost: number;
    orderSide: OrderSide;
}

const DEFAULT_XY_PLOT_PROPS = {
    height: 200,
    width: 0,
    margin: { left: 2, right: 2, top: 10, bottom: 40 },
};

const GraphContentWrapper = styled.div`
    position: relative;
`;

const MidMarketPriceIndicatorWell = styled.div`
    padding: 0.5rem;
    position: absolute;
    width: 10rem;
    margin: auto;
    right: 0;
    left: 0;
    top: 0;
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
        hoverCord: null as Cord | null,
    };

    private readonly _graphContentWrapper: React.RefObject<HTMLDivElement>;
    private readonly _crossHairs: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this._graphContentWrapper = React.createRef();
        this._crossHairs = React.createRef();
    }

    public render = () => {
        const { orderBook, baseToken, quoteToken, web3State, theme } = this.props;
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
            //const hoverMetadata = this._generateHoverMetadata(askLine, bidLine);
            content = (
                <GraphContentWrapper key={'order-depth-chart'} ref={this._graphContentWrapper} onMouseMove={this._onMouseMoveInGraphContent}>
                    <MidMarketPriceCard price={midMarketPrice.toNumber()} />
                    <FlexibleWidthXYPlot {...DEFAULT_XY_PLOT_PROPS}>
                        <AreaSeries data={askLine} {...askChartStyle.areaSeries} />
                        <AreaSeries data={bidLine} {...bidChartStyle.areaSeries} />
                        <LineSeries data={askLine} {...askChartStyle.lineSeries}/>
                        <LineSeries data={bidLine} {...bidChartStyle.lineSeries} />
                        <XAxis {...askChartStyle.axesBottom} />
                        <YAxis {...askChartStyle.axesLeft} />
                        <YAxis {...askChartStyle.axesRight} />
                    </FlexibleWidthXYPlot>
                </GraphContentWrapper>
            );
        }
        return <Card title="Depth Chart">{content}</Card>;
    };

    private readonly _onMouseMoveInGraphContent = (e: any) => {
        const rect = (this._graphContentWrapper.current as any as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left - DEFAULT_XY_PLOT_PROPS.margin.left;
        const y = e.clientY - rect.top - DEFAULT_XY_PLOT_PROPS.margin.top;
        const dimensions = this.props.dimension || {...DEFAULT_XY_PLOT_PROPS, ...{ width: rect.width }};
        this.setState({ hoverCord: { x, y }});
    }

    // private readonly _generateHoverMetadata = (askLine: Cord[], bidLine: Cord[]): HoverMetadata => {
    //     if (!!this._graphContentWrapper.current) {
    //         const rect = (this._graphContentWrapper.current as any as HTMLDivElement).getBoundingClientRect();
    //         let volume = 0;
    //         let price = 0;
    //         let lineType = LineType.Ask;
    //         const highestBidPrice = bidLine[bidLine.length - 1].x;
    //         const lowestAskPrice = askLine[0].x;
    //         const minPrice = bidLine[0].x;
    //         const maxPrice = askLine[askLine.length - 1].x;
    //         const largestVolume = Math.max(bidLine[0].y, askLine[askLine.length - 1].y);

    //         const hoveredValueX = lerp(minPrice, maxPrice, this.state.hoveredValueX / rect.width);

    //         if (hoveredValueX <= highestBidPrice) {
    //             const bidLineDifferences = bidLine.map(c => Math.abs(c.x - hoveredValueX));
    //             const closestCordIndex = bidLineDifferences.indexOf(Math.min.apply(null, bidLineDifferences));
    //             const c = (bidLine[closestCordIndex] as any as Cords);
    //             volume = c.y;
    //             price = c.x;
    //             lineType = LineType.Bid;
    //         }

    //         if (hoveredValueX >= lowestAskPrice) {
    //             const askLineDifferences = askLine.map(c => Math.abs(c.x - hoveredValueX));
    //             const closestCordIndex = askLineDifferences.indexOf(Math.min.apply(null, askLineDifferences));
    //             const c = (askLine[closestCordIndex] as any as Cords);
    //             volume = c.y;
    //             price = c.x;
    //             lineType = LineType.Ask;
    //         }

    //         const contentHeight = DEFAULT_XY_PLOT_PROPS.height - DEFAULT_XY_PLOT_PROPS.margin.top - DEFAULT_XY_PLOT_PROPS.margin.bottom;

    //         const y = lerp(0, contentHeight, volume / largestVolume);
    //         const x = lerp(0, rect.width, (price - minPrice) / (maxPrice - minPrice));

    //         return {
    //             x,
    //             y,
    //             price: x,
    //             volume,
    //             cost: x * y,
    //             lineType,
    //         };
    //     }
    //     return DEFAULT_HOVERED_VALUE;
    // }

    private readonly _generateDepthChartBounds = (
        orderBook: OrderBook,
        bound: BigNumber,
    ): Partial<DepthChartData> => {
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
        const partialDepthChartData = this._generateDepthChartBounds(orderBook, bound);
        const minPrice = partialDepthChartData.minPrice as any as BigNumber;
        const maxPrice = partialDepthChartData.maxPrice as any as BigNumber;
        const midMarketPrice = partialDepthChartData.midMarketPrice as any as BigNumber;

        const filteredBuyOrder = orderBook.buyOrders.slice(0).filter((value: OrderBookItem) =>
            value.price.isGreaterThanOrEqualTo(minPrice),
        );
        const filteredAskOrder = orderBook.sellOrders.slice(0).reverse().filter((value: OrderBookItem) =>
            value.price.isLessThanOrEqualTo(maxPrice),
        );

        const bidLine = this._generateDepthChartLine(filteredBuyOrder, decimals).reverse();

        const askLine = this._generateDepthChartLine(filteredAskOrder, decimals);

        const scaledBidLine: Cord[] = [{ x: minPrice.toNumber(), y: bidLine[0].y }].concat(bidLine);
        const scaledAskLine: Cord[]  = askLine.concat([{ x: maxPrice.toNumber(), y: askLine[askLine.length - 1].y }]);

        return {
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
