import { OrderStatus } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getSelectedToken, getUserOrders, getWeb3State } from '../../store/selectors';
import { errorsWallet } from '../../util/error_messages';
import { themeColors } from '../../util/theme';
import { tokenAmountInUnits } from '../../util/tokens';
import { OrderSide, StoreState, TabItem, Token, UIOrder, Web3State } from '../../util/types';
import { Card } from '../common/card';
import { CardTabSelector } from '../common/card_tab_selector';
import { EmptyContent } from '../common/empty_content';
import { ErrorCard, ErrorIcons, FontSize } from '../common/error_card';
import { CardLoading } from '../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../common/table';

import { CancelOrderButtonContainer } from './cancel_order_button';

interface StateProps {
    orders: UIOrder[];
    selectedToken: Token | null;
    web3State?: Web3State;
}

enum Tab {
    Filled,
    Open,
}

interface State {
    tab: Tab;
}

type Props = StateProps;

const SideTD = styled(CustomTD)<{ side: OrderSide }>`
    color: ${props => (props.side === OrderSide.Buy ? themeColors.green : themeColors.orange)};
`;

const orderToRow = (order: UIOrder, index: number, selectedToken: Token) => {
    const sideLabel = order.side === OrderSide.Sell ? 'Sell' : 'Buy';
    const size = tokenAmountInUnits(order.size, selectedToken.decimals);
    let filled = null;
    let status = '--';
    let isOrderFillable = false;

    order.filled ? (filled = tokenAmountInUnits(order.filled, selectedToken.decimals)) : (filled = null);
    if (order.status) {
        isOrderFillable = order.status === OrderStatus.Fillable;
        status = isOrderFillable ? 'Open' : 'Filled';
    }
    const price = order.price.toString();

    return (
        <TR key={index}>
            <SideTD side={order.side}>{sideLabel}</SideTD>
            <CustomTD styles={{ textAlign: 'right' }}>{size}</CustomTD>
            <CustomTD styles={{ textAlign: 'right' }}>{filled}</CustomTD>
            <CustomTD styles={{ textAlign: 'right' }}>{price}</CustomTD>
            <CustomTD>{status}</CustomTD>
            <CustomTD styles={{ textAlign: 'center' }}>
                {isOrderFillable ? <CancelOrderButtonContainer order={order} /> : ''}
            </CustomTD>
        </TR>
    );
};

class OrderHistory extends React.Component<Props, State> {
    public state = {
        tab: Tab.Open,
    };

    public render = () => {
        const { orders, selectedToken, web3State } = this.props;
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
        switch (web3State) {
            case Web3State.Locked: {
                content = <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmLocked} icon={ErrorIcons.Lock} />;
                break;
            }
            case Web3State.NotInstalled: {
                content = (
                    <ErrorCard
                        fontSize={FontSize.Large}
                        text={errorsWallet.mmNotInstalled}
                        icon={ErrorIcons.Metamask}
                    />
                );
                break;
            }
            default: {
                if (!selectedToken) {
                    content = <CardLoading />;
                } else if (!ordersToShow.length) {
                    content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
                } else {
                    content = (
                        <Table isResponsive={true}>
                            <THead>
                                <TR>
                                    <TH>Side</TH>
                                    <TH styles={{ textAlign: 'center' }}>Size ({selectedToken.symbol})</TH>
                                    <TH styles={{ textAlign: 'center' }}>Filled ({selectedToken.symbol})</TH>
                                    <TH styles={{ textAlign: 'center' }}>Price (WETH)</TH>
                                    <TH>Status</TH>
                                    <TH>&nbsp;</TH>
                                </TR>
                            </THead>
                            <tbody>{ordersToShow.map((order, index) => orderToRow(order, index, selectedToken))}</tbody>
                        </Table>
                    );
                }
                break;
            }
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
        web3State: getWeb3State(state),
    };
};

const OrderHistoryContainer = connect(mapStateToProps)(OrderHistory);

export { OrderHistory, OrderHistoryContainer };
