import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { UI_DECIMALS_DISPLAYED_ORDER_SIZE, UI_DECIMALS_DISPLAYED_PRICE_ETH } from '../../common/constants';
import {
    getBaseToken,
    getOrderBook,
    getQuoteToken,
    getThemeColors,
    getUserOrders,
    getWeb3State,
} from '../../store/selectors';
import { BasicTheme } from '../../themes/BasicTheme';
import { tokenAmountInUnits } from '../../util/tokens';
import {
    OrderBook,
    OrderBookItem,
    OrderSide,
    StoreState,
    StyledComponentThemeProps,
    TabItem,
    Token,
    UIOrder,
    Web3State,
} from '../../util/types';
import { Card } from '../common/card';
import { CardTabSelector } from '../common/card_tab_selector';
import { EmptyContentContainer } from '../common/empty_content';
import { CardLoading } from '../common/loading';
import { ShowNumberWithColors } from '../common/show_number_with_colors';
import { CustomTD, CustomTDLast, CustomTDTitle, Table, TH, THead, THLast, TR } from '../common/table';

interface StateProps extends StyledComponentThemeProps {
    orderBook: OrderBook;
    baseToken: Token | null;
    quoteToken: Token | null;
    userOrders: UIOrder[];
    web3State?: Web3State;
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
    baseToken: Token,
    mySizeOrders: OrderBookItem[] = [],
    themeColors: BasicTheme,
    web3State?: Web3State,
) => {
    const size = tokenAmountInUnits(order.size, baseToken.decimals, UI_DECIMALS_DISPLAYED_ORDER_SIZE);
    const price = order.price.toString();
    const priceColor = order.side === OrderSide.Buy ? themeColors.green : themeColors.orange;

    const mySize = mySizeOrders.reduce((sumSize, mySizeItem) => {
        if (mySizeItem.price.equals(order.price)) {
            return sumSize.add(mySizeItem.size);
        }
        return sumSize;
    }, new BigNumber(0));

    const mySizeConverted = tokenAmountInUnits(mySize, baseToken.decimals, UI_DECIMALS_DISPLAYED_ORDER_SIZE);
    const mySizeRow =
        web3State !== Web3State.Locked && web3State !== Web3State.NotInstalled ? (
            <CustomTD themeColors={themeColors} styles={{ tabular: true, textAlign: 'right' }}>
                {mySizeConverted !== '0.00' ? mySizeConverted : '-'}
            </CustomTD>
        ) : null;

    return (
        <TR key={index}>
            <CustomTD themeColors={themeColors} styles={{ tabular: true, textAlign: 'right' }}>
                <ShowNumberWithColors num={new BigNumber(size)} />
            </CustomTD>
            {mySizeRow}
            <CustomTDLast themeColors={themeColors} styles={{ tabular: true, textAlign: 'right', color: priceColor }}>
                {parseFloat(price).toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH)}
            </CustomTDLast>
        </TR>
    );
};

class OrderBookTable extends React.Component<Props, State> {
    public state = {
        tab: Tab.Current,
    };

    public render = () => {
        const { orderBook, baseToken, quoteToken, themeColors, web3State } = this.props;
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

        if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
            content = <CardLoading minHeight="120px" />;
        } else if ((!buyOrders.length && !sellOrders.length) || !baseToken || !quoteToken) {
            content = <EmptyContentContainer alignAbsoluteCenter={true} text="There are no orders to show" />;
        } else {
            const mySizeHeader =
                web3State !== Web3State.Locked && web3State !== Web3State.NotInstalled ? (
                    <TH themeColors={themeColors} styles={{ textAlign: 'right', borderBottom: true }}>
                        My Size
                    </TH>
                ) : null;
            content = (
                <Table themeColors={themeColors} fitInCard={true}>
                    <THead>
                        <TR>
                            <TH themeColors={themeColors} styles={{ textAlign: 'right', borderBottom: true }}>
                                Trade size
                            </TH>
                            {mySizeHeader}
                            <THLast themeColors={themeColors} styles={{ textAlign: 'right', borderBottom: true }}>
                                Price ({quoteToken.symbol})
                            </THLast>
                        </TR>
                    </THead>
                    <tbody>
                        {sellOrders.map((order, index) =>
                            orderToRow(
                                order,
                                index,
                                sellOrders.length,
                                baseToken,
                                mySizeSellArray,
                                themeColors,
                                web3State,
                            ),
                        )}
                        <TR>
                            <CustomTDTitle
                                themeColors={themeColors}
                                styles={{ textAlign: 'right', borderBottom: true, borderTop: true }}
                            >
                                Spread
                            </CustomTDTitle>
                            <CustomTD
                                themeColors={themeColors}
                                styles={{ textAlign: 'right', borderBottom: true, borderTop: true }}
                            >
                                {}
                            </CustomTD>
                            <CustomTDLast
                                themeColors={themeColors}
                                styles={{
                                    tabular: true,
                                    textAlign: 'right',
                                    borderBottom: true,
                                    borderTop: true,
                                }}
                            >
                                {spread.toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH)}
                            </CustomTDLast>
                        </TR>
                        {buyOrders.map((order, index) =>
                            orderToRow(
                                order,
                                index,
                                buyOrders.length,
                                baseToken,
                                mySizeBuyArray,
                                themeColors,
                                web3State,
                            ),
                        )}
                    </tbody>
                </Table>
            );
        }

        return (
            <Card
                title="Orderbook"
                action={<CardTabSelector tabs={cardTabs} themeColors={themeColors} />}
                themeColors={themeColors}
            >
                {content}
            </Card>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        orderBook: getOrderBook(state),
        baseToken: getBaseToken(state),
        userOrders: getUserOrders(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
        themeColors: getThemeColors(state),
    };
};

const OrderBookTableContainer = connect(mapStateToProps)(OrderBookTable);

export { OrderBookTable, OrderBookTableContainer };
