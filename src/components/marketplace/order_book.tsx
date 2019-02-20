import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getOrderBook, getSelectedToken } from '../../store/selectors';
import { tokenAmountInUnits } from '../../util/tokens';
import { OrderBook, OrderBookItem, StoreState, TabItem, Token, UIOrderSide } from '../../util/types';
import { Card } from '../common/card';
import { CardTabSelector } from '../common/card_tab_selector';
import { CardLoading } from '../common/loading';
import { TH as THBase, THead } from '../common/table';

interface StateProps {
    orderBook: OrderBook;
    selectedToken: Token | null;
}

type Props = StateProps;

enum Tab {
    Current,
    History,
}

interface State {
    tab: Tab;
}

const TR = styled.tr`
    &:first-child td {
        padding-top: 10px;
    }
    &:last-child td {
        padding-bottom: 10px;
    }
`;
const HeaderTR = styled(TR)`
    border-width: 1px 0;
    border: 1px solid #dedede;

    &:first-child {
        border-top: 0;
    }
`;
const TH = styled(THBase)`
    min-width: 10rem;
    padding: 10px 0;

    &:first-child {
        padding-left: 18px;
    }
    &:last-child {
        width: 100%;
    }
`;

const CustomTD = styled.td<{ isLastSell: boolean; isFirstBuy: boolean }>`
    min-width: 10rem;
    padding-bottom: ${props => (props.isLastSell ? '10px' : '5px')};
    padding-top: ${props => (props.isFirstBuy ? '10px' : '5px')};

    &:first-child {
        padding-left: 18px;
    }
`;

const SideTD = styled(CustomTD)<{ side: UIOrderSide }>`
    color: ${props => (props.side === UIOrderSide.Buy ? '#3CB34F' : '#FF6534')};
`;

const SpreadTH = styled(TH)``;

const SpreadLabelTH = styled(SpreadTH)`
    color: #ccc;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 12px;
`;
const SpreadValueTH = styled(SpreadTH)`
    font-weight: normal;
`;

const NoOrders = styled.div`
    padding: 10px 18px;
`;

const orderToRow = (order: OrderBookItem, index: number, count: number, selectedToken: Token) => {
    const size = tokenAmountInUnits(order.size, selectedToken.decimals);
    const price = order.price.toString();

    const isLastSell = order.side === UIOrderSide.Sell && index + 1 === count;
    const isFirstBuy = order.side === UIOrderSide.Buy && index === 0;

    return (
        <TR key={index}>
            <CustomTD isLastSell={isLastSell} isFirstBuy={isFirstBuy}>
                {size}
            </CustomTD>
            <SideTD side={order.side} isLastSell={isLastSell} isFirstBuy={isFirstBuy}>
                {price}
            </SideTD>
        </TR>
    );
};

class OrderBookTable extends React.Component<Props, State> {
    public state = {
        tab: Tab.Current,
    };

    public render = () => {
        const { orderBook, selectedToken } = this.props;
        const { sellOrders, buyOrders, spread } = orderBook;

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

        const spreadRow = (
            <HeaderTR>
                <SpreadLabelTH>Spread</SpreadLabelTH>
                <SpreadValueTH>{spread.toFixed(2)}</SpreadValueTH>
            </HeaderTR>
        );

        let content: React.ReactNode;

        if (!selectedToken) {
            content = <CardLoading />;
        } else if (!buyOrders.length && !sellOrders.length) {
            content = <NoOrders>There are no orders to show</NoOrders>;
        } else {
            content = (
                <table>
                    <THead>
                        <HeaderTR>
                            <TH>Order size</TH>
                            <TH>Price</TH>
                        </HeaderTR>
                    </THead>
                    <tbody>
                        {sellOrders.map((order, index) => orderToRow(order, index, sellOrders.length, selectedToken))}
                        {spreadRow}
                        {buyOrders.map((order, index) => orderToRow(order, index, buyOrders.length, selectedToken))}
                    </tbody>
                </table>
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
    };
};

const OrderBookTableContainer = connect(mapStateToProps)(OrderBookTable);

export { OrderBookTable, OrderBookTableContainer };
