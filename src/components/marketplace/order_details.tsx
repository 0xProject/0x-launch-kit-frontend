import { BigNumber } from '0x.js';
import { SignedOrder } from '@0x/connect';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { MAKER_FEE, ZRX_TOKEN_SYMBOL } from '../../common/constants';
import { getAllOrdersToFillMarketOrderAndAmountsToPay } from '../../services/orders';
import { getOpenBuyOrders, getOpenSellOrders } from '../../store/selectors';
import { getEthereumPriceInUSD, getZeroXPriceInUSD, getZeroXPriceInWeth } from '../../util/market_prices';
import { themeColors, themeDimensions } from '../../util/theme';
import { tokenAmountInUnitsToBigNumber } from '../../util/tokens';
import { OrderSide, OrderType, StoreState, Token, UIOrder } from '../../util/types';
import { CardTabSelector } from '../common/card_tab_selector';

interface State {
    orderDetailType: OrderDetailsType;
    feeInUSD: BigNumber;
    feeInZrx: BigNumber;
    totalCostInWeth: BigNumber;
    totalCostInUSD: BigNumber;
    canOrderBeFilled?: boolean;
}

interface PropsInterface {
    orderType: OrderType;
    tokenAmount: BigNumber;
    tokenPrice: BigNumber;
    selectedToken: Token | null;
    operationType: OrderSide;
}

interface StateProps {
    openSellOrders: UIOrder[];
    openBuyOrders: UIOrder[];
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
    public state = {
        orderDetailType: OrderDetailsType.Eth,
        feeInUSD: new BigNumber(0),
        feeInZrx: new BigNumber(0),
        totalCostInWeth: new BigNumber(0),
        totalCostInUSD: new BigNumber(0),
        canOrderBeFilled: true,
    };

    public updateLimitOrderState = (zeroXPriceInWeth: BigNumber, zeroXPriceInUSD: BigNumber, ethInUSD: BigNumber) => {
        const { tokenAmount, tokenPrice } = this.props;
        const feeInZrx = MAKER_FEE;
        const totalPriceWithoutFeeInWeth = tokenAmount.mul(tokenPrice);

        // Calculates total cost in wETH
        const totalCostInWeth = totalPriceWithoutFeeInWeth.add(feeInZrx.mul(zeroXPriceInWeth));

        // Calculates total cost in USD
        const feeInUSD = feeInZrx.mul(zeroXPriceInUSD);
        const totalPriceWithoutFeeInUSD = totalPriceWithoutFeeInWeth.mul(ethInUSD);
        const totalCostInUSD = totalPriceWithoutFeeInUSD.add(feeInUSD);

        this._formatTotalCostAndFeeValuesInState(feeInZrx, feeInUSD, totalCostInWeth, totalCostInUSD);
    };

    public updateMarketOrderState = (zeroXPriceInWeth: BigNumber, zeroXPriceInUSD: BigNumber, ethInUSD: BigNumber) => {
        const { tokenAmount, operationType, openSellOrders, openBuyOrders } = this.props;

        // Gets all the orders needed to fill the order
        const uiOrders = operationType === OrderSide.Sell ? openBuyOrders : openSellOrders;
        const [ordersToFill, amountToPayForEachOrder, canOrderBeFilled] = getAllOrdersToFillMarketOrderAndAmountsToPay(
            tokenAmount,
            operationType,
            uiOrders,
        );

        // Takes the sum of all the orders fee
        const feeInZrx = ordersToFill.reduce((totalFeeSum: BigNumber, currentOrder: SignedOrder) => {
            return totalFeeSum.add(currentOrder.takerFee);
        }, new BigNumber(0));

        // Takes the sum of all the orders price
        const totalPriceWithoutFeeInWeth = amountToPayForEachOrder.reduce(
            (totalPriceSum: BigNumber, currentPrice: BigNumber) => {
                return totalPriceSum.add(currentPrice);
            },
            new BigNumber(0),
        );

        // Calculates total cost in wETH
        const totalCostInWeth = totalPriceWithoutFeeInWeth.add(feeInZrx.mul(zeroXPriceInWeth));

        // Calculates total cost in USD
        const feeInUSD = feeInZrx.mul(zeroXPriceInUSD);
        const totalPriceWithoutFeeInUSD = totalPriceWithoutFeeInWeth.mul(ethInUSD);
        const totalCostInUSD = totalPriceWithoutFeeInUSD.add(feeInUSD);

        this._formatTotalCostAndFeeValuesInState(feeInZrx, feeInUSD, totalCostInWeth, totalCostInUSD, canOrderBeFilled);
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>) => {
        const newProps = this.props;
        if (
            newProps.tokenPrice !== prevProps.tokenPrice ||
            newProps.orderType !== prevProps.orderType ||
            newProps.tokenAmount !== prevProps.tokenAmount ||
            newProps.selectedToken !== prevProps.selectedToken ||
            newProps.operationType !== prevProps.operationType
        ) {
            await this._updateOrderDetailsState();
        }
    };

    public componentDidMount = async () => {
        await this._updateOrderDetailsState();
    };

    public render = () => {
        const { orderDetailType } = this.state;
        const ethUsdTabs = [
            {
                active: orderDetailType === OrderDetailsType.Eth,
                onClick: this._switchToEth,
                text: ZRX_TOKEN_SYMBOL.toUpperCase(),
            },
            {
                active: orderDetailType === OrderDetailsType.Usd,
                onClick: this._switchToUsd,
                text: 'USD',
            },
        ];

        const { orderType } = this.props;
        const { feeInUSD, feeInZrx, totalCostInWeth, totalCostInUSD, canOrderBeFilled } = this.state;
        const fee = orderDetailType === OrderDetailsType.Usd ? `$ ${feeInUSD.toFixed(2)}` : `${feeInZrx} ZRX`;
        const totalCost =
            orderType === OrderType.Market && !canOrderBeFilled
                ? `---`
                : `(${totalCostInWeth.toFixed(2)} wETH) $${totalCostInUSD.toFixed(2)}`;

        return (
            <>
                <LabelContainer>
                    <Label>Order Details</Label>
                    <InnerTabs tabs={ethUsdTabs} />
                </LabelContainer>
                <Row>
                    <Label color={themeColors.textLight}>Fee</Label>
                    <Value>{fee}</Value>
                </Row>
                <Row>
                    <Label color={themeColors.textLight}>Total Cost</Label>
                    <Value>{totalCost}</Value>
                </Row>
            </>
        );
    };

    private readonly _updateOrderDetailsState = async () => {
        const { selectedToken, orderType } = this.props;
        if (!selectedToken) {
            return;
        }

        const promisesArray = [getZeroXPriceInWeth(), getZeroXPriceInUSD(), getEthereumPriceInUSD()];
        const results = await Promise.all(promisesArray);
        const [zeroXPriceInWeth, zeroXPriceInUSD, ethInUSD] = results;

        if (orderType === OrderType.Limit) {
            this.updateLimitOrderState(zeroXPriceInWeth, zeroXPriceInUSD, ethInUSD);
        } else {
            this.updateMarketOrderState(zeroXPriceInWeth, zeroXPriceInUSD, ethInUSD);
        }
    };

    private readonly _formatTotalCostAndFeeValuesInState = (
        feeInZrx: BigNumber,
        feeInUSD: BigNumber,
        totalCostInWeth: BigNumber,
        totalCostInUSD: BigNumber,
        canOrderBeFilled?: boolean,
    ) => {
        const selectedToken = this.props.selectedToken as Token;
        this.setState({
            feeInZrx: tokenAmountInUnitsToBigNumber(feeInZrx, selectedToken.decimals),
            feeInUSD: tokenAmountInUnitsToBigNumber(feeInUSD, selectedToken.decimals),
            totalCostInWeth: tokenAmountInUnitsToBigNumber(totalCostInWeth, selectedToken.decimals),
            totalCostInUSD: tokenAmountInUnitsToBigNumber(totalCostInUSD, selectedToken.decimals),
            canOrderBeFilled,
        });
    };

    private readonly _switchToUsd = () => {
        this.setState({ orderDetailType: OrderDetailsType.Usd });
    };

    private readonly _switchToEth = () => {
        this.setState({ orderDetailType: OrderDetailsType.Eth });
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        openSellOrders: getOpenSellOrders(state),
        openBuyOrders: getOpenBuyOrders(state),
    };
};

const OrderDetailsContainer = connect(mapStateToProps)(OrderDetails);

export { OrderDetails, OrderDetailsContainer };
