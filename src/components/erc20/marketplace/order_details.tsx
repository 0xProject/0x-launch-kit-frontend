import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { fetchTakerAndMakerFee } from '../../../store/relayer/actions';
import { getOpenBuyOrders, getOpenSellOrders } from '../../../store/selectors';
import { getKnownTokens } from '../../../util/known_tokens';
import { buildMarketOrders, sumTakerAssetFillableOrders } from '../../../util/orders';
import { tokenAmountInUnits, tokenSymbolToDisplayString } from '../../../util/tokens';
import { CurrencyPair, OrderSide, OrderType, StoreState, UIOrder } from '../../../util/types';

const Row = styled.div`
    align-items: center;
    border-top: dashed 1px ${props => props.theme.componentsTheme.borderColor};
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
    color: ${props => props.theme.componentsTheme.textColorCommon};
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
    margin: 5px 0 10px 0;
`;

const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;

const MainLabel = styled(Label)``;

const FeeLabel = styled(Label)`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-weight: normal;
`;

const CostLabel = styled(Label)`
    font-weight: 700;
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

interface DispatchProps {
    onFetchTakerAndMakerFee: (amount: BigNumber, price: BigNumber, side: OrderSide) => Promise<any>;
}

type Props = StateProps & OwnProps & DispatchProps;

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
        const { orderSide } = this.props;
        const costText = orderSide === OrderSide.Sell ? 'Total' : 'Cost';
        return (
            <>
                <LabelContainer>
                    <MainLabel>Order Details</MainLabel>
                </LabelContainer>
                <Row>
                    <FeeLabel>Fee</FeeLabel>
                    <Value>{fee}</Value>
                </Row>
                <Row>
                    <CostLabel>{costText}</CostLabel>
                    <CostValue>{cost}</CostValue>
                </Row>
            </>
        );
    };

    private readonly _updateOrderDetailsState = async () => {
        const { currencyPair, orderType, orderSide } = this.props;
        if (!currencyPair) {
            return;
        }

        if (orderType === OrderType.Limit) {
            const { tokenAmount, tokenPrice, onFetchTakerAndMakerFee } = this.props;
            const { quote, base } = currencyPair;
            const quoteToken = getKnownTokens().getTokenBySymbol(quote);
            const baseToken = getKnownTokens().getTokenBySymbol(base);
            const priceInQuoteBaseUnits = Web3Wrapper.toBaseUnitAmount(tokenPrice, quoteToken.decimals);
            const baseTokenAmountInUnits = Web3Wrapper.toUnitAmount(tokenAmount, baseToken.decimals);
            const quoteTokenAmount = baseTokenAmountInUnits.multipliedBy(priceInQuoteBaseUnits);
            const { makerFee } = await onFetchTakerAndMakerFee(tokenAmount, tokenPrice, orderSide);
            this.setState({
                feeInZrx: makerFee,
                quoteTokenAmount,
            });
        } else {
            const { tokenAmount, openSellOrders, openBuyOrders } = this.props;
            const isSell = orderSide === OrderSide.Sell;
            const { orders, amounts, canBeFilled } = buildMarketOrders(
                {
                    amount: tokenAmount,
                    orders: isSell ? openBuyOrders : openSellOrders,
                },
                orderSide,
            );
            const feeInZrx = orders.reduce((sum, order) => sum.plus(order.takerFee), new BigNumber(0));
            const quoteTokenAmount = sumTakerAssetFillableOrders(orderSide, orders, amounts);

            this.setState({
                feeInZrx,
                quoteTokenAmount,
                canOrderBeFilled: canBeFilled,
            });
        }
    };

    private readonly _getFeeStringForRender = () => {
        const { feeInZrx } = this.state;
        const feeToken = getKnownTokens().getTokenBySymbol('zrx');
        return `${tokenAmountInUnits(
            feeInZrx,
            feeToken.decimals,
            feeToken.displayDecimals,
        )} ${tokenSymbolToDisplayString('ZRX')}`;
    };

    private readonly _getCostStringForRender = () => {
        const { canOrderBeFilled } = this.state;
        const { orderType } = this.props;
        if (orderType === OrderType.Market && !canOrderBeFilled) {
            return `---`;
        }

        const { quote } = this.props.currencyPair;
        const quoteToken = getKnownTokens().getTokenBySymbol(quote);
        const { quoteTokenAmount } = this.state;
        const costAmount = tokenAmountInUnits(quoteTokenAmount, quoteToken.decimals, quoteToken.displayDecimals);
        return `${costAmount} ${tokenSymbolToDisplayString(quote)}`;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        openSellOrders: getOpenSellOrders(state),
        openBuyOrders: getOpenBuyOrders(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onFetchTakerAndMakerFee: (amount: BigNumber, price: BigNumber, side: OrderSide) =>
            dispatch(fetchTakerAndMakerFee(amount, price, side, side)),
    };
};

const OrderDetailsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(OrderDetails);

export { CostValue, OrderDetails, OrderDetailsContainer, Value };
