import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { METAMASK_EXTENSION_URL } from '../../../common/constants';
import { initWallet } from '../../../store/actions';
import {
    getBaseToken,
    getBaseTokenBalance,
    getCurrencyPair,
    getEthAccount,
    getQuoteToken,
    getQuoteTokenBalance,
    getTotalEthBalance,
    getWeb3State,
} from '../../../store/selectors';
import { errorsWallet } from '../../../util/error_messages';
import { isWeth } from '../../../util/known_tokens';
import { tokenAmountInUnits, tokenSymbolToDisplayString } from '../../../util/tokens';
import { ButtonVariant, CurrencyPair, StoreState, Token, TokenBalance, Web3State } from '../../../util/types';
import { Button } from '../../common/button';
import { Card } from '../../common/card';
import { ErrorCard, ErrorIcons, FontSize } from '../../common/error_card';
import { IconType, Tooltip } from '../../common/tooltip';

const LabelWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 8px 0;
`;

const Label = styled.span`
    align-items: center;
    color: ${props => props.theme.componentsTheme.textColorCommon};
    display: flex;
    flex-shrink: 0;
    font-size: 16px;
    line-height: 1.2;
`;

const Value = styled.span`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-feature-settings: 'tnum' 1;
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
    text-align: right;
    white-space: nowrap;
`;

const WalletStatusBadge = styled.div<{ web3State?: Web3State }>`
    background-color: ${props =>
        props.web3State === Web3State.Done
            ? props.theme.componentsTheme.green
            : props.theme.componentsTheme.errorButtonBackground};
    border-radius: 50%;
    height: 8px;
    margin-right: 6px;
    width: 8px;
`;

const WalletStatusTitle = styled.h3`
    color: ${props => props.theme.componentsTheme.textLight};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    padding: 0;
    text-align: right;
`;

const WalletStatusContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const TooltipStyled = styled(Tooltip)`
    margin-left: 10px;
`;

interface ErrorCardStyledProps {
    cursor?: string;
}

const ErrorCardStyled = styled(ErrorCard)<ErrorCardStyledProps>`
    cursor: ${props => props.cursor};
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: 5;
`;

ErrorCardStyled.defaultProps = {
    cursor: 'pointer',
};

const WalletErrorContainer = styled.div`
    height: 140px;
    position: relative;
`;

const WalletErrorText = styled.p`
    font-size: 16px;
    font-weight: normal;
    line-height: 23px;
    margin: 0;
    padding: 20px 0;
`;

const SimplifiedTextBox = styled.div<{ top?: string; bottom?: string; left?: string; right?: string }>`
    ${props => (props.bottom ? `bottom: ${props.bottom};` : '')}
    ${props => (props.left ? `left: ${props.left};` : '')}
    ${props => (props.right ? `right: ${props.right};` : '')}
    ${props => (props.top ? `top: ${props.top};` : '')}
    position: absolute;
    z-index: 1;

    rect {
        fill: ${props => props.theme.componentsTheme.simplifiedTextBoxColor};
    }
`;

const ButtonStyled = styled(Button)`
    width: 100%;
`;

interface StateProps {
    web3State: Web3State;
    currencyPair: CurrencyPair;
    baseToken: Token | null;
    quoteToken: Token | null;
    ethAccount: string;
    baseTokenBalance: TokenBalance | null;
    quoteTokenBalance: TokenBalance | null;
    totalEthBalance: BigNumber;
}

interface DispatchProps {
    onConnectWallet: () => any;
}

type Props = StateProps & DispatchProps;

interface State {
    quoteBalance: BigNumber;
    baseBalance: BigNumber;
}

const simplifiedTextBoxBig = () => {
    return (
        <svg width="67" height="14" viewBox="0 0 67 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="67" height="14" rx="4" />
        </svg>
    );
};

const simplifiedTextBoxSmall = () => {
    return (
        <svg width="56" height="14" viewBox="0 0 56 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="56" height="14" rx="4" />
        </svg>
    );
};

const getWalletName = () => {
    return 'MetaMask';
};

const getWallet = (web3State: Web3State) => {
    return (
        <WalletStatusContainer>
            <WalletStatusBadge web3State={web3State} />
            <WalletStatusTitle>{getWalletName()}</WalletStatusTitle>
        </WalletStatusContainer>
    );
};

const getWalletTitle = (web3State: Web3State) => {
    let title = 'Wallet Balance';

    if (web3State === Web3State.NotInstalled) {
        title = 'No wallet found';
    }

    return title;
};

const openMetamaskExtensionUrl = () => {
    const win = window.open(METAMASK_EXTENSION_URL, '_blank');
    if (win) {
        win.focus();
    }
};

class WalletBalance extends React.Component<Props, State> {
    public render = () => {
        const { web3State } = this.props;
        const walletContent = this._getWalletContent();
        return (
            <Card title={getWalletTitle(web3State)} action={getWallet(web3State)} minHeightBody={'0px'}>
                {walletContent}
            </Card>
        );
    };

    private readonly _getWalletContent = () => {
        let content: any = null;
        const {
            web3State,
            currencyPair,
            onConnectWallet,
            quoteToken,
            quoteTokenBalance,
            baseTokenBalance,
            totalEthBalance,
        } = this.props;

        if (quoteToken && baseTokenBalance && quoteTokenBalance) {
            const quoteTokenBalanceAmount = isWeth(quoteToken.symbol) ? totalEthBalance : quoteTokenBalance.balance;
            const quoteBalanceString = tokenAmountInUnits(
                quoteTokenBalanceAmount,
                quoteToken.decimals,
                quoteToken.displayDecimals,
            );
            const baseBalanceString = tokenAmountInUnits(
                baseTokenBalance.balance,
                baseTokenBalance.token.decimals,
                baseTokenBalance.token.displayDecimals,
            );
            const toolTip = isWeth(quoteToken.symbol) ? (
                <TooltipStyled description="Showing ETH + wETH balance" iconType={IconType.Fill} />
            ) : null;
            const quoteTokenLabel = isWeth(quoteToken.symbol) ? 'ETH' : tokenSymbolToDisplayString(currencyPair.quote);
            content = (
                <>
                    <LabelWrapper>
                        <Label>{tokenSymbolToDisplayString(currencyPair.base)}</Label>
                        <Value>{baseBalanceString}</Value>
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>
                            {quoteTokenLabel}
                            {toolTip}
                        </Label>
                        <Value>{quoteBalanceString}</Value>
                    </LabelWrapper>
                </>
            );
        }

        if (web3State === Web3State.Locked) {
            content = (
                <WalletErrorContainer>
                    <ErrorCardStyled
                        fontSize={FontSize.Large}
                        icon={ErrorIcons.Lock}
                        onClick={onConnectWallet}
                        text={errorsWallet.mmConnect}
                        textAlign="center"
                    />
                    <SimplifiedTextBox top="0" left="0">
                        {simplifiedTextBoxBig()}
                    </SimplifiedTextBox>
                    <SimplifiedTextBox top="0" right="0">
                        {simplifiedTextBoxBig()}
                    </SimplifiedTextBox>
                    <SimplifiedTextBox bottom="0" left="0">
                        {simplifiedTextBoxSmall()}
                    </SimplifiedTextBox>
                    <SimplifiedTextBox bottom="0" right="0">
                        {simplifiedTextBoxSmall()}
                    </SimplifiedTextBox>
                </WalletErrorContainer>
            );
        }

        if (web3State === Web3State.NotInstalled) {
            content = (
                <>
                    <WalletErrorText>Install Metamask wallet to make trades.</WalletErrorText>
                    <ButtonStyled variant={ButtonVariant.Tertiary} onClick={openMetamaskExtensionUrl}>
                        {errorsWallet.mmGetExtension}
                    </ButtonStyled>
                </>
            );
        }

        if (web3State === Web3State.Loading) {
            content = (
                <>
                    <ButtonStyled variant={ButtonVariant.Tertiary}>{errorsWallet.mmLoading}</ButtonStyled>
                </>
            );
        }

        if (web3State === Web3State.Error) {
            content = (
                <WalletErrorContainer>
                    <ErrorCardStyled
                        cursor={'default'}
                        fontSize={FontSize.Large}
                        icon={ErrorIcons.Warning}
                        text={errorsWallet.mmWrongNetwork}
                        textAlign="center"
                    />
                    <SimplifiedTextBox top="0" left="0">
                        {simplifiedTextBoxBig()}
                    </SimplifiedTextBox>
                    <SimplifiedTextBox top="0" right="0">
                        {simplifiedTextBoxBig()}
                    </SimplifiedTextBox>
                    <SimplifiedTextBox bottom="0" left="0">
                        {simplifiedTextBoxSmall()}
                    </SimplifiedTextBox>
                    <SimplifiedTextBox bottom="0" right="0">
                        {simplifiedTextBoxSmall()}
                    </SimplifiedTextBox>
                </WalletErrorContainer>
            );
        }

        return content;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
        currencyPair: getCurrencyPair(state),
        baseToken: getBaseToken(state),
        quoteToken: getQuoteToken(state),
        ethAccount: getEthAccount(state),
        quoteTokenBalance: getQuoteTokenBalance(state),
        baseTokenBalance: getBaseTokenBalance(state),
        totalEthBalance: getTotalEthBalance(state),
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onConnectWallet: () => dispatch(initWallet()),
    };
};

const WalletBalanceContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WalletBalance);

export { WalletBalance, WalletBalanceContainer };
