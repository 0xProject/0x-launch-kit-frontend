import { OrderStatus } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getSelectedToken, getUserOrders } from '../../store/selectors';
import { tokenAmountInUnits } from '../../util/tokens';
import { StoreState, Tab, TabItem, Token, UIOrder, UIOrderSide } from '../../util/types';
import { Card } from '../common/card';
import { CardTabSelector } from '../common/card_tab_selector';
import { CardLoading } from '../common/loading';
import { TH as THBase, THead } from '../common/table';

interface StateProps {
    orders: UIOrder[];
    selectedToken: Token | null;
}

interface State {
    tab: Tab;
}

type Props = StateProps;

const TABLE = styled.table`
    width: 100%;
`;
const TR = styled.tr``;
const TH = styled(THBase)`
    color: #b9b9b9;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 1.2;
    padding: 0 10px 5px 0;
    text-transform: uppercase;

    &:last-child {
        padding-right: 0;
    }
`;
const CustomTD = styled.td`
    font-size: 14px;
    font-weight: normal;
    line-height: 1.2;
    padding: 5px 10px 5px 0;

    &:last-child {
        padding-right: 0;
    }
`;

const NoOrders = styled.div`
    padding: 10px 18px;
`;

const SideTD = styled(CustomTD)<{ side: UIOrderSide }>`
    color: ${props => (props.side === UIOrderSide.Buy ? '#3CB34F' : '#FF6534')};
`;

const orderToRow = (order: UIOrder, index: number, selectedToken: Token) => {
    const sideLabel = order.side === UIOrderSide.Sell ? 'Sell' : 'Buy';
    const size = tokenAmountInUnits(order.size, selectedToken.decimals);
    const filled = tokenAmountInUnits(order.filled, selectedToken.decimals);
    const price = order.price.toString();
    const status = order.status === OrderStatus.Fillable ? 'Open' : 'Filled';

    return (
        <TR key={index}>
            <SideTD side={order.side}>{sideLabel}</SideTD>
            <CustomTD>{size}</CustomTD>
            <CustomTD>{filled}</CustomTD>
            <CustomTD>{price}</CustomTD>
            <CustomTD>{status}</CustomTD>
        </TR>
    );
};

class OrderHistory extends React.Component<Props, State> {
    public state = {
        tab: Tab.Open,
    };

    public render = () => {
        const { orders, selectedToken } = this.props;

        const openOrders = orders.filter(order => order.status === OrderStatus.Fillable);
        const filledOrders = orders.filter(order => order.status === OrderStatus.FullyFilled);

        const ordersToShow = this.state.tab === Tab.Open ? openOrders : filledOrders;

        const setTabOpen = () => this.setState({ tab: Tab.Open });
        const setTabFilled = () => this.setState({ tab: Tab.Filled });

        const cardTabs: TabItem[] = [
            {
                active: this.state.tab === Tab.Open,
                onClick: setTabOpen,
                text: 'Open',
            },
            {
                active: this.state.tab === Tab.Filled,
                onClick: setTabFilled,
                text: 'Filled',
            },
        ];

        let content: React.ReactNode;

        if (!selectedToken) {
            content = <CardLoading />;
        } else if (!ordersToShow.length) {
            content = <NoOrders>There are no orders to show</NoOrders>;
        } else {
            content = (
                <TABLE>
                    <THead>
                        <TR>
                            <TH>Side</TH>
                            <TH>Size ({'foo'})</TH>
                            <TH>Filled ({'foo'})</TH>
                            <TH>Price (WETH)</TH>
                            <TH>Status</TH>
                        </TR>
                    </THead>
                    <tbody>{ordersToShow.map((order, index) => orderToRow(order, index, selectedToken))}</tbody>
                </TABLE>
            );
        }

        return (
            <Card title="Orders" action={<CardTabSelector tabs={cardTabs} />}>
                {content}
            </Card>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        orders: getUserOrders(state),
        selectedToken: getSelectedToken(state),
    };
};

const OrderHistoryContainer = connect(mapStateToProps)(OrderHistory);

export { OrderHistory, OrderHistoryContainer };
