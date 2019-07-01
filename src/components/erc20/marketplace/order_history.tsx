import { OrderStatus } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { UI_DECIMALS_DISPLAYED_PRICE_ETH } from '../../../common/constants';
import { getBaseToken, getQuoteToken, getUserOrders, getWeb3State } from '../../../store/selectors';
import { tokenAmountInUnits } from '../../../util/tokens';
import { OrderSide, StoreState, Token, UIOrder, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../../common/table';

import { CancelOrderButtonContainer } from './cancel_order_button';

interface StateProps {
    baseToken: Token | null;
    orders: UIOrder[];
    quoteToken: Token | null;
    web3State?: Web3State;
}

type Props = StateProps;

const SideTD = styled(CustomTD)<{ side: OrderSide }>`
    color: ${props =>
        props.side === OrderSide.Buy ? props.theme.componentsTheme.green : props.theme.componentsTheme.red};
`;

const orderToRow = (order: UIOrder, index: number, baseToken: Token) => {
    const sideLabel = order.side === OrderSide.Sell ? 'Sell' : 'Buy';
    const size = tokenAmountInUnits(order.size, baseToken.decimals, baseToken.displayDecimals);
    let status = '--';
    let isOrderFillable = false;

    const filled = order.filled
        ? tokenAmountInUnits(order.filled, baseToken.decimals, baseToken.displayDecimals)
        : null;
    if (order.status) {
        isOrderFillable = order.status === OrderStatus.Fillable;
        status = isOrderFillable ? 'Open' : 'Filled';
    }

    const price = parseFloat(order.price.toString()).toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH);

    return (
        <TR key={index}>
            <SideTD side={order.side}>{sideLabel}</SideTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{size}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{filled}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{price}</CustomTD>
            <CustomTD>{status}</CustomTD>
            <CustomTD styles={{ textAlign: 'center' }}>
                {isOrderFillable ? <CancelOrderButtonContainer order={order} /> : ''}
            </CustomTD>
        </TR>
    );
};

class OrderHistory extends React.Component<Props> {
    public render = () => {
        const { orders, baseToken, quoteToken, web3State } = this.props;
        const ordersToShow = orders.filter(order => order.status === OrderStatus.Fillable);

        let content: React.ReactNode;
        switch (web3State) {
            case Web3State.Locked:
            case Web3State.NotInstalled:
            case Web3State.Loading: {
                content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
                break;
            }
            default: {
                if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
                    content = <LoadingWrapper minHeight="120px" />;
                } else if (!ordersToShow.length || !baseToken || !quoteToken) {
                    content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
                } else {
                    content = (
                        <Table isResponsive={true}>
                            <THead>
                                <TR>
                                    <TH>Side</TH>
                                    <TH styles={{ textAlign: 'right' }}>Size ({baseToken.symbol})</TH>
                                    <TH styles={{ textAlign: 'right' }}>Filled ({baseToken.symbol})</TH>
                                    <TH styles={{ textAlign: 'right' }}>Price ({quoteToken.symbol})</TH>
                                    <TH>Status</TH>
                                    <TH>&nbsp;</TH>
                                </TR>
                            </THead>
                            <tbody>{ordersToShow.map((order, index) => orderToRow(order, index, baseToken))}</tbody>
                        </Table>
                    );
                }
                break;
            }
        }

        return <Card title="My Current Orders">{content}</Card>;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseToken(state),
        orders: getUserOrders(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
    };
};

const OrderHistoryContainer = connect(mapStateToProps)(OrderHistory);

export { OrderHistory, OrderHistoryContainer };
