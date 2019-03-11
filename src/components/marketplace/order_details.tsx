import { BigNumber } from '0x.js';
import { SignedOrder } from '@0x/connect';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { MAKER_FEE } from '../../common/constants';
import { getAllOrdersToFillMarketOrder } from '../../services/orders';
import { getEthereumPriceInUSD, getZeroXPriceInUSD, getZeroXPriceInWeth } from '../../util/market_prices';
import { themeColors, themeDimensions } from '../../util/theme';
import { tokenAmountInUnitsToBigNumber } from '../../util/tokens';
import { OrderSide, StoreState, Token } from '../../util/types';
import { CardTabSelector } from '../common/card_tab_selector';

enum OrderType {
    Limit,
    Market,
}

interface State {
    limitOrder: {
        orderDetailType: OrderDetailsType;
        zeroXFeeInUSD: BigNumber;
        zeroXFeeInWeth: BigNumber;
        zeroXFeeInZrx: BigNumber;
        totalCostInWeth: BigNumber;
        totalCostInUSD: BigNumber;
    };
    marketOrder: {
        orderDetailType: OrderDetailsType;
        zeroXFeeInUSD: BigNumber;
        zeroXFeeInZrx: BigNumber;
        zeroXFeeInWeth: BigNumber;
        totalCostInWeth: BigNumber;
        totalCostInUSD: BigNumber;
    };
}

interface PropsInterface {
    orderType: OrderType;
    tokenAmount: BigNumber;
    tokenPrice: BigNumber;
    selectedToken: Token | null;
    operationType: OrderSide;
}

interface StateProps {
    state: StoreState | null;
}

type Props = StateProps & PropsInterface;

const Row = styled.div`
    align-items: center;
    border-bottom: solid 1px ${themeColors.borderColor};
    display: flex;
    justify-content: space-between;
    padding: 15px ${themeDimensions.horizontalPadding};
    position: relative;
    z-index: 1;

    &:first-child {
        padding-top: 5px;
    }

    &:last-child {
        border-bottom: none;
        padding-bottom: 5px;
    }
`;

const Value = styled.div`
    color: #000;
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    white-space: nowrap;
`;

const LabelContainer = styled.div`
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || '#000'};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;

const InnerTabs = styled(CardTabSelector)`
    font-size: 14px;
`;

enum OrderDetailsType {
    Eth,
    Usd,
}

class OrderDetails extends React.Component<Props, State> {
    // TODO: Refactor with hooks (needs react version update)

    public state = {
        limitOrder: {
            orderDetailType: OrderDetailsType.Eth,
            zeroXFeeInUSD: new BigNumber(0),
            zeroXFeeInWeth: new BigNumber(0),
            zeroXFeeInZrx: new BigNumber(MAKER_FEE),
            totalCostInWeth: new BigNumber(0),
            totalCostInUSD: new BigNumber(0),
        },
        marketOrder: {
            orderDetailType: OrderDetailsType.Eth,
            zeroXFeeInUSD: new BigNumber(0),
            zeroXFeeInWeth: new BigNumber(0),
            zeroXFeeInZrx: new BigNumber(0),
            totalCostInWeth: new BigNumber(0),
            totalCostInUSD: new BigNumber(0),
        },
    };

    public updateLimitOrderState = async () => {
        const { tokenAmount, tokenPrice, selectedToken } = this.props;
        if (selectedToken) {
            /* Reduces decimals of the token amount */
            const tokenAmountConverted = tokenAmountInUnitsToBigNumber(tokenAmount, selectedToken.decimals);
            /* This could be refactored with promise all  */
            const promisesArray = [getZeroXPriceInWeth(), getZeroXPriceInUSD(), getEthereumPriceInUSD()];
            try {
                const results = await Promise.all(promisesArray);
                const [zeroXPriceInWeth, zeroXPriceInUSD, ethInUSD] = results;
                /* Calculates total cost in wETH */
                const zeroXFeeInWeth = zeroXPriceInWeth.mul(MAKER_FEE);
                const totalPriceWithoutFeeInWeth = tokenAmountConverted.mul(tokenPrice);
                const totalCostInWeth = totalPriceWithoutFeeInWeth.add(zeroXFeeInWeth);
                const zeroXFeeInZrx = new BigNumber(MAKER_FEE);

                /* Calculates total cost in USD */
                const zeroXFeeInUSD = zeroXPriceInUSD.mul(MAKER_FEE);
                const totalPriceWithoutFeeInUSD = totalPriceWithoutFeeInWeth.mul(ethInUSD);
                const totalCostInUSD = totalPriceWithoutFeeInUSD.add(zeroXFeeInUSD);

                this.setState({
                    limitOrder: {
                        ...this.state.limitOrder,
                        zeroXFeeInWeth,
                        zeroXFeeInZrx,
                        zeroXFeeInUSD,
                        totalCostInWeth,
                        totalCostInUSD,
                    },
                });
            } catch (error) {
                throw error;
            }
        }
    };

    public updateMarketOrderState = async () => {
        const { tokenAmount, selectedToken, operationType, state } = this.props;
        if (selectedToken) {
            /* Reduces decimals of the token amount */
            // const tokenAmountConverted = tokenAmountInUnitsToBigNumber(tokenAmount, selectedToken.decimals);

            const promisesArray = [getZeroXPriceInWeth(), getZeroXPriceInUSD(), getEthereumPriceInUSD()];
            try {
                const results = await Promise.all(promisesArray);
                const [zeroXPriceInWeth, zeroXPriceInUSD] = results;
                let ordersToFill: SignedOrder[];
                let totalFee = new BigNumber(0);
                /* Gets all the orders needed to fill the order **/
                if (state) {
                    /* TODO - Check if there are orders with a makerFee > 0 */
                    ordersToFill = getAllOrdersToFillMarketOrder(tokenAmount, operationType, state);
                    totalFee = ordersToFill.reduce((totalFeeSum: BigNumber, currentOrder: SignedOrder) => {
                        return totalFeeSum.add(currentOrder.makerFee);
                    }, new BigNumber(0));
                }

                /* TODO - Calculates total cost in wETH */
                const zeroXFeeInZrx = totalFee;
                const zeroXFeeInWeth = zeroXFeeInZrx.mul(zeroXPriceInWeth);
                const totalCostInWeth = new BigNumber(0);

                /* TODO - Calculates total cost in USD */
                const zeroXFeeInUSD = zeroXFeeInWeth.mul(zeroXPriceInUSD);
                const totalCostInUSD = new BigNumber(0);

                this.setState({
                    marketOrder: {
                        ...this.state.marketOrder,
                        zeroXFeeInWeth,
                        zeroXFeeInZrx,
                        zeroXFeeInUSD,
                        totalCostInWeth,
                        totalCostInUSD,
                    },
                });
            } catch (error) {
                throw error;
            }
        }
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) => {
        const newProps = this.props;
        if (
            newProps.tokenPrice !== prevProps.tokenPrice ||
            newProps.orderType !== prevProps.orderType ||
            newProps.tokenAmount !== prevProps.tokenAmount ||
            newProps.selectedToken !== prevProps.selectedToken ||
            newProps.operationType !== prevProps.operationType
        ) {
            if (newProps.orderType === OrderType.Limit) {
                await this.updateLimitOrderState();
            }
            if (newProps.orderType === OrderType.Market) {
                await this.updateMarketOrderState();
            }
        }
    };

    public componentDidMount = async () => {
        const { orderType } = this.props;
        if (orderType === OrderType.Limit) {
            await this.updateLimitOrderState();
        }
        if (orderType === OrderType.Market) {
            await this.updateMarketOrderState();
        }
    };

    public render = () => {
        const { orderType } = this.props;
        let render = null;
        if (orderType === OrderType.Limit) {
            const {
                orderDetailType,
                zeroXFeeInUSD,
                zeroXFeeInZrx,
                totalCostInWeth,
                totalCostInUSD,
            } = this.state.limitOrder;
            render = this._renderOrderDetails(
                orderDetailType,
                zeroXFeeInUSD,
                zeroXFeeInZrx,
                totalCostInWeth,
                totalCostInUSD,
            );
        }
        if (orderType === OrderType.Market) {
            const {
                orderDetailType,
                zeroXFeeInUSD,
                zeroXFeeInZrx,
                totalCostInWeth,
                totalCostInUSD,
            } = this.state.marketOrder;
            render = this._renderOrderDetails(
                orderDetailType,
                zeroXFeeInUSD,
                zeroXFeeInZrx,
                totalCostInWeth,
                totalCostInUSD,
            );
        }
        return render;
    };

    private readonly _renderOrderDetails = (
        orderDetailType: OrderDetailsType,
        zeroXFeeInUSD: BigNumber,
        zeroXFeeInZrx: BigNumber,
        totalCostInWeth: BigNumber,
        totalCostInUSD: BigNumber,
    ) => {
        const ethUsdTabs = [
            {
                active: orderDetailType === OrderDetailsType.Eth,
                onClick: this._switchToEth,
                text: 'ZRX',
            },
            {
                active: orderDetailType === OrderDetailsType.Usd,
                onClick: this._switchToUsd,
                text: 'USD',
            },
        ];
        return (
            <>
                <LabelContainer>
                    <Label>Order Details</Label>
                    <InnerTabs tabs={ethUsdTabs} />
                </LabelContainer>
                <Row>
                    <Label color={themeColors.textLight}>Fee</Label>
                    <Value />
                    <Value>
                        {orderDetailType === OrderDetailsType.Usd
                            ? `$ ${zeroXFeeInUSD.toFixed(2)}`
                            : `${zeroXFeeInZrx} ZRX`}
                    </Value>
                </Row>
                <LabelContainer>
                    <Label>Total Cost</Label>
                    <Value>
                        ({totalCostInWeth.toFixed(2)} wETH) {`$ ${totalCostInUSD.toFixed(2)}`}
                    </Value>
                </LabelContainer>
            </>
        );
    };

    private readonly _switchToUsd = () => {
        const { orderType } = this.props;
        if (orderType === OrderType.Market) {
            this.setState({
                marketOrder: {
                    ...this.state.marketOrder,
                    orderDetailType: OrderDetailsType.Usd,
                },
            });
        }
        if (orderType === OrderType.Limit) {
            this.setState({
                limitOrder: {
                    ...this.state.limitOrder,
                    orderDetailType: OrderDetailsType.Usd,
                },
            });
        }
    };

    private readonly _switchToEth = () => {
        const { orderType } = this.props;
        if (orderType === OrderType.Market) {
            this.setState({
                marketOrder: {
                    ...this.state.marketOrder,
                    orderDetailType: OrderDetailsType.Eth,
                },
            });
        }
        if (orderType === OrderType.Limit) {
            this.setState({
                limitOrder: {
                    ...this.state.limitOrder,
                    orderDetailType: OrderDetailsType.Eth,
                },
            });
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        state,
    };
};

const OrderDetailsContainer = connect(mapStateToProps)(OrderDetails);

export { OrderDetails, OrderDetailsContainer };
