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
    zeroXFeeInUSD: BigNumber;
    zeroXFeeInZrx: BigNumber;
    zeroXFeeInWeth: BigNumber;
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
    // TODO: Refactor with hooks (needs react version update)
    public state = {
        orderDetailType: OrderDetailsType.Eth,
        zeroXFeeInUSD: new BigNumber(0),
        zeroXFeeInWeth: new BigNumber(0),
        zeroXFeeInZrx: new BigNumber(0),
        totalCostInWeth: new BigNumber(0),
        totalCostInUSD: new BigNumber(0),
        canOrderBeFilled: true,
    };

    public updateLimitOrderState = (zeroXPriceInWeth: BigNumber, zeroXPriceInUSD: BigNumber, ethInUSD: BigNumber) => {
        const { tokenAmount, tokenPrice } = this.props;
        // Calculates total cost in wETH
        const totalPriceWithoutFeeInWeth = tokenAmount.mul(tokenPrice);
        const zeroXFeeInZrx = MAKER_FEE;
        const zeroXFeeInWeth = zeroXPriceInWeth.mul(MAKER_FEE);
        const totalCostInWeth = totalPriceWithoutFeeInWeth.add(zeroXFeeInWeth);

        // Calculates total cost in USD
        const zeroXFeeInUSD = zeroXPriceInUSD.mul(MAKER_FEE);
        const totalPriceWithoutFeeInUSD = totalPriceWithoutFeeInWeth.mul(ethInUSD);
        const totalCostInUSD = totalPriceWithoutFeeInUSD.add(zeroXFeeInUSD);

        this._formatTotalCostAndFeeValuesInState(
            zeroXFeeInWeth,
            zeroXFeeInZrx,
            zeroXFeeInUSD,
            totalCostInWeth,
            totalCostInUSD,
        );
    };

    public updateMarketOrderState = (zeroXPriceInWeth: BigNumber, zeroXPriceInUSD: BigNumber, ethInUSD: BigNumber) => {
        const { tokenAmount, operationType, openSellOrders, openBuyOrders } = this.props;

        let ordersToFill: SignedOrder[];
        let canOrderBeFilled: boolean;
        let totalFee;
        let amountToPayForEachOrder: BigNumber[];
        let totalPriceWithoutFeeInWeth;
        let uiOrders: UIOrder[];
        operationType === OrderSide.Sell ? (uiOrders = openBuyOrders) : (uiOrders = openSellOrders);
        // Gets all the orders needed to fill the order
        [ordersToFill, amountToPayForEachOrder, canOrderBeFilled] = getAllOrdersToFillMarketOrderAndAmountsToPay(
            tokenAmount,
            operationType,
            uiOrders,
        );

        // Takes the sum of all the orders fee
        totalFee = ordersToFill.reduce((totalFeeSum: BigNumber, currentOrder: SignedOrder) => {
            return totalFeeSum.add(currentOrder.takerFee);
        }, new BigNumber(0));

        // Takes the sum of all the orders price
        totalPriceWithoutFeeInWeth = amountToPayForEachOrder.reduce(
            (totalPriceSum: BigNumber, currentPrice: BigNumber) => {
                return totalPriceSum.add(currentPrice);
            },
            new BigNumber(0),
        );

        // Calculates total cost in wETH
        const zeroXFeeInZrx = totalFee;
        const zeroXFeeInWeth = zeroXFeeInZrx.mul(zeroXPriceInWeth);
        const totalCostInWeth = totalPriceWithoutFeeInWeth.add(zeroXFeeInWeth);

        // Calculates total cost in USD
        const zeroXFeeInUSD = zeroXFeeInZrx.mul(zeroXPriceInUSD);
        const totalPriceWithoutFeeInUSD = totalPriceWithoutFeeInWeth.mul(ethInUSD);
        const totalCostInUSD = totalPriceWithoutFeeInUSD.add(zeroXFeeInUSD);

        this._formatTotalCostAndFeeValuesInState(
            zeroXFeeInWeth,
            zeroXFeeInZrx,
            zeroXFeeInUSD,
            totalCostInWeth,
            totalCostInUSD,
            canOrderBeFilled,
        );
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
        const { orderType } = this.props;
        const { orderDetailType, zeroXFeeInUSD, zeroXFeeInZrx, totalCostInWeth, totalCostInUSD } = this.state;
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

        let totalCostMarket;
        if (orderType === OrderType.Market) {
            totalCostMarket = this.state.canOrderBeFilled ? (
                <Value>
                    ({totalCostInWeth.toFixed(2)} wETH) {`$ ${totalCostInUSD.toFixed(2)}`}
                </Value>
            ) : (
                <Value>---</Value>
            );
        }

        const totalCostLimit = (
            <Value>
                ({totalCostInWeth.toFixed(2)} wETH) {`$ ${totalCostInUSD.toFixed(2)}`}
            </Value>
        );

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
                    <Value>{orderType === OrderType.Market ? totalCostMarket : totalCostLimit}</Value>
                </LabelContainer>
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
        zeroXFeeInWeth: BigNumber,
        zeroXFeeInZrx: BigNumber,
        zeroXFeeInUSD: BigNumber,
        totalCostInWeth: BigNumber,
        totalCostInUSD: BigNumber,
        canOrderBeFilled?: boolean,
    ) => {
        const selectedToken = this.props.selectedToken as Token;
        this.setState({
            zeroXFeeInWeth: tokenAmountInUnitsToBigNumber(zeroXFeeInWeth, selectedToken.decimals),
            zeroXFeeInZrx: tokenAmountInUnitsToBigNumber(zeroXFeeInZrx, selectedToken.decimals),
            zeroXFeeInUSD: tokenAmountInUnitsToBigNumber(zeroXFeeInUSD, selectedToken.decimals),
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
