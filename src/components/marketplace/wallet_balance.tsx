import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import styled from 'styled-components';

import { METAMASK_EXTENSION_URL } from '../../common/constants';
import { getTokenBalance } from '../../services/tokens';
import { connectWallet } from '../../store/actions';
import { getBaseToken, getCurrencyPair, getEthAccount, getQuoteToken, getWeb3State } from '../../store/selectors';
import { errorsWallet } from '../../util/error_messages';
import { isWeth } from '../../util/known_tokens';
import { themeColors } from '../../util/theme';
import { tokenAmountInUnits } from '../../util/tokens';
import { CurrencyPair, StoreState, Token, Web3State } from '../../util/types';
import { Button } from '../common/button';
import { Card } from '../common/card';
import { ErrorCard, ErrorIcons, FontSize } from '../common/error_card';
import { IconType, Tooltip } from '../common/tooltip';

const LabelTitleWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 0 0 8px 0;
`;

const LabelTitle = styled.span`
    color: ${themeColors.lightGray};
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: normal;
    text-transform: uppercase;
`;

const LabelWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 8px 0;

    &:last-child {
        padding-bottom: 0;
    }
`;

const Label = styled.span`
    align-items: center;
    color: #000;
    display: flex;
    flex-shrink: 0;
    font-size: 16px;
    line-height: 1.2;
`;

const Value = styled.span`
    color: #000;
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
    text-align: right;
    white-space: nowrap;
`;

const WalletStatusBadge = styled.div<{ web3State?: Web3State }>`
    background-color: ${props =>
        props.web3State === Web3State.Done ? themeColors.green : themeColors.errorButtonBackground};
    border-radius: 50%;
    height: 8px;
    margin-right: 6px;
    width: 8px;
`;

const WalletStatusTitle = styled.h3`
    color: ${themeColors.textLight};
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

const ErrorCardStyled = styled(ErrorCard)`
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: 5;
`;

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

const WalletErrorFiller = styled.div<{ top?: string; bottom?: string; left?: string; right?: string }>`
    ${props => (props.bottom ? `bottom: ${props.bottom};` : '')}
    ${props => (props.left ? `left: ${props.left};` : '')}
    ${props => (props.right ? `right: ${props.right};` : '')}
    ${props => (props.top ? `top: ${props.top};` : '')}
    position: absolute;
    z-index: 1;
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
}

interface DispatchProps {
    onConnectWallet: () => any;
}

type Props = StateProps & DispatchProps;

interface State {
    quoteBalance: BigNumber;
    baseBalance: BigNumber;
}

const fillerBig = () => {
    return (
        <svg width="67" height="14" viewBox="0 0 67 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="67" height="14" rx="4" fill="#F9F9F9" />
        </svg>
    );
};

const fillerSmall = () => {
    return (
        <svg width="56" height="14" viewBox="0 0 56 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="56" height="14" rx="4" fill="#F9F9F9" />
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
    public state = {
        quoteBalance: new BigNumber('0.0'),
        baseBalance: new BigNumber('0.0'),
    };

    public componentDidMount = async () => {
        await this._updateState();
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>) => {
        const { onConnectWallet, currencyPair, ethAccount, quoteToken, baseToken, web3State } = this.props;
        if (
            prevProps.onConnectWallet !== onConnectWallet ||
            prevProps.currencyPair !== currencyPair ||
            prevProps.ethAccount !== ethAccount ||
            prevProps.quoteToken !== quoteToken ||
            prevProps.baseToken !== baseToken ||
            prevProps.web3State !== web3State
        ) {
            await this._updateState();
        }
    };

    public render = () => {
        const { web3State } = this.props;
        const walletContent = this._getWalletContent();
        return (
            <Card title={getWalletTitle(web3State)} action={getWallet(web3State)}>
                {walletContent}
            </Card>
        );
    };

    private readonly _updateState = async () => {
        const { baseToken, quoteToken, ethAccount } = this.props;
        if (quoteToken && baseToken && ethAccount) {
            const quoteBalanceProm = getTokenBalance(quoteToken, ethAccount);
            const baseBalanceProm = getTokenBalance(baseToken, ethAccount);
            const [quoteBalance, baseBalance] = await Promise.all([quoteBalanceProm, baseBalanceProm]);
            this.setState({
                quoteBalance,
                baseBalance,
            });
        }
    };

    private readonly _getWalletContent = () => {
        let content: any = null;
        const { web3State, currencyPair, onConnectWallet, quoteToken, baseToken } = this.props;

        if (web3State === Web3State.Done && quoteToken && baseToken) {
            const quoteBalanceString = tokenAmountInUnits(this.state.quoteBalance, quoteToken.decimals);
            const baseBalanceString = tokenAmountInUnits(this.state.baseBalance, baseToken.decimals);
            const toolTip = isWeth(quoteToken) ? (
                <TooltipStyled
                    description="ETH cannot be traded with other tokens directly.<br />You need to convert it to WETH first.<br />WETH can be converted back to ETH at any time."
                    iconType={IconType.Fill}
                />
            ) : null;
            content = (
                <>
                    <LabelTitleWrapper>
                        <LabelTitle>Token</LabelTitle>
                        <LabelTitle>Amount</LabelTitle>
                    </LabelTitleWrapper>
                    <LabelWrapper>
                        <Label>{currencyPair.base}</Label>
                        <Value>{baseBalanceString}</Value>
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>
                            {currencyPair.quote}
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
                        text={errorsWallet.mmConnect}
                        textAlign="center"
                        onClick={onConnectWallet}
                    />
                    <WalletErrorFiller top="0" left="0">
                        {fillerBig()}
                    </WalletErrorFiller>
                    <WalletErrorFiller top="0" right="0">
                        {fillerBig()}
                    </WalletErrorFiller>
                    <WalletErrorFiller bottom="0" left="0">
                        {fillerSmall()}
                    </WalletErrorFiller>
                    <WalletErrorFiller bottom="0" right="0">
                        {fillerSmall()}
                    </WalletErrorFiller>
                </WalletErrorContainer>
            );
        }

        if (web3State === Web3State.NotInstalled) {
            content = (
                <>
                    <WalletErrorText>Install Metamask wallet to make trades.</WalletErrorText>
                    <ButtonStyled theme={'tertiary'} onClick={openMetamaskExtensionUrl}>
                        {errorsWallet.mmGetExtension}
                    </ButtonStyled>
                </>
            );
        }

        if (web3State === Web3State.Loading) {
            content = (
                <>
                    <WalletErrorText>{errorsWallet.mmLoading}</WalletErrorText>
                    <ButtonStyled theme={'tertiary'} onClick={openMetamaskExtensionUrl}>
                        {errorsWallet.mmConnect}
                    </ButtonStyled>
                </>
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
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    return {
        onConnectWallet: () => dispatch(connectWallet()),
    };
};

const WalletBalanceContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WalletBalance);

export { WalletBalance, WalletBalanceContainer };
