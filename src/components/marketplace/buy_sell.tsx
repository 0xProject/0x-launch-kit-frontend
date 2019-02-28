import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { submitOrder } from '../../store/actions';
import { getSelectedTokenSymbol } from '../../store/selectors';
import { orderDetailsFeeDollar, orderDetailsFeeEther } from '../../util/orders';
import { themeColors, themeDimensions } from '../../util/theme';
import { OrderSide, StoreState } from '../../util/types';
import { BigNumberInput } from '../common/big_number_input';
import { Button } from '../common/button';
import { CardBase } from '../common/card_base';
import { CardTabSelector } from '../common/card_tab_selector';

interface StateProps {
    selectedTokenSymbol: string;
}

interface DispatchProps {
    onSubmitOrder: (amount: BigNumber, price: number, side: OrderSide) => Promise<any>;
}

type Props = StateProps & DispatchProps;

enum OrderType {
    Limit,
    Market,
}

enum OrderDetailsType {
    Eth,
    Usd,
}

interface State {
    makerAmount: BigNumber;
    orderFeeEther: BigNumber;
    orderFeeDollar: BigNumber;
    orderType: OrderType;
    orderDetailType: OrderDetailsType;
    price: number;
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

const TabButton = styled.div<{ isSelected: boolean }>`
    align-items: center;
    background-color: ${props => (props.isSelected ? 'transparent' : '#f9f9f9')};
    border-bottom-color: ${props => (props.isSelected ? 'transparent' : themeColors.borderColor)};
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-right-color: ${props => (props.isSelected ? themeColors.borderColor : 'transparent')};
    border-right-style: solid;
    border-right-width: 1px;
    color: ${props => (props.isSelected ? themeColors.green : themeColors.textLight)};
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
    color: ${props => (props.color ? props.color : '#000')};
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

const FieldStyled = styled.input`
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

class BuySell extends React.Component<Props, State> {
    public state = {
        makerAmount: new BigNumber(0),
        orderFeeEther: new BigNumber(0),
        orderFeeDollar: new BigNumber(0),
        orderType: OrderType.Limit,
        orderDetailType: OrderDetailsType.Eth,
        price: 0,
        tab: OrderSide.Buy,
    };

    public render = () => {
        const { selectedTokenSymbol } = this.props;
        const { makerAmount, price, tab, orderType, orderDetailType } = this.state;

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

        const ethUsdTabs = [
            {
                active: orderDetailType === OrderDetailsType.Eth,
                onClick: this._switchToEth,
                text: 'ETH',
            },
            {
                active: orderDetailType === OrderDetailsType.Usd,
                onClick: this._switchToUsd,
                text: 'USD',
            },
        ];

        return (
            <BuySellWrapper>
                <TabsContainer>
                    <TabButton isSelected={tab === OrderSide.Buy} onClick={this.changeTab(OrderSide.Buy)}>
                        Buy
                    </TabButton>
                    <TabButton isSelected={tab === OrderSide.Sell} onClick={this.changeTab(OrderSide.Sell)}>
                        Sell
                    </TabButton>
                </TabsContainer>
                <Content>
                    <LabelContainer>
                        <Label>I want to {tab === OrderSide.Buy ? 'buy' : 'sell'}</Label>
                        <InnerTabs tabs={buySellInnerTabs} />
                    </LabelContainer>
                    <FieldContainer>
                        <BigInputNumberStyled
                            decimals={18}
                            min={new BigNumber(0)}
                            onChange={this.updateMakerAmount}
                            value={makerAmount}
                        />
                        <TokenContainer>
                            <TokenText>{selectedTokenSymbol}</TokenText>
                        </TokenContainer>
                    </FieldContainer>
                    <LabelContainer>
                        <Label>Token price</Label>
                    </LabelContainer>
                    <FieldContainer>
                        <FieldStyled type="number" value={price} min={0} onChange={this.updatePrice} />
                        <TokenContainer>
                            <TokenText>wETH</TokenText>
                        </TokenContainer>
                    </FieldContainer>

                    <LabelContainer>
                        <Label>Order Details</Label>
                        <InnerTabs tabs={ethUsdTabs} />
                    </LabelContainer>
                    <Row>
                        <Label color={themeColors.textLight}>Fee</Label>
                        <Value>
                            {orderDetailType === OrderDetailsType.Usd
                                ? `$ ${this.state.orderFeeDollar.toString()}`
                                : `${this.state.orderFeeEther.toString()} Eth`}
                        </Value>
                    </Row>

                    <Button theme="secondary" onClick={tab === OrderSide.Buy ? this.buy : this.sell}>
                        {tab === OrderSide.Buy ? 'Buy' : 'Sell'} {selectedTokenSymbol}
                    </Button>
                </Content>
            </BuySellWrapper>
        );
    };

    public changeTab = (tab: OrderSide) => () => this.setState({ tab }, () => this.updateOrderFee());

    public updateMakerAmount = (newValue: BigNumber) => {
        this.setState(
            {
                makerAmount: newValue,
            },
            () => this.updateOrderFee(),
        );
    };

    public updatePrice: React.ReactEventHandler<HTMLInputElement> = e => {
        const price = parseFloat(e.currentTarget.value);
        this.setState({ price }, () => this.updateOrderFee());
    };

    public updateOrderFee = async () => {
        const orderFeeEther = orderDetailsFeeEther(
            this.state.makerAmount,
            new BigNumber(this.state.price),
            this.state.tab,
        );
        const orderFeeDollar = await orderDetailsFeeDollar(
            this.state.makerAmount,
            new BigNumber(this.state.price),
            this.state.tab,
        );
        this.setState({
            orderFeeEther,
            orderFeeDollar,
        });
    };

    public buy = async () => {
        await this.props.onSubmitOrder(this.state.makerAmount, this.state.price, OrderSide.Buy);
        this._reset();
    };

    public sell = async () => {
        await this.props.onSubmitOrder(this.state.makerAmount, this.state.price, OrderSide.Sell);
        this._reset();
    };

    private readonly _reset = () => {
        this.setState({
            makerAmount: new BigNumber('0'),
            price: 0,
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

    private readonly _switchToUsd = () => {
        this.setState({
            orderDetailType: OrderDetailsType.Usd,
        });
    };

    private readonly _switchToEth = () => {
        this.setState({
            orderDetailType: OrderDetailsType.Eth,
        });
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        selectedTokenSymbol: getSelectedTokenSymbol(state),
    };
};

const BuySellContainer = connect(
    mapStateToProps,
    {
        onSubmitOrder: submitOrder,
    },
)(BuySell);

export { BuySell, BuySellContainer };
