import { OrderStatus } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getBaseToken, getQuoteToken, getThemeColors, getUserOrders, getWeb3State } from '../../store/selectors';
import { BasicTheme } from '../../themes/BasicTheme';
import { tokenAmountInUnits } from '../../util/tokens';
import { OrderSide, StoreState, StyledComponentThemeProps, TabItem, Token, UIOrder, Web3State } from '../../util/types';
import { CardContainer } from '../common/card';
import { CardTabSelectorContainer } from '../common/card_tab_selector';
import { EmptyContentContainer } from '../common/empty_content';
import { CardLoading } from '../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../common/table';

import { CancelOrderButtonContainer } from './cancel_order_button';

interface StateProps {
    baseToken: Token | null;
    orders: UIOrder[];
    quoteToken: Token | null;
    themeColorsConfig: BasicTheme;
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

interface SideTDProps extends StyledComponentThemeProps {
    side: OrderSide;
}

const SideTD = styled(CustomTD)<SideTDProps>`
    color: ${props => (props.side === OrderSide.Buy ? props.themeColors.green : props.themeColors.orange)};
`;

const orderToRow = (order: UIOrder, index: number, baseToken: Token, themeColors: BasicTheme) => {
    const sideLabel = order.side === OrderSide.Sell ? 'Sell' : 'Buy';
    const size = tokenAmountInUnits(order.size, baseToken.decimals);
    let filled = null;
    let status = '--';
    let isOrderFillable = false;

    order.filled ? (filled = tokenAmountInUnits(order.filled, baseToken.decimals)) : (filled = null);
    if (order.status) {
        isOrderFillable = order.status === OrderStatus.Fillable;
        status = isOrderFillable ? 'Open' : 'Filled';
    }
    const price = order.price.toString();

    return (
        <TR key={index}>
            <SideTD themeColors={themeColors} side={order.side}>
                {sideLabel}
            </SideTD>
            <CustomTD themeColors={themeColors} styles={{ textAlign: 'right', tabular: true }}>
                {size}
            </CustomTD>
            <CustomTD themeColors={themeColors} styles={{ textAlign: 'right', tabular: true }}>
                {filled}
            </CustomTD>
            <CustomTD themeColors={themeColors} styles={{ textAlign: 'right', tabular: true }}>
                {price}
            </CustomTD>
            <CustomTD themeColors={themeColors}>{status}</CustomTD>
            <CustomTD themeColors={themeColors} styles={{ textAlign: 'center' }}>
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
        const { orders, baseToken, quoteToken, themeColorsConfig, web3State } = this.props;
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
            case Web3State.Locked:
            case Web3State.NotInstalled:
            case Web3State.Loading: {
                content = <EmptyContentContainer alignAbsoluteCenter={true} text="There are no orders to show" />;
                break;
            }
            default: {
                if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
                    content = <CardLoading minHeight="120px" />;
                } else if (!ordersToShow.length || !baseToken || !quoteToken) {
                    content = <EmptyContentContainer alignAbsoluteCenter={true} text="There are no orders to show" />;
                } else {
                    content = (
                        <Table themeColors={themeColorsConfig} isResponsive={true}>
                            <THead>
                                <TR>
                                    <TH themeColors={themeColorsConfig}>Side</TH>
                                    <TH themeColors={themeColorsConfig} styles={{ textAlign: 'right' }}>
                                        Size ({baseToken.symbol})
                                    </TH>
                                    <TH themeColors={themeColorsConfig} styles={{ textAlign: 'right' }}>
                                        Filled ({baseToken.symbol})
                                    </TH>
                                    <TH themeColors={themeColorsConfig} styles={{ textAlign: 'right' }}>
                                        Price ({quoteToken.symbol})
                                    </TH>
                                    <TH themeColors={themeColorsConfig}>Status</TH>
                                    <TH themeColors={themeColorsConfig}>&nbsp;</TH>
                                </TR>
                            </THead>
                            <tbody>
                                {ordersToShow.map((order, index) =>
                                    orderToRow(order, index, baseToken, themeColorsConfig),
                                )}
                            </tbody>
                        </Table>
                    );
                }
                break;
            }
        }

        return (
            <CardContainer title="Orders" action={<CardTabSelectorContainer tabs={cardTabs} />}>
                {content}
            </CardContainer>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseToken(state),
        orders: getUserOrders(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
        themeColorsConfig: getThemeColors(state),
    };
};

const OrderHistoryContainer = connect(mapStateToProps)(OrderHistory);

export { OrderHistory, OrderHistoryContainer };
