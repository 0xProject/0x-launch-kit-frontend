import { BigNumber } from '0x.js';
import { SignedOrder } from '@0x/connect';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { MAKER_FEE, ZRX_TOKEN_SYMBOL } from '../../common/constants';
import { getAllOrdersToFillMarketOrderAndAmountsToPay } from '../../services/orders';
import { getOpenBuyOrders, getOpenSellOrders } from '../../store/selectors';
import { getKnownTokens } from '../../util/known_tokens';
import { themeColors } from '../../util/theme';
import { tokenAmountInUnits } from '../../util/tokens';
import { CurrencyPair, OrderSide, OrderType, StoreState, UIOrder } from '../../util/types';

const Row = styled.div`
    align-items: center;
    border-top: dashed 1px ${themeColors.borderColor};
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    position: relative;
    z-index: 1;

    &: last-of-type {
        margin-bottom: 20px;
    }
`;

const Value = styled.div`
    color: #000;
    flex-shrink: 0;
    font-size: 14px;
    line-height: 1.2;
    white-space: nowrap;
`;

const TotalCostValue = styled(Value)`
    font-weight: bold;
`;

const LabelContainer = styled.div`
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
`;

const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || '#000'};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;

const MainLabel = styled(Label)`
    font-size: 12px;
    text-transform: uppercase;
`;

const FeeLabel = styled(Label)`
    font-weight: normal;
`;

const TotalCostLabel = styled(Label)`
    font-weight: bold;
`;

interface OwnProps {
    orderType: OrderType;
    tokenAmount: BigNumber;
    tokenPrice: BigNumber;
    orderSide: OrderSide;
    currencyPair: CurrencyPair;
}

interface StateProps {
    openSellOrders: UIOrder[];
    openBuyOrders: UIOrder[];
}

type Props = StateProps & OwnProps;

interface State {
    feeInZrx: BigNumber;
    totalPriceWithoutFeeInQuoteToken: BigNumber;
    canOrderBeFilled?: boolean;
}

class OrderDetails extends React.Component<Props, State> {
    public state = {
        feeInZrx: new BigNumber(0),
        totalPriceWithoutFeeInQuoteToken: new BigNumber(0),
        canOrderBeFilled: true,
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>) => {
        const newProps = this.props;
        if (
            newProps.tokenPrice !== prevProps.tokenPrice ||
            newProps.orderType !== prevProps.orderType ||
            newProps.tokenAmount !== prevProps.tokenAmount ||
            newProps.currencyPair !== prevProps.currencyPair ||
            newProps.orderSide !== prevProps.orderSide
        ) {
            await this._updateOrderDetailsState();
        }
    };

    public componentDidMount = async () => {
        await this._updateOrderDetailsState();
    };

    public render = () => {
        const fee = this._getFeeStringForRender();
        const totalCost = this._getTotalCostStringForRender();
        return (
            <>
                <LabelContainer>
                    <MainLabel>Order Details</MainLabel>
                </LabelContainer>
                <Row>
                    <FeeLabel color={themeColors.textLight}>Fee</FeeLabel>
                    <Value>{fee}</Value>
                </Row>
                <Row>
                    <TotalCostLabel>Cost</TotalCostLabel>
                    <TotalCostValue>{totalCost}</TotalCostValue>
                </Row>
            </>
        );
    };

    private readonly _updateOrderDetailsState = async () => {
        const { currencyPair, orderType } = this.props;
        if (!currencyPair) {
            return;
        }

        if (orderType === OrderType.Limit) {
            const { tokenAmount, tokenPrice } = this.props;
            const feeInZrx = MAKER_FEE;
            const totalPriceWithoutFeeInQuoteToken = tokenAmount.mul(tokenPrice);
            this.setState({
                feeInZrx,
                totalPriceWithoutFeeInQuoteToken,
            });
        } else {
            const { tokenAmount, orderSide, openSellOrders, openBuyOrders } = this.props;
            // Gets the fillable orders and sum their fee and amounts
            const uiOrders = orderSide === OrderSide.Sell ? openBuyOrders : openSellOrders;
            const [
                ordersToFill,
                amountToPayForEachOrder,
                canOrderBeFilled,
            ] = getAllOrdersToFillMarketOrderAndAmountsToPay(tokenAmount, orderSide, uiOrders);
            const feeInZrx = ordersToFill.reduce(
                (totalFeeSum: BigNumber, currentOrder: SignedOrder) => totalFeeSum.add(currentOrder.takerFee),
                new BigNumber(0),
            );
            const totalPriceWithoutFeeInQuoteToken = amountToPayForEachOrder.reduce(
                (totalPriceSum: BigNumber, currentPrice: BigNumber) => totalPriceSum.add(currentPrice),
                new BigNumber(0),
            );
            this.setState({
                feeInZrx,
                totalPriceWithoutFeeInQuoteToken,
                canOrderBeFilled,
            });
        }
    };

    private readonly _getFeeStringForRender = () => {
        const { feeInZrx } = this.state;
        const zrxDecimals = getKnownTokens().getTokenBySymbol(ZRX_TOKEN_SYMBOL).decimals;
        return `${tokenAmountInUnits(feeInZrx, zrxDecimals)} ${ZRX_TOKEN_SYMBOL.toUpperCase()}`;
    };

    private readonly _getTotalCostStringForRender = () => {
        const { canOrderBeFilled } = this.state;
        const { orderType } = this.props;
        if (orderType === OrderType.Market && !canOrderBeFilled) {
            return `---`;
        }

        const { quote } = this.props.currencyPair;
        const quoteTokenDecimals = getKnownTokens().getTokenBySymbol(quote).decimals;

        const { totalPriceWithoutFeeInQuoteToken } = this.state;
        const totalCostString = `${tokenAmountInUnits(totalPriceWithoutFeeInQuoteToken, quoteTokenDecimals)} ${quote}`;

        return `${totalCostString}`;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        openSellOrders: getOpenSellOrders(state),
        openBuyOrders: getOpenBuyOrders(state),
    };
};

const OrderDetailsContainer = connect(mapStateToProps)(OrderDetails);

export { OrderDetails, OrderDetailsContainer, Value };
