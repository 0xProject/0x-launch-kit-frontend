import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { startBuySellLimitSteps, submitMarketOrder } from '../../store/actions';
import { getSelectedTokenSymbol } from '../../store/selectors';
import { themeColors, themeDimensions } from '../../util/theme';
import { OrderSide, StoreState } from '../../util/types';
import { BigNumberInput } from '../common/big_number_input';
import { Button } from '../common/button';
import { CardBase } from '../common/card_base';
import { CardTabSelector } from '../common/card_tab_selector';

import { OrderDetailsContainer } from './order_details';

interface StateProps {
    selectedTokenSymbol: string;
}

interface DispatchProps {
    onSubmitLimitOrder: (amount: BigNumber, price: BigNumber, side: OrderSide) => Promise<any>;
    onSubmitMarketOrder: (amount: BigNumber, side: OrderSide) => Promise<any>;
}

type Props = StateProps & DispatchProps;

enum OrderType {
    Limit,
    Market,
}

interface State {
    makerAmount: BigNumber;
    orderType: OrderType;
    price: BigNumber;
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

const TokenTextUppercase = styled(TokenText)`
    text-transform: uppercase;
`;

const TokenTextButtonUppercase = styled.span`
    text-transform: uppercase;
`;

class BuySell extends React.Component<Props, State> {
    public state = {
        makerAmount: new BigNumber(0),
        orderType: OrderType.Limit,
        price: new BigNumber(0),
        tab: OrderSide.Buy,
    };

    public render = () => {
        const { selectedTokenSymbol } = this.props;
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
                            <TokenTextUppercase>{selectedTokenSymbol}</TokenTextUppercase>
                        </TokenContainer>
                    </FieldContainer>
                    {orderType === OrderType.Limit && (
                        <>
                            <LabelContainer>
                                <Label>Token price</Label>
                            </LabelContainer>
                            <FieldContainer>
                                <BigInputNumberStyled
                                    decimals={0}
                                    min={new BigNumber(0)}
                                    onChange={this.updatePrice}
                                    value={price}
                                />
                                <TokenContainer>
                                    <TokenText>wETH</TokenText>
                                </TokenContainer>
                            </FieldContainer>
                        </>
                    )}
                    {orderType === OrderType.Limit ? <OrderDetailsContainer /> : null}
                    <Button theme="secondary" onClick={tab === OrderSide.Buy ? this.buy : this.sell}>
                        {tab === OrderSide.Buy ? 'Buy' : 'Sell'}{' '}
                        <TokenTextButtonUppercase>{selectedTokenSymbol}</TokenTextButtonUppercase>
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
        if (this.state.orderType === OrderType.Limit) {
            await this.props.onSubmitLimitOrder(this.state.makerAmount, this.state.price, OrderSide.Buy);
        } else {
            await this.props.onSubmitMarketOrder(this.state.makerAmount, OrderSide.Buy);
        }
        this._reset();
    };

    public sell = async () => {
        if (this.state.orderType === OrderType.Limit) {
            await this.props.onSubmitLimitOrder(this.state.makerAmount, this.state.price, OrderSide.Sell);
        } else {
            await this.props.onSubmitMarketOrder(this.state.makerAmount, OrderSide.Sell);
        }
        this._reset();
    };

    private readonly _reset = () => {
        this.setState({
            makerAmount: new BigNumber('0'),
            price: new BigNumber(0),
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
        selectedTokenSymbol: getSelectedTokenSymbol(state),
    };
};

const BuySellContainer = connect(
    mapStateToProps,
    {
        onSubmitLimitOrder: startBuySellLimitSteps,
        onSubmitMarketOrder: submitMarketOrder,
    },
)(BuySell);

export { BuySell, BuySellContainer };
