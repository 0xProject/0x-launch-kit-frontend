import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
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
import { setOrderPriceSelected } from '../../../store/ui/actions';
import { Theme, themeBreakPoints } from '../../../themes/commons';
import { tokenAmountInUnits } from '../../../util/tokens';
import { OrderBook, OrderBookItem, OrderSide, StoreState, Token, UIOrder, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { ShowNumberWithColors } from '../../common/show_number_with_colors';
import { CustomTD, CustomTDLast, CustomTDTitle, TH, THLast } from '../../common/table';

import {
    customTDLastStyles,
    customTDStyles,
    customTDTitleStyles,
    GridRowSpread,
    GridRowSpreadContainer,
    StickySpreadState,
} from './grid_row_spread';

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

type Props = OwnProps & StateProps;

const OrderbookCard = styled(Card)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-height: 100%;

    > div:first-child {
        flex-grow: 0;
        flex-shrink: 0;
    }

    > div:nth-child(2) {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: hidden;
        padding-bottom: 0;
        padding-left: 0;
        padding-right: 0;
    }
`;

const GridRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`;

const GridRowInner = styled(GridRow)`
    background-color: 'transparent';
    cursor: pointer;
    &:hover {
        background-color: ${props => props.theme.componentsTheme.rowOrderActive};
    }
`;

const GridRowTop = styled(GridRow)`
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
`;

const CenteredLoading = styled(LoadingWrapper)`
    height: 100%;
`;

const ItemsScroll = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-height: 500px;
    overflow: auto;

    @media (min-width: ${themeBreakPoints.xl}) {
        max-height: none;
    }
`;

const ItemsMainContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    min-height: fit-content;
    position: relative;
    z-index: 1;
`;

const ItemsInnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 1;
`;

const TopItems = styled(ItemsInnerContainer)`
    justify-content: flex-end;
`;

const BottomItems = styled(ItemsInnerContainer)`
    justify-content: flex-start;
`;

interface OrderToRowPropsOwn {
    order: OrderBookItem;
    index: number;
    count: number;
    baseToken: Token;
    priceColor: string;
    mySizeOrders: OrderBookItem[];
    web3State?: Web3State;
}

interface OrderToRowDispatchProps {
    onSetOrderPriceSelected: (orderPriceSelected: BigNumber) => Promise<any>;
}

type OrderToRowProps = OrderToRowPropsOwn & OrderToRowDispatchProps;

interface State {
    isHover: boolean;
}

class OrderToRow extends React.Component<OrderToRowProps> {
    public state: State = {
        isHover: false,
    };

    public hoverOn = () => {
        this.setState({ isHover: true });
    };

    public hoverOff = () => {
        this.setState({ isHover: false });
    };

    public render = () => {
        const { order, index, baseToken, priceColor, mySizeOrders = [], web3State } = this.props;
        const size = tokenAmountInUnits(order.size, baseToken.decimals, UI_DECIMALS_DISPLAYED_ORDER_SIZE);
        const price = order.price.toString();

        const mySize = mySizeOrders.reduce((sumSize, mySizeItem) => {
            if (mySizeItem.price.eq(order.price)) {
                return sumSize.plus(mySizeItem.size);
            }
            return sumSize;
        }, new BigNumber(0));

        const mySizeConverted = tokenAmountInUnits(mySize, baseToken.decimals, UI_DECIMALS_DISPLAYED_ORDER_SIZE);
        const isMySizeEmpty = mySize.eq(new BigNumber(0));
        const displayColor = isMySizeEmpty ? '#dedede' : undefined;
        const mySizeRow =
            web3State !== Web3State.Locked && web3State !== Web3State.NotInstalled ? (
                <CustomTDLast as="div" styles={{ tabular: true, textAlign: 'right', color: displayColor }} id="mySize">
                    {isMySizeEmpty ? '-' : mySizeConverted}
                </CustomTDLast>
            ) : null;

        return (
            <GridRowInner
                key={index}
                onMouseEnter={this.hoverOn}
                onMouseLeave={this.hoverOff}
                // tslint:disable-next-line jsx-no-lambda
                onClick={() => this._setOrderPriceSelected(order.price)}
            >
                <CustomTD as="div" styles={{ tabular: true, textAlign: 'right' }}>
                    <ShowNumberWithColors isHover={this.state.isHover} num={new BigNumber(size)} />
                </CustomTD>
                <CustomTD as="div" styles={{ tabular: true, textAlign: 'right', color: priceColor }}>
                    {parseFloat(price).toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH)}
                </CustomTD>
                {mySizeRow}
            </GridRowInner>
        );
    };

    private readonly _setOrderPriceSelected = async (size: BigNumber) => {
        await this.props.onSetOrderPriceSelected(size);
    };
}

const mapOrderToRowDispatchToProps = (dispatch: any): OrderToRowDispatchProps => {
    return {
        onSetOrderPriceSelected: (orderPriceSelected: BigNumber) => dispatch(setOrderPriceSelected(orderPriceSelected)),
    };
};

const OrderToRowContainer = connect(
    null,
    mapOrderToRowDispatchToProps,
)(OrderToRow);

class OrderBookTable extends React.Component<Props> {
    private readonly _spreadRowScrollable: React.RefObject<HTMLDivElement>;
    private readonly _spreadRowFixed: React.RefObject<GridRowSpread>;
    private readonly _itemsScroll: React.RefObject<HTMLDivElement>;
    private _hasScrolled = false;

    constructor(props: Props) {
        super(props);

        this._spreadRowScrollable = React.createRef();
        this._spreadRowFixed = React.createRef();
        this._itemsScroll = React.createRef();
    }

    public render = () => {
        const { orderBook, baseToken, quoteToken, web3State, theme, absoluteSpread, percentageSpread } = this.props;
        const { sellOrders, buyOrders, mySizeOrders } = orderBook;
        const mySizeSellArray = mySizeOrders.filter((order: { side: OrderSide }) => {
            return order.side === OrderSide.Sell;
        });
        const mySizeBuyArray = mySizeOrders.filter((order: { side: OrderSide }) => {
            return order.side === OrderSide.Buy;
        });
        const getColor = (order: OrderBookItem): string => {
            return order.side === OrderSide.Buy ? theme.componentsTheme.green : theme.componentsTheme.red;
        };

        let content: React.ReactNode;

        if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
            content = <CenteredLoading />;
        } else if ((!buyOrders.length && !sellOrders.length) || !baseToken || !quoteToken) {
            content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
        } else {
            const mySizeHeader =
                web3State !== Web3State.Locked && web3State !== Web3State.NotInstalled ? (
                    <THLast as="div" styles={{ textAlign: 'right', borderBottom: true }}>
                        My Size
                    </THLast>
                ) : null;

            const spreadAbsFixed = absoluteSpread.toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH);
            const spreadPercentFixed = percentageSpread.toFixed(UI_DECIMALS_DISPLAYED_SPREAD_PERCENT);

            content = (
                <>
                    <GridRowTop as="div">
                        <TH as="div" styles={{ textAlign: 'right', borderBottom: true }}>
                            Trade size
                        </TH>
                        <TH as="div" styles={{ textAlign: 'right', borderBottom: true }}>
                            Price ({quoteToken.symbol})
                        </TH>
                        {mySizeHeader}
                    </GridRowTop>
                    <ItemsScroll ref={this._itemsScroll} onScroll={this._updateStickySpreadState}>
                        <GridRowSpread
                            ref={this._spreadRowFixed}
                            spreadAbsValue={spreadAbsFixed}
                            spreadPercentValue={spreadPercentFixed}
                        />
                        <ItemsMainContainer>
                            <TopItems>
                                {sellOrders.map((order, index) => (
                                    <OrderToRowContainer
                                        key={index}
                                        order={order}
                                        index={index}
                                        count={sellOrders.length}
                                        baseToken={baseToken}
                                        priceColor={getColor(order)}
                                        mySizeOrders={mySizeSellArray}
                                        web3State={web3State}
                                    />
                                ))}
                            </TopItems>
                            <GridRowSpreadContainer ref={this._spreadRowScrollable}>
                                <CustomTDTitle as="div" styles={customTDTitleStyles}>
                                    Spread
                                </CustomTDTitle>
                                <CustomTD as="div" styles={customTDStyles}>
                                    {spreadAbsFixed}
                                </CustomTD>
                                <CustomTDLast as="div" styles={customTDLastStyles}>
                                    {spreadPercentFixed}%
                                </CustomTDLast>
                            </GridRowSpreadContainer>
                            <BottomItems>
                                {buyOrders.map((order, index) => (
                                    <OrderToRowContainer
                                        key={index}
                                        order={order}
                                        index={index}
                                        count={buyOrders.length}
                                        baseToken={baseToken}
                                        priceColor={getColor(order)}
                                        mySizeOrders={mySizeBuyArray}
                                        web3State={web3State}
                                    />
                                ))}
                            </BottomItems>
                        </ItemsMainContainer>
                    </ItemsScroll>
                </>
            );
        }

        return <OrderbookCard title="Orderbook">{content}</OrderbookCard>;
    };

    public componentDidMount = () => {
        this._scrollToSpread();
    };

    public componentDidUpdate = () => {
        this._refreshStickySpreadOnItemsListUpdate();
        this._scrollToSpread();
    };

    private readonly _refreshStickySpreadOnItemsListUpdate = () => {
        if (this._spreadRowFixed.current && this._hasScrolled) {
            this._spreadRowFixed.current.updateStickSpreadState(this._getStickySpreadState(), this._getSpreadWidth());
        }
    };

    private readonly _getSpreadWidth = (): string => {
        return this._itemsScroll.current ? `${this._itemsScroll.current.clientWidth}px` : '';
    };

    private readonly _getSpreadOffsetTop = (): number => {
        return this._spreadRowScrollable.current ? this._spreadRowScrollable.current.offsetTop : 0;
    };

    private readonly _getSpreadHeight = (): number => {
        return this._spreadRowScrollable.current ? this._spreadRowScrollable.current.clientHeight : 0;
    };

    private readonly _getItemsListScroll = (): number => {
        return this._itemsScroll.current ? this._itemsScroll.current.scrollTop : 0;
    };

    private readonly _getItemsListHeight = (): number => {
        return this._itemsScroll.current ? this._itemsScroll.current.clientHeight : 0;
    };

    private readonly _getStickySpreadState = (): StickySpreadState => {
        const spreadOffsetTop = this._getSpreadOffsetTop();
        const itemsListScroll = this._getItemsListScroll();
        const topLimit = 0;

        if (spreadOffsetTop - itemsListScroll <= topLimit) {
            return 'top';
        } else if (itemsListScroll + this._getItemsListHeight() - this._getSpreadHeight() <= spreadOffsetTop) {
            return 'bottom';
        } else {
            return 'hidden';
        }
    };

    private readonly _updateStickySpreadState = () => {
        if (this._spreadRowFixed.current) {
            this._spreadRowFixed.current.updateStickSpreadState(this._getStickySpreadState(), this._getSpreadWidth());
        }
    };

    private readonly _scrollToSpread = () => {
        const { current } = this._spreadRowScrollable;

        // avoid scrolling for tablet sized screens and below
        if (window.outerWidth < parseInt(themeBreakPoints.xl, 10)) {
            return;
        }

        if (current && !this._hasScrolled) {
            // tslint:disable-next-line:no-unused-expression
            current.scrollIntoView && current.scrollIntoView({ block: 'center', behavior: 'smooth' });
            this._hasScrolled = true;
        }
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

const OrderBookTableContainer = withTheme(connect(mapStateToProps)(OrderBookTable));
const OrderBookTableWithTheme = withTheme(OrderBookTable);

export { OrderBookTable, OrderBookTableWithTheme, OrderBookTableContainer };
