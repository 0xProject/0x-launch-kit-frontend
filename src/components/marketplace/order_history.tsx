import { OrderStatus } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getOrders, getSelectedToken } from '../../store/selectors';
import { tokenAmountInUnits } from '../../util/tokens';
import { StoreState, Token, UIOrder, UIOrderSide } from '../../util/types';
import { Card } from '../common/card';
import { TH as THBase, THead } from '../common/table';

interface Props {
    orders: UIOrder[];
    selectedToken: Token | null;
}

interface State {
    tab: Tab;
}

enum Tab {
    Open,
    Filled,
}

const TR = styled.tr``;
const TH = styled(THBase)`
    min-width: 10rem;
`;
const CustomTD = styled.td`
    padding-bottom: 10px;
    min-width: 10rem;
`;

const SideTD = styled(CustomTD)<{ side: UIOrderSide }>`
    color: ${props => (props.side === UIOrderSide.Buy ? '#3CB34F' : '#FF6534')};
`;

const orderToRow = (order: UIOrder, index: number, selectedToken: Token) => {
    const sideLabel = order.side === UIOrderSide.Sell ? 'Sell' : 'Buy';
    const size = tokenAmountInUnits(selectedToken, order.size);
    const filled = tokenAmountInUnits(selectedToken, order.filled);
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

        const TabSelector = (
            <span>
                <span onClick={setTabOpen} style={{ color: this.state.tab === Tab.Open ? 'black' : '#ccc' }}>
                    Open
                </span>
                &nbsp;/&nbsp;
                <span onClick={setTabFilled} style={{ color: this.state.tab === Tab.Filled ? 'black' : '#ccc' }}>
                    Filled
                </span>
            </span>
        );

        return (
            <Card title="Orders" action={TabSelector}>
                {selectedToken ? (
                    ordersToShow.length ? (
                        <table>
                            <THead>
                                <tr>
                                    <TH>Side</TH>
                                    <TH>Size</TH>
                                    <TH>Filled</TH>
                                    <TH>Price</TH>
                                    <TH>Status</TH>
                                </tr>
                            </THead>
                            <tbody>{ordersToShow.map((order, index) => orderToRow(order, index, selectedToken))}</tbody>
                        </table>
                    ) : (
                        'There are no orders to show'
                    )
                ) : (
                    'Loading orders...'
                )}
            </Card>
        );
    };
}

const mapStateToProps = (state: StoreState): Props => {
    return {
        orders: getOrders(state),
        selectedToken: getSelectedToken(state),
    };
};

const OrderHistoryContainer = connect(mapStateToProps)(OrderHistory);

export { OrderHistory, OrderHistoryContainer };
