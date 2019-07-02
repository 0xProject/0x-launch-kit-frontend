import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { startToggleTokenLockSteps } from '../../store/actions';
import { getEthAccount, getEthBalance, getTokenBalances, getWeb3State, getWethTokenBalance } from '../../store/selectors';
import { getEtherscanLinkForToken, getEtherscanLinkForTokenAndAddress, tokenAmountInUnits } from '../../util/tokens';
import { StoreState, Token, TokenBalance, Web3State } from '../../util/types';
import { Card } from '../common/card';
import { TokenIcon } from '../common/icons/token_icon';
import { LoadingWrapper } from '../common/loading';
import { CustomTD, Table, TH, THead, THLast, TR } from '../common/table';

interface StateProps {
    ethBalance: BigNumber;
    tokenBalances: TokenBalance[];
    web3State: Web3State;
    wethTokenBalance: TokenBalance | null;
    ethAccount: string;
}

interface DispatchProps {
    onStartToggleTokenLockSteps: (token: Token, isUnlocked: boolean) => void;
}

type Props = StateProps & DispatchProps;

const THStyled = styled(TH)`
    &:first-child {
        padding-right: 0;
    }
`;

const TokenTD = styled(CustomTD)`
    padding-bottom: 10px;
    padding-right: 0;
    padding-top: 10px;
    width: 40px;
`;

const TokenIconStyled = styled(TokenIcon)`
    margin: 0 auto 0 0;
`;

const CustomTDTokenName = styled(CustomTD)`
    white-space: nowrap;
`;

const TokenEtherscanLink = styled.a`
    align-items: center;
    color: ${props => props.theme.componentsTheme.myWalletLinkColor};
    display: flex;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const QuantityEtherscanLink = styled.a`
    align-items: center;
    color: ${props => props.theme.componentsTheme.myWalletLinkColor};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const CustomTDLockIcon = styled(CustomTD)`
    .lockedIcon {
        path {
            fill: ${props => props.theme.componentsTheme.iconLockedColor};
        }
    }

    .unlockedIcon {
        path {
            fill: ${props => props.theme.componentsTheme.iconUnlockedColor};
        }
    }
`;

const TokenName = styled.span`
    font-weight: 700;
`;

const TBody = styled.tbody`
    > tr:last-child > td {
        border-bottom: none;
    }
`;

const LockIcon = styled.span`
    cursor: pointer;
`;

const lockedIcon = () => {
    return (
        <svg
            data-icon="lock"
            className="lockedIcon"
            fill="none"
            height="16"
            viewBox="0 0 13 16"
            width="13"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M6.24949 0C3.66224 0 1.54871 2.21216 1.54871 4.92014V6.33135C0.692363 6.33135 0 7.05602 0 7.95232V14.379C0 15.2753 0.692363 16 1.54871 16H10.9503C11.8066 16 12.499 15.2753 12.499 14.379V7.95232C12.499 7.05602 11.8066 6.33135 10.9503 6.33135V4.92014C10.9503 2.21216 8.83674 0 6.24949 0ZM9.31046 6.33135H3.18851V4.92014C3.18851 3.16567 4.55502 1.71633 6.24949 1.71633C7.94395 1.71633 9.31046 3.16567 9.31046 4.92014V6.33135Z" />
        </svg>
    );
};

const unlockedIcon = () => {
    return (
        <svg
            data-icon="lock-open"
            className="unlockedIcon"
            fill="none"
            height="17"
            viewBox="0 0 13 17"
            width="13"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M1.54871 4.92014C1.54871 2.21216 3.66224 0 6.24949 0C8.83674 0 10.9503 2.21216 10.9503 4.92014H9.31046C9.31046 3.16567 7.94395 1.71633 6.24949 1.71633C4.55502 1.71633 3.18851 3.16567 3.18851 4.92014V7.33135H9.31046H10.9503C11.8066 7.33135 12.499 8.05602 12.499 8.95232V15.379C12.499 16.2753 11.8066 17 10.9503 17H1.54871C0.692363 17 0 16.2753 0 15.379V8.95232C0 8.05602 0.692363 7.33135 1.54871 7.33135V4.92014Z" />
        </svg>
    );
};

interface LockCellProps {
    isUnlocked: boolean;
    onClick: any;
    styles?: any;
}

const LockCell = ({ isUnlocked, onClick }: LockCellProps) => {
    return (
        <CustomTDLockIcon styles={{ borderBottom: true, textAlign: 'center' }}>
            <LockIcon onClick={onClick}>{isUnlocked ? unlockedIcon() : lockedIcon()}</LockIcon>
        </CustomTDLockIcon>
    );
};

class WalletTokenBalances extends React.PureComponent<Props> {
    public render = () => {
        const { ethBalance, tokenBalances, onStartToggleTokenLockSteps, web3State, wethTokenBalance, ethAccount } = this.props;

        if (!wethTokenBalance) {
            return null;
        }

        const wethToken = wethTokenBalance.token;
        const totalEth = wethTokenBalance.balance.plus(ethBalance);
        const formattedTotalEthBalance = tokenAmountInUnits(totalEth, wethToken.decimals, wethToken.displayDecimals);
        const onTotalEthClick = () => onStartToggleTokenLockSteps(wethTokenBalance.token, wethTokenBalance.isUnlocked);

        const totalEthRow = (
            <TR>
                <TokenTD>
                    <TokenIconStyled
                        symbol={wethToken.symbol}
                        primaryColor={wethToken.primaryColor}
                        icon={wethToken.icon}
                    />
                </TokenTD>
                <CustomTDTokenName styles={{ borderBottom: true }}>
                    <TokenName>ETH Total</TokenName> {` (ETH + wETH)`}
                </CustomTDTokenName>
                <CustomTD styles={{ borderBottom: true, textAlign: 'right', tabular: true }}>
                    {formattedTotalEthBalance}
                </CustomTD>
                <CustomTD styles={{ borderBottom: true, textAlign: 'right', tabular: true }}>-</CustomTD>
                <CustomTD styles={{ borderBottom: true, textAlign: 'right', tabular: true }}>-</CustomTD>
                <LockCell
                    isUnlocked={wethTokenBalance.isUnlocked}
                    onClick={onTotalEthClick}
                    styles={{ borderBottom: true, textAlign: 'center' }}
                />
            </TR>
        );

        const tokensRows = tokenBalances.map((tokenBalance, index) => {
            const { token, balance, isUnlocked } = tokenBalance;
            const { symbol } = token;
            const formattedBalance = tokenAmountInUnits(balance, token.decimals, token.displayDecimals);
            const onClick = () => onStartToggleTokenLockSteps(token, isUnlocked);

            return (
                <TR key={symbol}>
                    <TokenTD>
                        <TokenIconStyled symbol={token.symbol} primaryColor={token.primaryColor} icon={token.icon} />
                    </TokenTD>
                    <CustomTDTokenName styles={{ borderBottom: true }}>
                        <TokenEtherscanLink href={getEtherscanLinkForToken(token)} target={'_blank'}>
                            <TokenName>{token.symbol.toUpperCase()}</TokenName> {` - ${token.name}`}
                        </TokenEtherscanLink>
                    </CustomTDTokenName>
                    <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>
                        <QuantityEtherscanLink href={getEtherscanLinkForTokenAndAddress(token, ethAccount)} target={'_blank'}>
                            {formattedBalance}
                        </QuantityEtherscanLink>
                    </CustomTD>
                    <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>-</CustomTD>
                    <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>-</CustomTD>
                    <LockCell
                        isUnlocked={isUnlocked}
                        onClick={onClick}
                        styles={{ borderBottom: true, textAlign: 'center' }}
                    />
                </TR>
            );
        });

        let content: React.ReactNode;
        if (web3State === Web3State.Loading) {
            content = <LoadingWrapper />;
        } else {
            content = (
                <Table isResponsive={true}>
                    <THead>
                        <TR>
                            <THStyled>Token</THStyled>
                            <THStyled>{}</THStyled>
                            <THStyled styles={{ textAlign: 'right' }}>Available Qty.</THStyled>
                            <THStyled styles={{ textAlign: 'right' }}>Price (USD)</THStyled>
                            <THStyled styles={{ textAlign: 'right' }}>% Change</THStyled>
                            <THLast styles={{ textAlign: 'center' }}>Locked?</THLast>
                        </TR>
                    </THead>
                    <TBody>
                        {totalEthRow}
                        {tokensRows}
                    </TBody>
                </Table>
            );
        }

        return <Card title="Token Balances">{content}</Card>;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethBalance: getEthBalance(state),
        tokenBalances: getTokenBalances(state),
        web3State: getWeb3State(state),
        wethTokenBalance: getWethTokenBalance(state),
        ethAccount:  getEthAccount(state),
    };
};
const mapDispatchToProps = {
    onStartToggleTokenLockSteps: startToggleTokenLockSteps,
};

const WalletTokenBalancesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WalletTokenBalances);

export { WalletTokenBalances, WalletTokenBalancesContainer };
