import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getOrderBook, getSelectedToken } from '../../store/selectors';
import { tokenAmountInUnits } from '../../util/tokens';
import { OrderBook, OrderBookItem, StoreState, Token, UIOrderSide } from '../../util/types';
import { Card } from '../common/card';
import { TH as THBase, THead } from '../common/table';

interface StateProps {
    orderBook: OrderBook;
    selectedToken: Token | null;
}

type Props = StateProps;

interface State {
    tab: Tab;
}

enum Tab {
    Current,
    History,
}

const TR = styled.tr`
`;
const HeaderTR = styled(TR)`
    border: 1px solid #dedede;
    border-width: 1px 0;
`;
const TH = styled(THBase)`
    min-width: 10rem;
    padding: 10px 0;

    &:last-child {
        width: 100%;
    }
`;
const CustomTD = styled.td`
    padding: 5px 0;
    min-width: 10rem;
`;

const SideTD = styled(CustomTD)<{ side: UIOrderSide }>`
    color: ${props => (props.side === UIOrderSide.Buy ? '#3CB34F' : '#FF6534')};
`;

const SpreadTH = styled(TH)`
`;

const SpreadLabelTH = styled(SpreadTH)`
    color: #ccc;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 12px;
`;
const SpreadValueTH = styled(SpreadTH)`
    font-weight: normal;
`;

const orderToRow = (order: OrderBookItem, index: number, selectedToken: Token) => {
    const size = tokenAmountInUnits(selectedToken, order.size);
    const price = order.price.toString();

    return (
        <TR key={index}>
            <CustomTD>{size}</CustomTD>
            <SideTD side={order.side}>{price}</SideTD>
        </TR>
    );
};

const Spacing = styled.div`
    height: 0.5rem;
`;

class OrderBookTable extends React.Component<Props, State> {
    public state = {
        tab: Tab.Current,
    };

    public render = () => {
        const { orderBook, selectedToken } = this.props;
        const { sellOrders, buyOrders, spread } = orderBook;

        const setTabCurrent = () => this.setState({ tab: Tab.Current });
        const setTabHistory = () => this.setState({ tab: Tab.History });

        const TabSelector = (
            <span>
                <span onClick={setTabCurrent} style={{ color: this.state.tab === Tab.Current ? 'black' : '#ccc' }}>
                    Current
                </span>
                &nbsp;/&nbsp;
                <span onClick={setTabHistory} style={{ color: this.state.tab === Tab.History ? 'black' : '#ccc' }}>
                    History
                </span>
            </span>
        );

        const spreadRow = (
            <HeaderTR>
                <SpreadLabelTH>Spread</SpreadLabelTH>
                <SpreadValueTH>{spread.toFixed(2)}</SpreadValueTH>
            </HeaderTR>
        );

        return (
            <Card title="Order book" action={TabSelector}>
                {selectedToken ? (
                    (buyOrders.length + sellOrders.length) ? (
                        <table>
                            <THead>
                                <HeaderTR>
                                    <TH>Order size</TH>
                                    <TH>Price</TH>
                                </HeaderTR>
                            </THead>
                            <Spacing />
                            <tbody>
                                {sellOrders.map((order, index) => orderToRow(order, index, selectedToken))}
                                <Spacing />
                                {spreadRow}
                                <Spacing />
                                {buyOrders.map((order, index) => orderToRow(order, index, selectedToken))}
                            </tbody>
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

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        orderBook: getOrderBook(state),
        selectedToken: getSelectedToken(state),
    };
};

const OrderBookTableContainer = connect(mapStateToProps)(OrderBookTable);

export { OrderBookTable, OrderBookTableContainer };
