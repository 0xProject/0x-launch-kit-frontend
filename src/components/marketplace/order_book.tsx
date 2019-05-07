import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { UI_DECIMALS_DISPLAYED_ORDER_SIZE, UI_DECIMALS_DISPLAYED_PRICE_ETH } from '../../common/constants';
import { getBaseToken, getOrderBook, getQuoteToken, getUserOrders, getWeb3State } from '../../store/selectors';
import { Theme } from '../../themes/commons';
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

const OrderbookCard = styled(Card)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: 0;

    > div:first-child {
        flex-grow: 0;
        flex-shrink: 0;
    }

    > div:nth-child(2) {
        /* align-items: flex-start; */
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        /* justify-content: center; */
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
`;

const GridRowSpread = styled(GridRow)`
    flex-grow: 0;
    flex-shrink: 0;
`;

const CenteredLoading = styled(CardLoading)`
    align-self: center;
`;

const ItemsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    overflow: auto;
`;

const TopItems = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 1;
    justify-content: flex-end;
`;

const BottomItems = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 1;
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
            <CustomTD as="div" styles={{ tabular: true, textAlign: 'right' }}>
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

class OrderBookTable extends React.Component<Props> {
    private readonly _spreadRow: React.RefObject<HTMLTableRowElement>;
    private _hasScrolled = false;

    constructor(props: Props) {
        super(props);

        this._spreadRow = React.createRef();
    }

    public render = () => {
        const { orderBook, baseToken, quoteToken, web3State, theme } = this.props;
        const { sellOrders, buyOrders, mySizeOrders, spread } = orderBook;

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
                    <ItemsContainer>
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
                        <GridRowSpread ref={this._spreadRow}>
                            <CustomTDTitle
                                as="div"
                                styles={{ textAlign: 'right', borderBottom: true, borderTop: true }}
                            >
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
                                {spread.toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH)}
                            </CustomTDLast>
                        </GridRowSpread>
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
                    </ItemsContainer>
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

    private readonly _scrollToSpread = () => {
        if (this._spreadRow.current && !this._hasScrolled) {
            this._spreadRow.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
