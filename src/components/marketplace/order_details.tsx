import { BigNumber } from '0x.js';
import { SignedOrder } from '@0x/connect';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { MAKER_FEE, ZRX_TOKEN_SYMBOL } from '../../common/constants';
import { getAllOrdersToFillMarketOrderAndAmountsToPay } from '../../services/orders';
import { getOpenBuyOrders, getOpenSellOrders } from '../../store/selectors';
import { getKnownTokens } from '../../util/known_tokens';
import { getEthereumPriceInUSD, getZeroXPriceInUSD, getZeroXPriceInWeth } from '../../util/market_prices';
import { themeColors, themeDimensions } from '../../util/theme';
import { tokenAmountInUnits } from '../../util/tokens';
import { OrderSide, OrderType, StoreState, Token, UIOrder } from '../../util/types';
import { CardTabSelector } from '../common/card_tab_selector';

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

interface OwnProps {
    orderType: OrderType;
    tokenAmount: BigNumber;
    tokenPrice: BigNumber;
    baseToken: Token | null;
    operationType: OrderSide;
}

interface StateProps {
    openSellOrders: UIOrder[];
    openBuyOrders: UIOrder[];
}

type Props = StateProps & OwnProps;

interface State {
    orderDetailType: OrderDetailsType;
    feeInZrx: BigNumber;
    totalPriceWithoutFeeInWeth: BigNumber;
    canOrderBeFilled?: boolean;
    // @TODO: this should live in the store and bound via props
    prices: {
        zrxInWeth: BigNumber;
        zrxInUsd: BigNumber;
        ethInUsd: BigNumber;
    };
}

class OrderDetails extends React.Component<Props, State> {
    public state = {
        orderDetailType: OrderDetailsType.Eth,
        feeInZrx: new BigNumber(0),
        totalPriceWithoutFeeInWeth: new BigNumber(0),
        canOrderBeFilled: true,
        prices: {
            zrxInWeth: new BigNumber(0),
            zrxInUsd: new BigNumber(0),
            ethInUsd: new BigNumber(0),
        },
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>) => {
        const newProps = this.props;
        if (
            newProps.tokenPrice !== prevProps.tokenPrice ||
            newProps.orderType !== prevProps.orderType ||
            newProps.tokenAmount !== prevProps.tokenAmount ||
            newProps.baseToken !== prevProps.baseToken ||
            newProps.operationType !== prevProps.operationType
        ) {
            await this._updateOrderDetailsState();
        }
    };

    public componentDidMount = async () => {
        await this._setPricesInState();
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
        const fee = this._getFeeStringForRender();
        const totalCost = this._getTotalCostStringForRender();
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

    private readonly _setPricesInState = async () => {
        const [zrxInWeth, zrxInUsd, ethInUsd] = await Promise.all([
            getZeroXPriceInWeth(),
            getZeroXPriceInUSD(),
            getEthereumPriceInUSD(),
        ]);
        this.setState({
            ...this.state,
            prices: { zrxInWeth, zrxInUsd, ethInUsd },
        });
    };

    private readonly _updateOrderDetailsState = async () => {
        const { baseToken } = this.props;
        if (!baseToken) {
            return;
        }
        // Get order details' numbers needed to calculate total cost and total fee
        const { feeInZrx, totalPriceWithoutFeeInWeth, canOrderBeFilled } = this._calculateFeeAndTotalCostInWeth();
        this.setState({ feeInZrx, totalPriceWithoutFeeInWeth, canOrderBeFilled });
    };

    private readonly _calculateFeeAndTotalCostInWeth = (): {
        feeInZrx: BigNumber;
        totalPriceWithoutFeeInWeth: BigNumber;
        canOrderBeFilled?: boolean;
    } => {
        const { orderType } = this.props;
        if (orderType === OrderType.Limit) {
            const { tokenAmount, tokenPrice } = this.props;
            const feeInZrx = MAKER_FEE;
            const totalPriceWithoutFeeInWeth = tokenAmount.mul(tokenPrice);
            return {
                feeInZrx,
                totalPriceWithoutFeeInWeth,
            };
        } else {
            const { tokenAmount, operationType, openSellOrders, openBuyOrders } = this.props;
            // Gets the fillable orders and sum their fee and amounts
            const uiOrders = operationType === OrderSide.Sell ? openBuyOrders : openSellOrders;
            const [
                ordersToFill,
                amountToPayForEachOrder,
                canOrderBeFilled,
            ] = getAllOrdersToFillMarketOrderAndAmountsToPay(tokenAmount, operationType, uiOrders);
            const feeInZrx = ordersToFill.reduce(
                (totalFeeSum: BigNumber, currentOrder: SignedOrder) => totalFeeSum.add(currentOrder.takerFee),
                new BigNumber(0),
            );
            const totalPriceWithoutFeeInWeth = amountToPayForEachOrder.reduce(
                (totalPriceSum: BigNumber, currentPrice: BigNumber) => totalPriceSum.add(currentPrice),
                new BigNumber(0),
            );
            return {
                feeInZrx,
                totalPriceWithoutFeeInWeth,
                canOrderBeFilled,
            };
        }
    };

    private readonly _getFeeStringForRender = () => {
        const { orderDetailType, feeInZrx } = this.state;
        const { zrxInUsd } = this.state.prices;

        if (orderDetailType === OrderDetailsType.Usd) {
            const feeInUSD = feeInZrx.mul(zrxInUsd);
            const wethTokenDecimals = getKnownTokens().getWethToken().decimals;
            const feeFormatted = tokenAmountInUnits(feeInUSD, wethTokenDecimals);
            return `$ ${feeFormatted}`;
        } else {
            const zrxTokenDecimals = getKnownTokens().getTokenBySymbol(ZRX_TOKEN_SYMBOL).decimals;
            const feeFormatted = tokenAmountInUnits(feeInZrx, zrxTokenDecimals);
            return `${feeFormatted} ${ZRX_TOKEN_SYMBOL.toUpperCase()}`;
        }
    };

    private readonly _getTotalCostStringForRender = () => {
        const { canOrderBeFilled } = this.state;
        const { orderType } = this.props;
        if (orderType === OrderType.Market && !canOrderBeFilled) {
            return `---`;
        }

        // Calculate total cost in weth and usd
        const { feeInZrx, totalPriceWithoutFeeInWeth } = this.state;
        const { zrxInWeth, zrxInUsd, ethInUsd } = this.state.prices;
        const totalCostInWeth = totalPriceWithoutFeeInWeth.add(feeInZrx.mul(zrxInWeth));
        const totalCostInUsd = totalPriceWithoutFeeInWeth.mul(ethInUsd).add(feeInZrx.mul(zrxInUsd));

        // Format the number
        const wethTokenDecimals = getKnownTokens().getWethToken().decimals;
        const totalCostInWethString = tokenAmountInUnits(totalCostInWeth, wethTokenDecimals);
        const totalCostInUsdString = tokenAmountInUnits(totalCostInUsd, wethTokenDecimals);
        return `(${totalCostInWethString} wETH) $${totalCostInUsdString}`;
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
