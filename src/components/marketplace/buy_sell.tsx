import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { initWallet, startBuySellLimitSteps, startBuySellMarketSteps } from '../../store/actions';
import { getCurrencyPair, getWeb3State } from '../../store/selectors';
import { themeColors, themeDimensions } from '../../util/theme';
import { tokenSymbolToDisplayString } from '../../util/tokens';
import { CurrencyPair, OrderSide, OrderType, StoreState, TokenSymbol, Web3State } from '../../util/types';
import { BigNumberInput } from '../common/big_number_input';
import { Button } from '../common/button';
import { CardBase } from '../common/card_base';
import { CardTabSelector } from '../common/card_tab_selector';

import { OrderDetailsContainer } from './order_details';

interface StateProps {
    web3State: Web3State;
    currencyPair: CurrencyPair;
}

interface DispatchProps {
    onSubmitLimitOrder: (amount: BigNumber, price: BigNumber, side: OrderSide) => Promise<any>;
    onSubmitMarketOrder: (amount: BigNumber, side: OrderSide) => Promise<any>;
    onConnectWallet: () => any;
}

type Props = StateProps & DispatchProps;

interface State {
    makerAmount: BigNumber | null;
    orderType: OrderType;
    price: BigNumber | null;
    tab: OrderSide;
}

const BuySellWrapper = styled(CardBase)`
    margin-bottom: ${themeDimensions.verticalSeparation};
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
    background-color: ${props => (props.isSelected ? 'transparent' : '#f9f9f9')};
    border-bottom-color: ${props => (props.isSelected ? 'transparent' : themeColors.borderColor)};
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-right-color: ${props => (props.isSelected ? themeColors.borderColor : 'transparent')};
    border-right-style: solid;
    border-right-width: 1px;
    color: ${props =>
        props.isSelected
            ? props.side === OrderSide.Buy
                ? themeColors.green
                : themeColors.orange
            : themeColors.textLight};
    cursor: ${props => (props.isSelected ? 'default' : 'pointer')};
    display: flex;
    font-weight: 600;
    height: 47px;
    justify-content: center;
    width: 50%;

    &:last-child {
        border-left-color: ${props => (props.isSelected ? themeColors.borderColor : 'transparent')};
        border-left-style: solid;
        border-left-width: 1px;
        border-right: none;
    }
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

const FieldContainer = styled.div`
    height: ${themeDimensions.fieldHeight};
    margin-bottom: 25px;
    position: relative;
`;

const fieldStyle = `
    border: 1px solid ${themeColors.borderColor};
    border-radius: ${themeDimensions.borderRadius};
    color: #000;
    font-feature-settings: 'tnum' 1;
    font-size: 16px;
    height: 100%;
    padding-left: 14px;
    padding-right: 60px;
    position: absolute;
    width: 100%;
    z-index: 1;
`;

const BigInputNumberStyled = styled<any>(BigNumberInput)`
    ${fieldStyle}
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
    color: #333;
    font-size: 14px;
    font-weight: normal;
    line-height: 21px;
    text-align: right;
`;

const BigInputNumberTokenLabel = (props: { tokenSymbol: TokenSymbol }) => (
    <TokenContainer>
        <TokenText>{tokenSymbolToDisplayString(props.tokenSymbol)}</TokenText>
    </TokenContainer>
);

class BuySell extends React.Component<Props, State> {
    public state: State = {
        makerAmount: null,
        price: null,
        orderType: OrderType.Market,
        tab: OrderSide.Buy,
    };

    public render = () => {
        const { currencyPair, web3State } = this.props;
        const { makerAmount, price, tab, orderType } = this.state;

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

        const orderTypeLimitIsEmpty = orderType === OrderType.Limit && (isMakerAmountEmpty || isPriceEmpty);
        const orderTypeMarketIsEmpty = orderType === OrderType.Market && isMakerAmountEmpty;

        return (
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
                            decimals={18}
                            min={new BigNumber(0)}
                            onChange={this.updateMakerAmount}
                            value={makerAmount}
                            placeholder={'0.00'}
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
                                    placeholder={'0.00'}
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
                        theme="secondary"
                        onClick={tab === OrderSide.Buy ? this.buy : this.sell}
                        disabled={web3State !== Web3State.Done || orderTypeLimitIsEmpty || orderTypeMarketIsEmpty}
                    >
                        {tab === OrderSide.Buy ? 'Buy ' : 'Sell '}
                        {tokenSymbolToDisplayString(currencyPair.base)}
                    </Button>
                </Content>
            </BuySellWrapper>
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

    public buy = async () => {
        const makerAmount = this.state.makerAmount || new BigNumber(0);
        const price = this.state.price || new BigNumber(0);

        if (this.state.orderType === OrderType.Limit) {
            await this.props.onSubmitLimitOrder(makerAmount, price, OrderSide.Buy);
        } else {
            await this.props.onSubmitMarketOrder(makerAmount, OrderSide.Buy);
        }
        this._reset();
    };

    public sell = async () => {
        const makerAmount = this.state.makerAmount || new BigNumber(0);
        const price = this.state.price || new BigNumber(0);

        if (this.state.orderType === OrderType.Limit) {
            await this.props.onSubmitLimitOrder(makerAmount, price, OrderSide.Sell);
        } else {
            await this.props.onSubmitMarketOrder(makerAmount, OrderSide.Sell);
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
    };
};

const BuySellContainer = connect(
    mapStateToProps,
    {
        onSubmitLimitOrder: startBuySellLimitSteps,
        onSubmitMarketOrder: startBuySellMarketSteps,
        onConnectWallet: initWallet,
    },
)(BuySell);

export { BuySell, BuySellContainer };
