import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { UI_DECIMALS_DISPLAYED_ORDER_SIZE, UI_DECIMALS_DISPLAYED_PRICE_ETH } from '../../common/constants';
import { getBaseToken, getOrderBook, getQuoteToken, getUserOrders, getWeb3State } from '../../store/selectors';
import { Theme, themeBreakPoints } from '../../themes/commons';
import { tokenAmountInUnits } from '../../util/tokens';
import { OrderBook, OrderBookItem, OrderSide, StoreState, Token, UIOrder, Web3State } from '../../util/types';
import { Card } from '../common/card';
import { EmptyContent } from '../common/empty_content';
import { CardLoading } from '../common/loading';
import { ShowNumberWithColors } from '../common/show_number_with_colors';
import { CustomTD, CustomTDLast, CustomTDTitle, TH, THLast } from '../common/table';

interface StateProps {
    orderBook: OrderBook;
    baseToken: Token | null;
    quoteToken: Token | null;
    userOrders: UIOrder[];
    web3State?: Web3State;
}

interface OwnProps {
    theme: Theme;
}

type Props = OwnProps & StateProps;

interface State {
    stickySpreadPosition: string;
    stickySpreadWidth: string;
}

interface GridRowSpreadProps {
    stickySpreadPosition?: string;
    stickySpreadWidth?: string;
}

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

const GridRowTop = styled(GridRow)`
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
`;

const GridRowSpread = styled(GridRow)<GridRowSpreadProps>`
    ${props => (props.stickySpreadPosition && props.stickySpreadPosition === 'top' ? 'top: 29px;' : '')}
    ${props => (props.stickySpreadPosition && props.stickySpreadPosition === 'bottom' ? 'bottom: 0;' : '')}

    background-color: ${props => props.theme.componentsTheme.cardBackgroundColor};
    flex-grow: 0;
    flex-shrink: 0;
    display: grid;
    position: ${props => (props.stickySpreadPosition !== '' ? 'absolute' : 'relative')};
    width: ${props => props.stickySpreadWidth};
    z-index: 12;
`;

GridRowSpread.defaultProps = {
    stickySpreadWidth: 'auto',
};

const CenteredLoading = styled(CardLoading)`
    align-self: center;
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

const orderToRow = (
    order: OrderBookItem,
    index: number,
    count: number,
    baseToken: Token,
    priceColor: string,
    mySizeOrders: OrderBookItem[] = [],
    web3State?: Web3State,
) => {
    const size = tokenAmountInUnits(order.size, baseToken.decimals, UI_DECIMALS_DISPLAYED_ORDER_SIZE);
    const price = order.price.toString();

    const mySize = mySizeOrders.reduce((sumSize, mySizeItem) => {
        if (mySizeItem.price.equals(order.price)) {
            return sumSize.add(mySizeItem.size);
        }
        return sumSize;
    }, new BigNumber(0));

    const mySizeConverted = tokenAmountInUnits(mySize, baseToken.decimals, UI_DECIMALS_DISPLAYED_ORDER_SIZE);
    const mySizeRow =
        web3State !== Web3State.Locked && web3State !== Web3State.NotInstalled ? (
            <CustomTD as="div" styles={{ tabular: true, textAlign: 'right' }} id="mySize">
                {mySizeConverted !== '0.00' ? mySizeConverted : '-'}
            </CustomTD>
        ) : null;

    return (
        <GridRow key={index}>
            <CustomTD as="div" styles={{ tabular: true, textAlign: 'right' }}>
                <ShowNumberWithColors num={new BigNumber(size)} />
            </CustomTD>
            {mySizeRow}
            <CustomTDLast as="div" styles={{ tabular: true, textAlign: 'right', color: priceColor }}>
                {parseFloat(price).toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH)}
            </CustomTDLast>
        </GridRow>
    );
};

const getSpreadRow = (
    ref: React.RefObject<HTMLDivElement>,
    spread: string,
    stickySpreadPosition: string = '',
    stickySpreadWidth: string = '',
): React.ReactNode => {
    return (
        <GridRowSpread ref={ref} stickySpreadPosition={stickySpreadPosition} stickySpreadWidth={stickySpreadWidth}>
            <CustomTDTitle as="div" styles={{ textAlign: 'right', borderBottom: true, borderTop: true }}>
                Spread
            </CustomTDTitle>
            <CustomTD as="div" styles={{ textAlign: 'right', borderBottom: true, borderTop: true }}>
                {}
            </CustomTD>
            <CustomTDLast
                as="div"
                styles={{
                    tabular: true,
                    textAlign: 'right',
                    borderBottom: true,
                    borderTop: true,
                }}
            >
                {spread}
            </CustomTDLast>
        </GridRowSpread>
    );
};

class OrderBookTable extends React.Component<Props, State> {
    public readonly state: State = {
        stickySpreadPosition: '',
        stickySpreadWidth: '100%',
    };

    private readonly _spreadRowScrollable: React.RefObject<HTMLDivElement>;
    private readonly _spreadRowFixed: React.RefObject<HTMLDivElement>;
    private readonly _itemsScroll: React.RefObject<HTMLDivElement>;
    private _hasScrolled = false;

    constructor(props: Props) {
        super(props);

        this._spreadRowScrollable = React.createRef();
        this._spreadRowFixed = React.createRef();
        this._itemsScroll = React.createRef();
    }

    public render = () => {
        const { orderBook, baseToken, quoteToken, web3State, theme } = this.props;
        const { sellOrders, buyOrders, mySizeOrders, spread } = orderBook;
        const spreadToFixed = spread.toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH);

        const mySizeSellArray = mySizeOrders.filter((order: { side: OrderSide }) => {
            return order.side === OrderSide.Sell;
        });

        const mySizeBuyArray = mySizeOrders.filter((order: { side: OrderSide }) => {
            return order.side === OrderSide.Buy;
        });

        const getColor = (order: OrderBookItem): string => {
            return order.side === OrderSide.Buy ? theme.componentsTheme.green : theme.componentsTheme.orange;
        };

        let content: React.ReactNode;

        if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
            content = <CenteredLoading />;
        } else if ((!buyOrders.length && !sellOrders.length) || !baseToken || !quoteToken) {
            content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
        } else {
            const mySizeHeader =
                web3State !== Web3State.Locked && web3State !== Web3State.NotInstalled ? (
                    <TH as="div" styles={{ textAlign: 'right', borderBottom: true }}>
                        My Size
                    </TH>
                ) : null;
            content = (
                <>
                    <GridRowTop as="div">
                        <TH as="div" styles={{ textAlign: 'right', borderBottom: true }}>
                            Trade size
                        </TH>
                        {mySizeHeader}
                        <THLast as="div" styles={{ textAlign: 'right', borderBottom: true }}>
                            Price ({quoteToken.symbol})
                        </THLast>
                    </GridRowTop>
                    <ItemsScroll ref={this._itemsScroll} onScroll={this._updateStickySpread}>
                        {this.state.stickySpreadPosition
                            ? getSpreadRow(
                                  this._spreadRowFixed,
                                  spreadToFixed,
                                  this.state.stickySpreadPosition,
                                  this.state.stickySpreadWidth,
                              )
                            : null}
                        <ItemsMainContainer>
                            <TopItems>
                                {sellOrders.map((order, index) =>
                                    orderToRow(
                                        order,
                                        index,
                                        sellOrders.length,
                                        baseToken,
                                        getColor(order),
                                        mySizeSellArray,
                                        web3State,
                                    ),
                                )}
                            </TopItems>
                            {getSpreadRow(this._spreadRowScrollable, spreadToFixed)}
                            <BottomItems>
                                {buyOrders.map((order, index) =>
                                    orderToRow(
                                        order,
                                        index,
                                        buyOrders.length,
                                        baseToken,
                                        getColor(order),
                                        mySizeBuyArray,
                                        web3State,
                                    ),
                                )}
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
        this._scrollToSpread();
    };

    private readonly _updateStickySpread = (event: any) => {
        const spreadOffsetTop = this._spreadRowScrollable.current ? this._spreadRowScrollable.current.offsetTop : 0;
        const spreadHeight = this._spreadRowScrollable.current ? this._spreadRowScrollable.current.clientHeight : 0;
        const itemsListScroll = this._itemsScroll.current ? this._itemsScroll.current.scrollTop : 0;
        const itemsListHeight = this._itemsScroll.current ? this._itemsScroll.current.clientHeight : 0;
        const topLimit = 0;

        // Note: it's necessary to set the sticky spread's width to be the same
        // as the items list to account for the scrollbar's width.
        this.setState({
            stickySpreadWidth: this._itemsScroll.current ? `${this._itemsScroll.current.clientWidth}px` : '',
        });

        if (spreadOffsetTop - itemsListScroll <= topLimit) {
            this.setState({ stickySpreadPosition: 'top' });
        } else if (itemsListScroll + itemsListHeight - spreadHeight <= spreadOffsetTop) {
            this.setState({ stickySpreadPosition: 'bottom' });
        } else {
            this.setState({ stickySpreadPosition: '' });
        }
    };

    private readonly _scrollToSpread = () => {
        const { current } = this._spreadRowScrollable;
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
    };
};

const OrderBookTableContainer = withTheme(connect(mapStateToProps)(OrderBookTable));
const OrderBookTableWithTheme = withTheme(OrderBookTable);

export { OrderBookTable, OrderBookTableWithTheme, OrderBookTableContainer };
