// tslint:disable-next-line: no-implicit-dependencies
import { BigNumber } from '@0x/utils';
import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import { TX_DEFAULTS_TRANSFER } from '../../common/constants';
import { themeDimensions } from '../../themes/commons';
import { tokenAmountInUnits, tokenSymbolToDisplayString } from '../../util/tokens';
import { ButtonIcons, ButtonVariant, iTokenData, Token, TokenBalance } from '../../util/types';
import { BigNumberInput } from '../common/big_number_input';
import { Button } from '../common/button';
import { ErrorCard, ErrorIcons, FontSize } from '../common/error_card';
import { CloseModalButton } from '../common/icons/close_modal_button';

interface State {
    amount: BigNumber | null;
    error: {
        btnMsg: string | null;
        cardMsg: string | null;
    };
}

interface Props extends React.ComponentProps<typeof Modal> {
    isSubmitting: boolean;
    onSubmit: (amount: BigNumber, token: Token, iToken: iTokenData, isEth: boolean, isLending: boolean) => any;
    tokenBalance: TokenBalance;
    iToken: iTokenData;
    isOpen: boolean;
    closeModal: () => any;
    ethBalance: BigNumber;
    isEth: boolean;
    isLending: boolean;
    wethToken: Token;
}

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow: auto;
    width: 410px;
`;

const ModalTitle = styled.h1`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

const ButtonStyled = styled(Button)`
    width: 100%;
    margin: 10px;
`;

const FieldContainer = styled.div`
    height: ${themeDimensions.fieldHeight};
    margin-bottom: 25px;
    width: 100%;
    position: relative;
`;

const LabelContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
`;

const AmountContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
`;

const AmountLabel = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
    align-text: left;
    text-decoration: underline;
    cursor: pointer;
`;

const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
    align-text: left;
`;

const BigInputNumberStyled = styled<any>(BigNumberInput)`
    background-color: ${props => props.theme.componentsTheme.textInputBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.textInputBorderColor};
    color: ${props => props.theme.componentsTheme.textInputTextColor};
    font-feature-settings: 'tnum' 1;
    font-size: 14px;
    height: 100%;
    padding-left: 14px;
    padding-right: 60px;
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

class LendingTokenModal extends React.Component<Props, State> {
    public state: State = {
        amount: null,
        error: {
            btnMsg: null,
            cardMsg: null,
        },
    };
    public componentDidMount = () => {
        const { ethBalance } = this.props;
        if (ethBalance.isLessThan(TX_DEFAULTS_TRANSFER.gasTransferToken)) {
            this.setState({
                error: {
                    btnMsg: 'Error',
                    cardMsg: `Not enough ETH for the gas`,
                },
            });
        }
    };

    public render = () => {
        const { tokenBalance, closeModal, ethBalance, isEth, wethToken, iToken, isLending, ...restProps } = this.props;
        const { error, amount } = this.state;
        const { supplyInterestRate } = iToken;
        let coinSymbol;
        let maxBalance;
        let decimals;
        let displayDecimals;

        if (isEth) {
            displayDecimals = wethToken.displayDecimals;
            decimals = 18;
            maxBalance = isLending ? ethBalance : iToken.balance;
            coinSymbol = tokenSymbolToDisplayString('ETH');
        } else if (tokenBalance) {
            const { token, balance } = tokenBalance;
            displayDecimals = token.displayDecimals;
            decimals = token.decimals;
            maxBalance = isLending ? balance : iToken.balance;
            coinSymbol = tokenSymbolToDisplayString(token.symbol);
        } else {
            return null;
        }
        const btnPrefix = isLending ? 'Lend ' : 'Unlend ';
        const balanceInUnits = tokenAmountInUnits(maxBalance, decimals, displayDecimals);
        const btnText = error && error.btnMsg ? 'Error' : btnPrefix + coinSymbol;
        const isSubmitAllowed = amount === null || (amount && amount.isGreaterThan(maxBalance));

        const content = (
            <>
                <ModalTitle>
                    {isLending ? 'Lending' : 'Unlending'} {coinSymbol}
                </ModalTitle>
                <LabelContainer>
                    <Label>Interest APR: {supplyInterestRate.div('1e18').toFixed(5)} %</Label>
                </LabelContainer>
                <AmountContainer>
                    <AmountLabel onClick={this.setMax}>Amount: {balanceInUnits}</AmountLabel>
                </AmountContainer>
                <FieldContainer>
                    <BigInputNumberStyled
                        decimals={decimals}
                        min={0}
                        max={maxBalance}
                        onChange={this.updateAmount}
                        value={amount}
                        step={new BigNumber(1).div(new BigNumber(10).pow(displayDecimals))}
                        placeholder={new BigNumber(1).div(new BigNumber(10).pow(displayDecimals)).toString()}
                        valueFixedDecimals={displayDecimals}
                    />
                    <BigInputNumberTokenLabel tokenSymbol={coinSymbol} />
                </FieldContainer>
                <ButtonStyled
                    disabled={isSubmitAllowed}
                    icon={error && error.btnMsg ? ButtonIcons.Warning : undefined}
                    onClick={this.submit}
                    variant={error && error.btnMsg ? ButtonVariant.Error : ButtonVariant.Buy}
                >
                    {btnText}
                </ButtonStyled>
                {error && error.cardMsg ? (
                    <ErrorCard fontSize={FontSize.Large} text={error.cardMsg} icon={ErrorIcons.Sad} />
                ) : null}
            </>
        );

        return (
            <Modal {...restProps}>
                <CloseModalButton onClick={closeModal} />
                <ModalContent>{content}</ModalContent>
            </Modal>
        );
    };
    public updateAmount = (newValue: BigNumber) => {
        this.setState({
            amount: newValue,
        });
    };
    public setMax = () => {
        const { tokenBalance, isEth, ethBalance, isLending, iToken } = this.props;
        if (isEth) {
            const maxBalance = isLending ? ethBalance : iToken.balance;
            this.setState({
                amount: maxBalance,
            });
        } else if (tokenBalance) {
            this.setState({
                amount: isLending ? tokenBalance.balance : iToken.balance,
            });
        }
    };

    public _closeModal = () => {
        this._reset();
    };

    public submit = async () => {
        const { tokenBalance, isEth, wethToken, iToken, isLending } = this.props;
        let token: Token;
        if (isEth) {
            token = {
                ...wethToken,
                symbol: 'ETH',
            };
        } else if (tokenBalance) {
            token = tokenBalance.token;
        } else {
            return null;
        }
        const amount = this.state.amount || new BigNumber(0);
        this.props.onSubmit(amount, token, iToken, isEth, isLending);
    };

    private readonly _reset = () => {
        this.setState({
            amount: null,
        });
    };
}

export { LendingTokenModal };
