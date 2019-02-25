import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { getOrderBook, getSelectedToken, getUserOrders } from '../../store/selectors';
import { themeColors } from '../../util/theme';
import { tokenAmountInUnits } from '../../util/tokens';
import { OrderBook, OrderBookItem, OrderSide, StoreState, TabItem, Token, UIOrder } from '../../util/types';
import { Card } from '../common/card';
import { CardTabSelector } from '../common/card_tab_selector';
import { EmptyContent } from '../common/empty_content';
import { CardLoading } from '../common/loading';
import { CustomTD, CustomTDLast, CustomTDTitle, Table, TH, THead, THLast, TR } from '../common/table';
interface StateProps {
    orderBook: OrderBook;
    selectedToken: Token | null;
    userOrders: UIOrder[];
}

type Props = StateProps;

enum Tab {
    Current,
    History,
}

interface State {
    tab: Tab;
}

const orderToRow = (
    order: OrderBookItem,
    index: number,
    count: number,
    selectedToken: Token,
    mySizeOrders: OrderBookItem[] = [],
) => {
    const size = tokenAmountInUnits(order.size, selectedToken.decimals);
    const price = order.price.toString();
    const priceColor = order.side === OrderSide.Buy ? themeColors.green : themeColors.orange;
    const time: string = '';
    const timeColor = time ? '#000' : themeColors.lightGray;

    const mySize = mySizeOrders.reduce((sumSize, mySizeItem) => {
        if (mySizeItem.price.equals(order.price)) {
            return sumSize.add(mySizeItem.size);
        }
        return sumSize;
    }, new BigNumber(0));

    const mySizeConverted = tokenAmountInUnits(mySize, selectedToken.decimals);

    return (
        <TR key={index}>
            <CustomTD styles={{ textAlign: 'right' }}>{size}</CustomTD>
            <CustomTD styles={{ textAlign: 'right' }}>{mySizeConverted}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', color: priceColor }}>{price}</CustomTD>
            <CustomTDLast styles={{ textAlign: 'right', color: timeColor }}>{time.length ? time : '-'}</CustomTDLast>
        </TR>
    );
};

class OrderBookTable extends React.Component<Props, State> {
    public state = {
        tab: Tab.Current,
    };

    public render = () => {
        const { orderBook, selectedToken } = this.props;
        const { sellOrders, buyOrders, mySizeOrders, spread } = orderBook;

        const setTabCurrent = () => this.setState({ tab: Tab.Current });
        const setTabHistory = () => this.setState({ tab: Tab.History });

        const cardTabs: TabItem[] = [
            {
                active: this.state.tab === Tab.Current,
                onClick: setTabCurrent,
                text: 'Current',
            },
            {
                active: this.state.tab === Tab.History,
                onClick: setTabHistory,
                text: 'History',
            },
        ];

        const mySizeSellArray = mySizeOrders.filter((order: { side: OrderSide }) => {
            return order.side === OrderSide.Sell;
        });

        const mySizeBuyArray = mySizeOrders.filter((order: { side: OrderSide }) => {
            return order.side === OrderSide.Buy;
        });

        let content: React.ReactNode;

        if (!selectedToken) {
            content = <CardLoading />;
        } else if (!buyOrders.length && !sellOrders.length) {
            content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
        } else {
            content = (
                <Table fitInCard={true}>
                    <THead>
                        <TR>
                            <TH styles={{ textAlign: 'right', borderBottom: true }}>Trade size</TH>
                            <TH styles={{ textAlign: 'right', borderBottom: true }}>My Size</TH>
                            <TH styles={{ textAlign: 'right', borderBottom: true }}>Price (ETH)</TH>
                            <THLast styles={{ textAlign: 'right', borderBottom: true }}>Time</THLast>
                        </TR>
                    </THead>
                    <tbody>
                        {sellOrders.map((order, index) =>
                            orderToRow(order, index, sellOrders.length, selectedToken, mySizeSellArray),
                        )}
                        <TR>
                            <CustomTDTitle styles={{ textAlign: 'right', borderBottom: true, borderTop: true }}>
                                Spread
                            </CustomTDTitle>
                            <CustomTD styles={{ textAlign: 'right', borderBottom: true, borderTop: true }}>{}</CustomTD>
                            <CustomTD styles={{ textAlign: 'right', borderBottom: true, borderTop: true }}>
                                {spread.toFixed(2)}
                            </CustomTD>
                            <CustomTDLast styles={{ textAlign: 'right', borderBottom: true, borderTop: true }}>
                                {}
                            </CustomTDLast>
                        </TR>
                        {buyOrders.map((order, index) =>
                            orderToRow(order, index, buyOrders.length, selectedToken, mySizeBuyArray),
                        )}
                    </tbody>
                </Table>
            );
        }

        return (
            <Card title="Orderbook" action={<CardTabSelector tabs={cardTabs} />}>
                {content}
            </Card>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        orderBook: getOrderBook(state),
        selectedToken: getSelectedToken(state),
        userOrders: getUserOrders(state),
    };
};

const OrderBookTableContainer = connect(mapStateToProps)(OrderBookTable);

export { OrderBookTable, OrderBookTableContainer };
