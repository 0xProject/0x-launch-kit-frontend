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

type Props = StateProps;

interface State {
    tab: Tab;
}

const TR = styled.tr``;
const TH = styled(THBase)`
    min-width: 10rem;

    padding: 10px 0;

    &:first-child {
        padding-left: 18px;
    }
`;
const CustomTD = styled.td`
    padding-bottom: 10px;
    min-width: 10rem;

    &:first-child {
        padding-left: 18px;
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

        const TabSelector = <CardTabSelector tabs={cardTabs} />;

        let content: React.ReactNode;
        if (!selectedToken) {
            content = <CardLoading />;
        } else if (!ordersToShow.length) {
            content = <NoOrders>There are no orders to show</NoOrders>;
        } else {
            content = (
                <table>
                    <THead>
                        <tr>
                            <TH>Side</TH>
                            <TH>Size ({'foo'})</TH>
                            <TH>Filled ({'foo'})</TH>
                            <TH>Price (WETH)</TH>
                            <TH>Status</TH>
                        </tr>
                    </THead>
                    <tbody>{ordersToShow.map((order, index) => orderToRow(order, index, selectedToken))}</tbody>
                </table>
            );
        }

        return (
            <Card title="Orders" action={TabSelector}>
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
