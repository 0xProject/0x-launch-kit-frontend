// tslint:disable-next-line: no-implicit-dependencies
import { addressUtils, BigNumber } from '@0x/utils';
import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import { TX_DEFAULTS_TRANSFER } from '../../common/constants';
import { themeDimensions } from '../../themes/commons';
import { tokenAmountInUnits, tokenSymbolToDisplayString } from '../../util/tokens';
import { ButtonIcons, ButtonVariant, Token, TokenBalance } from '../../util/types';
import { BigNumberInput } from '../common/big_number_input';
import { Button } from '../common/button';
import { ErrorCard, ErrorIcons, FontSize } from '../common/error_card';
import { CloseModalButton } from '../common/icons/close_modal_button';
import { TextInput } from '../common/text_input';

interface State {
    amount: BigNumber | null;
    address: string | null;
    error: {
        btnMsg: string | null;
        cardMsg: string | null;
    };
}

interface Props extends React.ComponentProps<typeof Modal> {
    isSubmitting: boolean;
    onSubmit: (amount: BigNumber, token: Token, address: string, isEth: boolean) => any;
    tokenBalance: TokenBalance | null;
    isOpen: boolean;
    closeModal: () => any;
    ethBalance: BigNumber;
    isEth: boolean;
    wethToken: Token;
}

const TIMEOUT_BTN_ERROR = 2000;
const TIMEOUT_CARD_ERROR = 4000;

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

const TextInputStyled = styled<any>(TextInput)`
    background-color: ${props => props.theme.componentsTheme.textInputBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.textInputBorderColor};
    color: ${props => props.theme.componentsTheme.textInputTextColor};
    font-feature-settings: 'tnum' 1;
    font-size: 14px;
    height: 100%;
    padding-left: 14px;
    padding-right: 14px;
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

class TransferTokenModal extends React.Component<Props, State> {
    public state: State = {
        amount: null,
        address: null,
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
        const { tokenBalance, closeModal, ethBalance, isEth, wethToken, ...restProps } = this.props;
        const { error, address, amount } = this.state;
        let coinSymbol;
        let maxBalance;
        let decimals;
        let displayDecimals;

        if (isEth) {
            displayDecimals = wethToken.displayDecimals;
            decimals = 18;
            maxBalance = ethBalance;
            coinSymbol = tokenSymbolToDisplayString('ETH');
        } else if (tokenBalance) {
            const { token, balance } = tokenBalance;
            displayDecimals = token.displayDecimals;
            decimals = token.decimals;
            maxBalance = balance;
            coinSymbol = tokenSymbolToDisplayString(token.symbol);
        } else {
            return null;
        }
        const btnPrefix = 'Send ';
        const balanceInUnits = tokenAmountInUnits(maxBalance, decimals, displayDecimals);
        const btnText = error && error.btnMsg ? 'Error' : btnPrefix + coinSymbol;
        const isSubmitAllowed = amount === null || (amount && amount.isGreaterThan(maxBalance)) || address === null;

        const content = (
            <>
                <ModalTitle>Send {coinSymbol}</ModalTitle>
                <LabelContainer>
                    <Label>To</Label>
                </LabelContainer>
                <FieldContainer>
                    <TextInputStyled onChange={this.updateAddress} value={address} placeholder={'Insert Address'} />
                </FieldContainer>
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
        const { tokenBalance, isEth, ethBalance } = this.props;
        if (isEth) {
            const maxBalance = ethBalance;
            this.setState({
                amount: maxBalance,
            });
        } else if (tokenBalance) {
            this.setState({
                amount: tokenBalance.balance,
            });
        }
    };

    public updateAddress = (address: string) => {
        this.setState({ address });
    };

    public _closeModal = () => {
        this._reset();
    };

    public submit = async () => {
        const { tokenBalance, isEth, wethToken } = this.props;
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
        const address = this.state.address || ' ';
        const isAddress = addressUtils.isAddress(address);
        const amount = this.state.amount || new BigNumber(0);
        if (isAddress) {
            this.props.onSubmit(amount, token, address, isEth);
        } else {
            this.setState(
                {
                    error: {
                        btnMsg: 'Error',
                        cardMsg: `Address not valid`,
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
    };

    private readonly _reset = () => {
        this.setState({
            amount: null,
            address: null,
        });
    };
}

export { TransferTokenModal };
