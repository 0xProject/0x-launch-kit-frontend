import { OrderStatus } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getSelectedToken, getUserOrders } from '../../store/selectors';
import { tokenAmountInUnits } from '../../util/tokens';
import { StoreState, TabItem, Token, UIOrder, UIOrderSide } from '../../util/types';
import { Card } from '../common/card';
import { CardTabSelector } from '../common/card_tab_selector';
import { CardLoading } from '../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../common/table';

import { CancelOrderButtonContainer } from './cancel_order_button';

interface StateProps {
    orders: UIOrder[];
    selectedToken: Token | null;
}

enum Tab {
    Filled,
    Open,
}

interface State {
    tab: Tab;
}

type Props = StateProps;

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
            <CustomTD>
                <CancelOrderButtonContainer order={order} />
            </CustomTD>
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
                <Table isResponsive={true}>
                    <THead>
                        <TR>
                            <TH>Side</TH>
                            <TH>Size ({selectedToken.symbol})</TH>
                            <TH>Filled ({selectedToken.symbol})</TH>
                            <TH>Price (WETH)</TH>
                            <TH>Status</TH>
                            <TH>&nbsp;</TH>
                        </TR>
                    </THead>
                    <tbody>{ordersToShow.map((order, index) => orderToRow(order, index, selectedToken))}</tbody>
                </Table>
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
