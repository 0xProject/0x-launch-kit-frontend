import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { initWallet, startBuySellLimitSteps, startBuySellMarketSteps } from '../../../store/actions';
import { fetchTakerAndMakerFee } from '../../../store/relayer/actions';
import { getCurrencyPair, getOrderPriceSelected, getWeb3State } from '../../../store/selectors';
import { themeDimensions } from '../../../themes/commons';
import { getKnownTokens } from '../../../util/known_tokens';
import { tokenSymbolToDisplayString } from '../../../util/tokens';
import {
    ButtonIcons,
    ButtonVariant,
    CurrencyPair,
    OrderSide,
    OrderType,
    StoreState,
    Web3State,
} from '../../../util/types';
import { BigNumberInput } from '../../common/big_number_input';
import { Button } from '../../common/button';
import { CardBase } from '../../common/card_base';
import { CardTabSelector } from '../../common/card_tab_selector';
import { ErrorCard, ErrorIcons, FontSize } from '../../common/error_card';

import { OrderDetailsContainer } from './order_details';
import { UI_DECIMALS_DISPLAYED_PRICE_ETH } from '../../../common/constants';

interface StateProps {
    web3State: Web3State;
    currencyPair: CurrencyPair;
    orderPriceSelected: BigNumber | null;
}

interface DispatchProps {
    onSubmitLimitOrder: (amount: BigNumber, price: BigNumber, side: OrderSide, makerFee: BigNumber) => Promise<any>;
    onSubmitMarketOrder: (amount: BigNumber, side: OrderSide, takerFee: BigNumber) => Promise<any>;
    onConnectWallet: () => any;
    onFetchTakerAndMakerFee: (amount: BigNumber, price: BigNumber, side: OrderSide) => Promise<any>;
}

type Props = StateProps & DispatchProps;

interface State {
    makerAmount: BigNumber | null;
    orderType: OrderType;
    price: BigNumber | null;
    tab: OrderSide;
    error: {
        btnMsg: string | null;
        cardMsg: string | null;
    };
}

const BuySellWrapper = styled(CardBase)`
    margin-bottom: ${themeDimensions.verticalSeparationSm};
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px ${themeDimensions.horizontalPadding};
`;

const TabsContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const TabButton = styled.div<{ isSelected: boolean; side: OrderSide }>`
    align-items: center;
    background-color: ${props =>
        props.isSelected ? 'transparent' : props.theme.componentsTheme.inactiveTabBackgroundColor};
    border-bottom-color: ${props => (props.isSelected ? 'transparent' : props.theme.componentsTheme.cardBorderColor)};
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-right-color: ${props => (props.isSelected ? props.theme.componentsTheme.cardBorderColor : 'transparent')};
    border-right-style: solid;
    border-right-width: 1px;
    color: ${props =>
        props.isSelected
            ? props.side === OrderSide.Buy
                ? props.theme.componentsTheme.green
                : props.theme.componentsTheme.red
            : props.theme.componentsTheme.textLight};
    cursor: ${props => (props.isSelected ? 'default' : 'pointer')};
    display: flex;
    font-weight: 600;
    height: 47px;
    justify-content: center;
    width: 50%;

    &:first-child {
        border-top-left-radius: ${themeDimensions.borderRadius};
    }

    &:last-child {
        border-left-color: ${props => (props.isSelected ? props.theme.componentsTheme.cardBorderColor : 'transparent')};
        border-left-style: solid;
        border-left-width: 1px;
        border-right: none;
        border-top-right-radius: ${themeDimensions.borderRadius};
    }
`;

const LabelContainer = styled.div`
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;

const InnerTabs = styled(CardTabSelector)`
    font-size: 14px;
`;

const FieldContainer = styled.div`
    height: ${themeDimensions.fieldHeight};
    margin-bottom: 25px;
    position: relative;
`;

const BigInputNumberStyled = styled<any>(BigNumberInput)`
    background-color: ${props => props.theme.componentsTheme.textInputBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.textInputBorderColor};
    color: ${props => props.theme.componentsTheme.textInputTextColor};
    font-feature-settings: 'tnum' 1;
    font-size: 16px;
    height: 100%;
    padding-left: 14px;
    padding-right: 60px;
    position: absolute;
    width: 100%;
    z-index: 1;
`;

const TokenContainer = styled.div`
    display: flex;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 12;
`;

const TokenText = styled.span`
    color: ${props => props.theme.componentsTheme.textInputTextColor};
    font-size: 14px;
    font-weight: normal;
    line-height: 21px;
    text-align: right;
`;

const BigInputNumberTokenLabel = (props: { tokenSymbol: string }) => (
    <TokenContainer>
        <TokenText>{tokenSymbolToDisplayString(props.tokenSymbol)}</TokenText>
    </TokenContainer>
);

const TIMEOUT_BTN_ERROR = 2000;
const TIMEOUT_CARD_ERROR = 4000;

class BuySell extends React.Component<Props, State> {
    public state: State = {
        makerAmount: null,
        price: null,
        orderType: OrderType.Market,
        tab: OrderSide.Buy,
        error: {
            btnMsg: null,
            cardMsg: null,
        },
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>) => {
        const newProps = this.props;
        if (newProps.orderPriceSelected !== prevProps.orderPriceSelected && this.state.orderType === OrderType.Limit) {
            this.setState({
                price: newProps.orderPriceSelected,
            });
        }
    };

    public render = () => {
        const { currencyPair, web3State } = this.props;
        const { makerAmount, price, tab, orderType, error } = this.state;

        const buySellInnerTabs = [
            {
                active: orderType === OrderType.Market,
                onClick: this._switchToMarket,
                text: 'Market',
            },
            {
                active: orderType === OrderType.Limit,
                onClick: this._switchToLimit,
                text: 'Limit',
            },
        ];

        const isMakerAmountEmpty = makerAmount === null || makerAmount.isZero();
        const isPriceEmpty = price === null || price.isZero();
        const isPriceMin = price === null || price.isLessThan(new BigNumber(1).div(new BigNumber(10)).pow(UI_DECIMALS_DISPLAYED_PRICE_ETH));
        const orderTypeLimitIsEmpty = orderType === OrderType.Limit && (isMakerAmountEmpty || isPriceEmpty || isPriceMin);
        const orderTypeMarketIsEmpty = orderType === OrderType.Market && isMakerAmountEmpty;

        const btnPrefix = tab === OrderSide.Buy ? 'Buy ' : 'Sell ';
        const btnText = error && error.btnMsg ? 'Error' : btnPrefix + tokenSymbolToDisplayString(currencyPair.base);

        const decimals = getKnownTokens().getTokenBySymbol(currencyPair.base).decimals;

        return (
            <>
                <BuySellWrapper>
                    <TabsContainer>
                        <TabButton
                            isSelected={tab === OrderSide.Buy}
                            onClick={this.changeTab(OrderSide.Buy)}
                            side={OrderSide.Buy}
                        >
                            Buy
                        </TabButton>
                        <TabButton
                            isSelected={tab === OrderSide.Sell}
                            onClick={this.changeTab(OrderSide.Sell)}
                            side={OrderSide.Sell}
                        >
                            Sell
                        </TabButton>
                    </TabsContainer>
                    <Content>
                        <LabelContainer>
                            <Label>Amount</Label>
                            <InnerTabs tabs={buySellInnerTabs} />
                        </LabelContainer>
                        <FieldContainer>
                            <BigInputNumberStyled
                                decimals={decimals}
                                min={new BigNumber(0)}
                                onChange={this.updateMakerAmount}
                                value={makerAmount}
                                placeholder={'0'}
                                valueFixedDecimals={0}
                            />
                            <BigInputNumberTokenLabel tokenSymbol={currencyPair.base} />
                        </FieldContainer>
                        {orderType === OrderType.Limit && (
                            <>
                                <LabelContainer>
                                    <Label>Price per token</Label>
                                </LabelContainer>
                                <FieldContainer>
                                    <BigInputNumberStyled
                                        decimals={0}
                                        min={new BigNumber(0)}
                                        onChange={this.updatePrice}
                                        value={price}
                                        placeholder={'0.0000001'}
                                        valueFixedDecimals={7}
                                    />
                                    <BigInputNumberTokenLabel tokenSymbol={currencyPair.quote} />
                                </FieldContainer>
                            </>
                        )}
                        <OrderDetailsContainer
                            orderType={orderType}
                            orderSide={tab}
                            tokenAmount={makerAmount || new BigNumber(0)}
                            tokenPrice={price || new BigNumber(0)}
                            currencyPair={currencyPair}
                        />
                        <Button
                            disabled={web3State !== Web3State.Done || orderTypeLimitIsEmpty || orderTypeMarketIsEmpty}
                            icon={error && error.btnMsg ? ButtonIcons.Warning : undefined}
                            onClick={this.submit}
                            variant={
                                error && error.btnMsg
                                    ? ButtonVariant.Error
                                    : tab === OrderSide.Buy
                                    ? ButtonVariant.Buy
                                    : ButtonVariant.Sell
                            }
                        >
                            {btnText}
                        </Button>
                    </Content>
                </BuySellWrapper>
                {error && error.cardMsg ? (
                    <ErrorCard fontSize={FontSize.Large} text={error.cardMsg} icon={ErrorIcons.Sad} />
                ) : null}
            </>
        );
    };

    public changeTab = (tab: OrderSide) => () => this.setState({ tab });

    public updateMakerAmount = (newValue: BigNumber) => {
        this.setState({
            makerAmount: newValue,
        });
    };

    public updatePrice = (price: BigNumber) => {
        this.setState({ price });
    };

    public submit = async () => {
        const orderSide = this.state.tab;
        const makerAmount = this.state.makerAmount || new BigNumber(0);
        const price = this.state.price || new BigNumber(0);

        const { makerFee, takerFee } = await this.props.onFetchTakerAndMakerFee(makerAmount, price, this.state.tab);
        if (this.state.orderType === OrderType.Limit) {
            await this.props.onSubmitLimitOrder(makerAmount, price, orderSide, makerFee);
        } else {
            try {
                await this.props.onSubmitMarketOrder(makerAmount, orderSide, takerFee);
            } catch (error) {
                this.setState(
                    {
                        error: {
                            btnMsg: 'Error',
                            cardMsg: error.message,
                        },
                    },
                    () => {
                        // After a timeout both error message and button gets cleared
                        setTimeout(() => {
                            this.setState({
                                error: {
                                    ...this.state.error,
                                    btnMsg: null,
                                },
                            });
                        }, TIMEOUT_BTN_ERROR);
                        setTimeout(() => {
                            this.setState({
                                error: {
                                    ...this.state.error,
                                    cardMsg: null,
                                },
                            });
                        }, TIMEOUT_CARD_ERROR);
                    },
                );
            }
        }
        this._reset();
    };

    private readonly _reset = () => {
        this.setState({
            makerAmount: null,
            price: null,
        });
    };

    private readonly _switchToMarket = () => {
        this.setState({
            orderType: OrderType.Market,
        });
    };

    private readonly _switchToLimit = () => {
        this.setState({
            orderType: OrderType.Limit,
        });
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
        currencyPair: getCurrencyPair(state),
        orderPriceSelected: getOrderPriceSelected(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onSubmitLimitOrder: (amount: BigNumber, price: BigNumber, side: OrderSide, makerFee: BigNumber) =>
            dispatch(startBuySellLimitSteps(amount, price, side, makerFee)),
        onSubmitMarketOrder: (amount: BigNumber, side: OrderSide, takerFee: BigNumber) =>
            dispatch(startBuySellMarketSteps(amount, side, takerFee)),
        onConnectWallet: () => dispatch(initWallet()),
        onFetchTakerAndMakerFee: (amount: BigNumber, price: BigNumber, side: OrderSide) =>
            dispatch(fetchTakerAndMakerFee(amount, price, side)),
    };
};

const BuySellContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(BuySell);

export { BuySell, BuySellContainer };
