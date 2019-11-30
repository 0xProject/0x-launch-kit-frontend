import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { fetchBaseTokenIEO, initWallet, startBuySellLimitIEOSteps } from '../../../store/actions';
import { fetchTakerAndMakerFeeIEO } from '../../../store/relayer/actions';
import {
    getBaseTokenBalanceIEO,
    getBaseTokenIEO,
    getCurrencyPair,
    getEthAccount,
    getOrderPriceSelected,
    getWeb3State,
    getWethTokenBalance,
} from '../../../store/selectors';
import { themeDimensions } from '../../../themes/commons';
import { getKnownTokensIEO } from '../../../util/known_tokens_ieo';
import { tokenSymbolToDisplayString, unitsInTokenAmount } from '../../../util/tokens';
import {
    ButtonIcons,
    ButtonVariant,
    CurrencyPair,
    OrderSide,
    OrderType,
    StoreState,
    Token,
    TokenBalance,
    TokenBalanceIEO,
    TokenIEO,
    Web3State,
} from '../../../util/types';
import { BigNumberInput } from '../../common/big_number_input';
import { Button } from '../../common/button';
import { Card } from '../../common/card';
import { CardBase } from '../../common/card_base';
import { CardTabSelector } from '../../common/card_tab_selector';
import { EmptyContent } from '../../common/empty_content';
import { ErrorCard, ErrorIcons, FontSize } from '../../common/error_card';

import { IEOOrderDetailsContainer } from './ieo_order_details';

interface StateProps {
    web3State: Web3State;
    baseToken: TokenIEO | null;
    ethAccount: string;
    baseTokenBalance: TokenBalanceIEO | null;
    wethTokenBalance: TokenBalance | null;
    currencyPair: CurrencyPair;
    orderPriceSelected: BigNumber | null;
}

interface DispatchProps {
    onSubmitLimitOrder: (
        amount: BigNumber,
        price: BigNumber,
        side: OrderSide,
        makerFee: BigNumber,
        baseToken: Token,
        quoteToken: Token,
    ) => Promise<any>;
    onConnectWallet: () => any;
    onFetchTakerAndMakerFee: (amount: BigNumber, price: BigNumber, side: OrderSide) => Promise<any>;
    onFetchBaseTokenIEO: (token: TokenIEO) => Promise<any>;
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

const MinLabel = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 10px;
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

const parsedUrl = new URL(window.location.href.replace('#/', ''));
const tokenName = parsedUrl.searchParams.get('token');
const symbol = parsedUrl.searchParams.get('symbol');
const bot = parsedUrl.searchParams.get('bot');

class IEOOrder extends React.Component<Props, State> {
    public state: State = {
        makerAmount: null,
        price: null,
        orderType: OrderType.Limit,
        tab: OrderSide.Sell,
        error: {
            btnMsg: null,
            cardMsg: null,
        },
    };

    public componentDidMount = async () => {
        const known_tokens = getKnownTokensIEO();
        let token;
        if (tokenName) {
            bot
                ? (token = known_tokens.getTokenBotByName(tokenName))
                : (token = known_tokens.getTokenByName(tokenName));
            await this.props.onFetchBaseTokenIEO(token);
        }
        if (symbol) {
            bot ? (token = known_tokens.getTokenBotBySymbol(symbol)) : (token = known_tokens.getTokenBySymbol(symbol));
            await this.props.onFetchBaseTokenIEO(token);
        }

        if (!token) {
            const tokens = known_tokens.getTokens();
            await this.props.onFetchBaseTokenIEO(tokens[0]);
        }
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>) => {
        const newProps = this.props;
        if (newProps.orderPriceSelected !== prevProps.orderPriceSelected && this.state.orderType === OrderType.Limit) {
            this.setState({
                price: newProps.orderPriceSelected,
            });
        }
        if (newProps.ethAccount !== prevProps.ethAccount) {
            const known_tokens = getKnownTokensIEO();
            let token;
            if (tokenName) {
                bot
                    ? (token = known_tokens.getTokenBotByName(tokenName))
                    : (token = known_tokens.getTokenByName(tokenName));
                await this.props.onFetchBaseTokenIEO(token);
            }
            if (symbol) {
                bot
                    ? (token = known_tokens.getTokenBotBySymbol(symbol))
                    : (token = known_tokens.getTokenBySymbol(symbol));
                await this.props.onFetchBaseTokenIEO(token);
            }

            if (!token) {
                const tokens = known_tokens.getTokens();
                await this.props.onFetchBaseTokenIEO(tokens[0]);
            }
        }
    };

    public render = () => {
        const { web3State, wethTokenBalance, baseToken, ethAccount } = this.props;
        const { makerAmount, price, tab, orderType, error } = this.state;
        if (!wethTokenBalance || !baseToken) {
            return (
                <Card>
                    <EmptyContent alignAbsoluteCenter={true} text="There are nothing to sow" />
                </Card>
            );
        }
        if (!baseToken.owners.map(o => o.toLowerCase()).includes(ethAccount)) {
            return (
                <Card>
                    <EmptyContent alignAbsoluteCenter={true} text="You are not authorized to be here" />
                </Card>
            );
        }

        const quoteToken = wethTokenBalance.token;
        const buySellInnerTabs = [
            {
                active: orderType === OrderType.Limit,
                onClick: this._switchToLimit,
                text: 'Limit',
            },
        ];
        const decimals = baseToken.decimals;
        // Configs Hardcoded for now
        const pricePrecision = 12;
        const basePrecision = 8;
        const minAmount = new BigNumber(1).div(new BigNumber(10).pow(basePrecision)).toString();
        const minAmountUnits = unitsInTokenAmount(minAmount, decimals);
        const stepAmount = new BigNumber(1).div(new BigNumber(10).pow(basePrecision));
        const stepAmountUnits = unitsInTokenAmount(String(stepAmount), decimals);

        const amount = makerAmount || minAmountUnits;
        const isMakerAmountEmpty = amount === null || amount.isZero();

        const isPriceEmpty = price === null || price.isZero();
        const isPriceMin =
            price === null || price.isLessThan(new BigNumber(1).div(new BigNumber(10).pow(pricePrecision)));
        const isOrderTypeLimitIsEmpty =
            orderType === OrderType.Limit && (isMakerAmountEmpty || isPriceEmpty || isPriceMin);

        const btnPrefix = tab === OrderSide.Buy ? 'Buy ' : 'Sell ';
        const btnText = error && error.btnMsg ? 'Error' : btnPrefix + tokenSymbolToDisplayString(baseToken.symbol);

        return (
            <>
                <BuySellWrapper>
                    <TabsContainer>
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
                            <Label>
                                Amount <MinLabel>(Min: {minAmount})</MinLabel>
                            </Label>
                            <InnerTabs tabs={buySellInnerTabs} />
                        </LabelContainer>
                        <FieldContainer>
                            <BigInputNumberStyled
                                decimals={decimals}
                                min={new BigNumber(0)}
                                onChange={this.updateMakerAmount}
                                value={amount}
                                step={stepAmountUnits}
                                placeholder={new BigNumber(minAmount).toString()}
                                valueFixedDecimals={basePrecision}
                            />
                            <BigInputNumberTokenLabel tokenSymbol={baseToken.symbol} />
                        </FieldContainer>
                        <LabelContainer>
                            <Label>Price per token</Label>
                        </LabelContainer>
                        <FieldContainer>
                            <BigInputNumberStyled
                                decimals={0}
                                min={new BigNumber(0)}
                                onChange={this.updatePrice}
                                value={price}
                                step={new BigNumber(1).div(new BigNumber(10).pow(pricePrecision))}
                                placeholder={new BigNumber(1).div(new BigNumber(10).pow(pricePrecision)).toString()}
                                valueFixedDecimals={pricePrecision}
                            />
                            <BigInputNumberTokenLabel tokenSymbol={quoteToken.symbol} />
                        </FieldContainer>
                        <IEOOrderDetailsContainer
                            orderType={orderType}
                            orderSide={tab}
                            tokenAmount={amount}
                            tokenPrice={price || new BigNumber(0)}
                            quoteToken={quoteToken}
                            baseToken={baseToken}
                        />
                        <Button
                            disabled={web3State !== Web3State.Done || isOrderTypeLimitIsEmpty}
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
        const { baseToken, wethTokenBalance } = this.props;
        if (!wethTokenBalance || !baseToken) {
            return;
        }
        const quoteToken = wethTokenBalance.token;
        const orderSide = this.state.tab;
        const makerAmount = this.state.makerAmount || new BigNumber(0.000001);
        const price = this.state.price || new BigNumber(0);
        const { makerFee } = await this.props.onFetchTakerAndMakerFee(makerAmount, price, this.state.tab);
        await this.props.onSubmitLimitOrder(makerAmount, price, orderSide, makerFee, baseToken, quoteToken);
        this._reset();
    };

    private readonly _reset = () => {
        this.setState({
            makerAmount: null,
            price: null,
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
        ethAccount: getEthAccount(state),
        baseToken: getBaseTokenIEO(state),
        baseTokenBalance: getBaseTokenBalanceIEO(state),
        wethTokenBalance: getWethTokenBalance(state),
        currencyPair: getCurrencyPair(state),
        orderPriceSelected: getOrderPriceSelected(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onSubmitLimitOrder: (
            amount: BigNumber,
            price: BigNumber,
            side: OrderSide,
            makerFee: BigNumber,
            baseToken: Token,
            quoteToken: Token,
        ) => dispatch(startBuySellLimitIEOSteps(amount, price, side, makerFee, baseToken, quoteToken)),
        onConnectWallet: () => dispatch(initWallet()),
        onFetchBaseTokenIEO: (token: TokenIEO) => dispatch(fetchBaseTokenIEO(token)),
        onFetchTakerAndMakerFee: (amount: BigNumber, price: BigNumber, side: OrderSide) =>
            dispatch(fetchTakerAndMakerFeeIEO(amount, price, side)),
    };
};

const IEOOrderContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(IEOOrder);

export { IEOOrder, IEOOrderContainer };
