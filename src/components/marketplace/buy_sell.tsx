import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { submitOrder } from '../../store/actions';
import { getSelectedTokenSymbol } from '../../store/selectors';
import { OrderSide, StoreState } from '../../util/types';
import { BigNumberInput } from '../common/big_number_input';
import { Card } from '../common/card';

enum Tab {
    Buy,
    Sell,
}

interface StateProps {
    selectedTokenSymbol: string;
}
interface DispatchProps {
    onSubmitOrder: (amount: BigNumber, price: number, side: OrderSide) => Promise<any>;
}
type Props = StateProps & DispatchProps;

enum OrderType {
    Market,
    Limit,
}

interface State {
    makerAmount: BigNumber;
    price: number;
    tab: Tab;
    orderType: OrderType;
}

const Content = styled.div`
    padding: 10px 18px;
`;

const TabButton = styled.div<{ isSelected: boolean }>`
    display: inline-block;
    width: 50%;
    cursor: pointer;
    text-align: center;
    padding: 1rem 0;

    font-weight: ${props => (props.isSelected ? 'bold' : 'normal')}
    background-color: ${props => (props.isSelected ? 'white' : '#f9f9f9')}
    border-bottom: ${props => (props.isSelected ? '0' : '1px solid #dedede')}
`;

const BuyTab = styled(TabButton)`
    border-right: ${props => (props.isSelected ? '0' : '1px solid #dedede')};
`;
const SellTab = styled(TabButton)`
    border-left: ${props => (props.isSelected ? '0' : '1px solid #dedede')};
`;

class BuySell extends React.Component<Props, State> {
    public state = {
        makerAmount: new BigNumber(0),
        price: 0,
        tab: Tab.Buy,
        orderType: OrderType.Limit,
    };

    public render = () => {
        const { selectedTokenSymbol } = this.props;
        const { makerAmount, price, tab, orderType } = this.state;

        return (
            <Card>
                <BuyTab isSelected={tab === Tab.Buy} onClick={this.changeTab(Tab.Buy)}>
                    Buy
                </BuyTab>
                <SellTab isSelected={tab === Tab.Sell} onClick={this.changeTab(Tab.Sell)}>
                    Sell
                </SellTab>
                <Content>
                    <div>
                        <label>
                            I want to {tab === Tab.Buy ? 'buy' : 'sell'}
                            <BigNumberInput
                                value={makerAmount}
                                min={new BigNumber(0)}
                                onChange={this.updateMakerAmount}
                                decimals={18}
                            />
                            {selectedTokenSymbol}
                            <div style={{ display: 'inline-block' }}>
                                &nbsp;&nbsp;&nbsp;
                                <span
                                    style={{ fontWeight: orderType === OrderType.Market ? 'bold' : 'normal' }}
                                    onClick={this._switchToMarket}
                                >
                                    Market
                                </span>
                                /
                                <span
                                    style={{ fontWeight: orderType === OrderType.Limit ? 'bold' : 'normal' }}
                                    onClick={this._switchToLimit}
                                >
                                    Limit
                                </span>
                            </div>
                        </label>
                    </div>
                    <div>
                        <label>
                            Token price
                            <input type="number" value={price} min={0} onChange={this.updatePrice} />
                            <span>wETH</span>
                        </label>
                    </div>
                    <button onClick={tab === Tab.Buy ? this.buy : this.sell}>
                        {tab === Tab.Buy ? 'Buy' : 'Sell'} {selectedTokenSymbol}
                    </button>
                </Content>
            </Card>
        );
    };

    public changeTab = (tab: Tab) => () => this.setState({ tab });

    public updateMakerAmount = (newValue: BigNumber) => {
        this.setState({
            makerAmount: newValue,
        });
    };

    public updatePrice: React.ReactEventHandler<HTMLInputElement> = e => {
        const price = parseFloat(e.currentTarget.value);

        this.setState({ price });
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
