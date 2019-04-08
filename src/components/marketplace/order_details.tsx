import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { MAKER_FEE } from '../../common/constants';
import { getNetworkId, getOpenBuyOrders, getOpenSellOrders } from '../../store/selectors';
import { getKnownTokens } from '../../util/known_tokens';
import { buildMarketOrders } from '../../util/orders';
import { themeColors } from '../../util/theme';
import { tokenAmountInUnits, tokenSymbolToDisplayString } from '../../util/tokens';
import { CurrencyPair, OrderSide, OrderType, StoreState, TokenSymbol, UIOrder } from '../../util/types';

const Row = styled.div`
    align-items: center;
    border-top: dashed 1px ${themeColors.borderColor};
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    position: relative;
    z-index: 1;

    &:last-of-type {
        margin-bottom: 20px;
    }
`;

const Value = styled.div`
    color: #000;
    flex-shrink: 0;
    font-feature-settings: 'tnum' 1;
    font-size: 14px;
    line-height: 1.2;
    white-space: nowrap;
`;

const CostValue = styled(Value)`
    font-feature-settings: 'tnum' 1;
    font-weight: bold;
`;

const LabelContainer = styled.div`
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin: 5px 0 12px 0;
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

const CostLabel = styled(Label)`
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
    networkId: number | null;
    openSellOrders: UIOrder[];
    openBuyOrders: UIOrder[];
}

type Props = StateProps & OwnProps;

interface State {
    feeInZrx: BigNumber;
    quoteTokenAmount: BigNumber;
    canOrderBeFilled?: boolean;
}

class OrderDetails extends React.Component<Props, State> {
    public state = {
        feeInZrx: new BigNumber(0),
        quoteTokenAmount: new BigNumber(0),
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
        const cost = this._getCostStringForRender();
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
                    <CostLabel>Cost</CostLabel>
                    <CostValue>{cost}</CostValue>
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
            const quoteTokenAmount = tokenAmount.mul(tokenPrice);
            this.setState({
                feeInZrx: MAKER_FEE,
                quoteTokenAmount,
            });
        } else {
            const { tokenAmount, orderSide, openSellOrders, openBuyOrders } = this.props;
            const [ordersToFill, amountToPayForEachOrder, canOrderBeFilled] = buildMarketOrders(
                {
                    amount: tokenAmount,
                    orders: orderSide === OrderSide.Sell ? openBuyOrders : openSellOrders,
                },
                orderSide,
            );
            const feeInZrx = ordersToFill.reduce((sum, order) => sum.add(order.takerFee), new BigNumber(0));
            const quoteTokenAmount = amountToPayForEachOrder.reduce((sum, amount) => sum.add(amount), new BigNumber(0));
            this.setState({
                feeInZrx,
                quoteTokenAmount,
                canOrderBeFilled,
            });
        }
    };

    private readonly _getFeeStringForRender = () => {
        const { networkId } = this.props;
        if (networkId === null) {
            return '';
        }
        const { feeInZrx } = this.state;
        const zrxDecimals = getKnownTokens(networkId).getTokenBySymbol(TokenSymbol.Zrx).decimals;
        return `${tokenAmountInUnits(feeInZrx, zrxDecimals)} ${tokenSymbolToDisplayString(TokenSymbol.Zrx)}`;
    };

    private readonly _getCostStringForRender = () => {
        const { canOrderBeFilled } = this.state;
        const { networkId, orderType } = this.props;
        if (networkId === null) {
            return '';
        }
        if (orderType === OrderType.Market && !canOrderBeFilled) {
            return `---`;
        }

        const { quote } = this.props.currencyPair;
        const quoteTokenDecimals = getKnownTokens(networkId).getTokenBySymbol(quote).decimals;
        const { quoteTokenAmount } = this.state;
        return `${tokenAmountInUnits(quoteTokenAmount, quoteTokenDecimals)} ${tokenSymbolToDisplayString(quote)}`;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        networkId: getNetworkId(state),
        openSellOrders: getOpenSellOrders(state),
        openBuyOrders: getOpenBuyOrders(state),
    };
};

const OrderDetailsContainer = connect(mapStateToProps)(OrderDetails);

export { CostValue, OrderDetails, OrderDetailsContainer, Value };
