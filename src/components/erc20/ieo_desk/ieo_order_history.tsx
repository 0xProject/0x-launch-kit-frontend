import { OrderStatus } from '@0x/types';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getBaseTokenIEO, getUserIEOUIOrders, getWeb3State, getWethTokenBalance } from '../../../store/selectors';
import { themeBreakPoints } from '../../../themes/commons';
import { tokenAmountInUnits } from '../../../util/tokens';
import { OrderSide, StoreState, Token, TokenBalance, UIOrder, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../../common/table';
import { CancelOrderButtonContainer } from '../marketplace/cancel_order_button';

const OrderHistoryCard = styled(Card)`
    max-height: 220px;
    overflow: auto;
    @media (max-width: ${themeBreakPoints.sm}) {
        margin-top: 10px;
    }
`;

interface StateProps {
    baseToken: Token | null;
    orders: UIOrder[];
    wethTokenBalance: TokenBalance | null;
    web3State?: Web3State;
}

type Props = StateProps;

const SideTD = styled(CustomTD)<{ side: OrderSide }>`
    color: ${props =>
        props.side === OrderSide.Buy ? props.theme.componentsTheme.green : props.theme.componentsTheme.red};
`;

const orderToRow = (order: UIOrder, index: number, baseToken: Token, quoteToken: Token) => {
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

    const price = parseFloat(order.price.toString()).toFixed(12);

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

const IEOOrderHistory = (props: Props) => {
    const { orders, baseToken, wethTokenBalance, web3State } = props;
    const ordersToShow = orders.filter(order => order.status === OrderStatus.Fillable);

    let content: React.ReactNode;
    switch (web3State) {
        case Web3State.Locked:
        case Web3State.NotInstalled: {
            content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
            break;
        }
        case Web3State.Loading: {
            content = <LoadingWrapper minHeight="120px" />;
            break;
        }
        default: {
            if (web3State !== Web3State.Error && (!baseToken || !wethTokenBalance)) {
                content = <LoadingWrapper minHeight="120px" />;
            } else if (!ordersToShow.length || !baseToken || !wethTokenBalance) {
                content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
            } else {
                const quoteToken = wethTokenBalance.token;
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
                        <tbody>
                            {ordersToShow.map((order, index) => orderToRow(order, index, baseToken, quoteToken))}
                        </tbody>
                    </Table>
                );
            }
            break;
        }
    }

    return <OrderHistoryCard title="My Opened IEO Orders">{content}</OrderHistoryCard>;
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseTokenIEO(state),
        orders: getUserIEOUIOrders(state) as UIOrder[],
        wethTokenBalance: getWethTokenBalance(state),
        web3State: getWeb3State(state),
    };
};

const IEOOrderHistoryContainer = connect(mapStateToProps)(IEOOrderHistory);

export { IEOOrderHistory, IEOOrderHistoryContainer };
