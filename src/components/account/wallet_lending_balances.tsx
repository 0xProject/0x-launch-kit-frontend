import { BigNumber } from '0x.js';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { NETWORK_ID, RELAYER_URL } from '../../common/constants';
import { initBZX, openFiatOnRampModal, startLendingTokenSteps, startUnLendingTokenSteps } from '../../store/actions';
import {
    getBZXLoadingState,
    getEthAccount,
    getEthBalance,
    getEthInUsd,
    getITokensData,
    getTokenBalances,
    getTokensPrice,
    getTotalEthBalance,
    getWallet,
    getWeb3State,
    getWethTokenBalance,
} from '../../store/selectors';
import { Theme, themeBreakPoints } from '../../themes/commons';
import { computeProfit } from '../../util/bzx/bzx_utils';
import { isWethToken } from '../../util/known_tokens';
import { isMobile } from '../../util/screen';
import { getEtherscanLinkForToken, tokenAmountInUnits } from '../../util/tokens';
import {
    ButtonVariant,
    BZXLoadingState,
    iTokenData,
    StoreState,
    Token,
    TokenBalance,
    TokenPrice,
    Wallet,
    Web3State,
} from '../../util/types';
import { Button } from '../common/button';
import { Card } from '../common/card';
import { withWindowWidth } from '../common/hoc/withWindowWidth';
import { TokenIcon } from '../common/icons/token_icon';
import { LoadingWrapper } from '../common/loading';
import { CustomTD, Table, TH, THead, THLast, TR } from '../common/table';
import { ZeroXInstantWidget } from '../erc20/common/0xinstant_widget';

import { LendingTokenModal } from './wallet_lending_token_modal';

interface StateProps {
    ethBalance: BigNumber;
    ethTotalBalance: BigNumber;
    tokenBalances: TokenBalance[];
    iTokensData: iTokenData[];
    web3State: Web3State;
    wethTokenBalance: TokenBalance | null;
    ethAccount: string;
    ethUsd: BigNumber | null;
    tokensPrice: TokenPrice[] | null;
    wallet: Wallet | null;
    bzxLoadingState: BZXLoadingState;
}
interface OwnProps {
    theme: Theme;
    windowWidth: number;
}

interface DispatchProps {
    onSubmitLendingToken: (amount: BigNumber, token: Token, iToken: iTokenData, isEth: boolean) => Promise<any>;
    onSubmitUnLendingToken: (amount: BigNumber, token: Token, iToken: iTokenData, isEth: boolean) => Promise<any>;
    onClickOpenFiatOnRampModal: (isOpen: boolean) => void;
    initBZXFetching: () => Promise<any>;
}

type Props = StateProps & DispatchProps & OwnProps;

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

const BuyETHButton = styled(Button)`
    margin-left: 5px;
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
    @media (max-width: ${themeBreakPoints.sm}) {
        display: inline;
    }
`;

const TokenName = styled.span`
    font-weight: 700;
    @media (max-width: ${themeBreakPoints.sm}) {
    }
`;
const TokenNameSeparator = styled.span`
    @media (max-width: ${themeBreakPoints.sm}) {
        display: none;
    }
`;

const TBody = styled.tbody`
    > tr:last-child > td {
        border-bottom: none;
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    @media (max-width: ${themeBreakPoints.xs}) {
        flex-wrap: wrap;
        display: -webkit-inline-box;
    }
`;

const ButtonStyled = styled(Button)`
    margin-left: 5px;
`;

const PStyled = styled.p`
    color: ${props => props.theme.componentsTheme.textColorCommon};
`;

const CustomTDMobile = styled(CustomTD)`
    max-width: 30px;
    display: block;
`;

const WalletLendingBalances: React.FC<Props> = props => {
    const [isEthState, setIsEthState] = useState(false);
    const [isModalOpenState, setIsModalOpenState] = useState(false);
    const [isSubmittingState, setIsSubmittingState] = useState(false);
    const [iTokenDataState, setITokenDataState] = useState();
    const [isLendingState, setIsLendingState] = useState(true);
    const [tokenBalanceState, setTokenBalanceState] = useState();

    const {
        ethBalance,
        ethTotalBalance,
        tokenBalances,
        web3State,
        wethTokenBalance,
        ethAccount,
        theme,
        tokensPrice,
        wallet,
        onClickOpenFiatOnRampModal,
        initBZXFetching,
        iTokensData,
        bzxLoadingState,
        windowWidth,
    } = props;

    useEffect(() => {
        if (ethAccount) {
            // tslint:disable-next-line: no-floating-promises
            initBZXFetching();
        }
    }, [ethAccount]);

    const openFiatOnRamp = () => {
        onClickOpenFiatOnRampModal(true);
    };
    const isMobileView = isMobile(windowWidth);

    const tokensRows = () =>
        iTokensData.map((tokenD, index) => {
            const { token, balance, supplyInterestRate } = tokenD;
            const { symbol } = token;
            const isEthToken = isWethToken(token);
            const tokenBalance = tokenBalances.find(tb => tb.token.symbol === symbol) as Required<TokenBalance>;

            const tokB = isEthToken
                ? ethTotalBalance || new BigNumber(0)
                : (tokenBalance && tokenBalance.balance) || new BigNumber(0);

            const formattedLendBalance = tokenAmountInUnits(balance, token.decimals, token.displayDecimals);
            const formattedBalance = tokenAmountInUnits(tokB, token.decimals, token.displayDecimals);
            const tokenPrice = tokensPrice && tokensPrice.find(t => t.c_id === token.c_id);
            const profit = computeProfit(tokenD);
            const usdBalance = tokenPrice
                ? `${tokenPrice.price_usd.multipliedBy(new BigNumber(formattedBalance)).toFixed(3)}$`
                : '-';
            const usdLendBalance = tokenPrice
                ? `${tokenPrice.price_usd.multipliedBy(new BigNumber(formattedLendBalance)).toFixed(3)}$`
                : '-';
            const usdProfit = tokenPrice ? `${tokenPrice.price_usd.multipliedBy(profit).toFixed(5)}$` : '-';
            // const onClick = () => onStartToggleTokenLockSteps(token, isUnlocked);
            const openLendingModal = () => {
                setITokenDataState(tokenD);
                setIsModalOpenState(true);
                if (isEthToken) {
                    setIsEthState(true);
                    setTokenBalanceState({ ...wethTokenBalance, balance: tokB });
                } else {
                    setIsEthState(false);
                    setTokenBalanceState(tokenBalances.find(tb => tb.token === token));
                }
                setIsLendingState(true);
            };

            const openUnLendingModal = () => {
                setITokenDataState(tokenD);
                if (isEthToken) {
                    setIsEthState(true);
                    setTokenBalanceState({ ...wethTokenBalance, balance: tokB });
                } else {
                    setIsEthState(false);
                    setTokenBalanceState(tokenBalances.find(tb => tb.token === token));
                }
                setIsModalOpenState(true);
                setIsLendingState(false);
            };

            const tokenName = isEthToken ? 'Ethereum' : token.name;
            const tokenSymbol = isEthToken ? 'ETH' : token.symbol.toUpperCase();
            const buyButton = isEthToken ? (
                <BuyETHButton onClick={openFiatOnRamp} variant={ButtonVariant.Primary}>
                    BUY
                </BuyETHButton>
            ) : (
                <ZeroXInstantWidget
                    orderSource={RELAYER_URL}
                    tokenAddress={token.address}
                    networkId={NETWORK_ID}
                    walletDisplayName={wallet}
                    btnName={'BUY'}
                    buttonVariant={ButtonVariant.Primary}
                />
            );
            if (isMobileView) {
                return (
                    <tbody key={symbol}>
                        <TR>
                            <TH>Token</TH>
                            <CustomTDTokenName styles={{ textAlign: 'center' }}>
                                <TokenEtherscanLink href={getEtherscanLinkForToken(token)} target={'_blank'}>
                                    <TokenNameSeparator>{` - `}</TokenNameSeparator>
                                    {`${tokenName}`}
                                </TokenEtherscanLink>
                            </CustomTDTokenName>
                        </TR>
                        <TR>
                            <TH>Interest APR</TH>
                            <CustomTD styles={{ textAlign: 'center' }}>
                                {supplyInterestRate.dividedBy('1e18').toFixed(5)} %
                            </CustomTD>
                        </TR>
                        <TR>
                            <TH>Balance</TH>
                            <CustomTD styles={{ textAlign: 'center' }}>{usdBalance}</CustomTD>
                        </TR>
                        <TR>
                            <TH>Lend Balance</TH>
                            <CustomTD styles={{ textAlign: 'center' }}>{usdLendBalance}</CustomTD>
                        </TR>
                        <TR>
                            <TH>Profit</TH>
                            <CustomTD styles={{ textAlign: 'center' }}>{usdProfit}</CustomTD>
                        </TR>
                        <TR>
                            <TH styles={{ borderBottom: true, textAlign: 'left' }}> Actions</TH>
                            <CustomTDMobile styles={{ borderBottom: true, textAlign: 'left' }}>
                                <ButtonsContainer>
                                    {buyButton}
                                    <ButtonStyled
                                        onClick={openLendingModal}
                                        variant={ButtonVariant.Buy}
                                        disabled={tokB.isEqualTo(0)}
                                    >
                                        LEND
                                    </ButtonStyled>

                                    <ButtonStyled
                                        onClick={openUnLendingModal}
                                        variant={ButtonVariant.Sell}
                                        disabled={balance.isEqualTo(0)}
                                    >
                                        UNLEND
                                    </ButtonStyled>
                                </ButtonsContainer>
                            </CustomTDMobile>
                        </TR>
                    </tbody>
                );
            } else {
                return (
                    <TR key={symbol}>
                        <TokenTD>
                            <TokenIconStyled
                                symbol={token.symbol}
                                primaryColor={token.primaryColor}
                                icon={token.icon}
                            />
                        </TokenTD>
                        <CustomTDTokenName styles={{ borderBottom: true }}>
                            <TokenEtherscanLink href={getEtherscanLinkForToken(token)} target={'_blank'}>
                                <TokenName>{tokenSymbol}</TokenName> <TokenNameSeparator>{` - `}</TokenNameSeparator>
                                {`${tokenName}`}
                            </TokenEtherscanLink>
                        </CustomTDTokenName>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>
                            {supplyInterestRate.dividedBy('1e18').toFixed(5)} %
                        </CustomTD>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>{usdBalance}</CustomTD>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>{usdLendBalance}</CustomTD>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>{usdProfit}</CustomTD>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'center' }}>
                            <ButtonsContainer>
                                {buyButton}
                                <ButtonStyled
                                    onClick={openLendingModal}
                                    variant={ButtonVariant.Buy}
                                    disabled={tokB.isEqualTo(0)}
                                >
                                    LEND
                                </ButtonStyled>

                                <ButtonStyled
                                    onClick={openUnLendingModal}
                                    variant={ButtonVariant.Sell}
                                    disabled={balance.isEqualTo(0)}
                                >
                                    UNLEND
                                </ButtonStyled>
                            </ButtonsContainer>
                        </CustomTD>
                    </TR>
                );
            }
        });
    const totalHoldingsRow = () => {
        const availableLendingTokensAddress = iTokensData.map(t => t.token.address);

        const totalHoldingsValue: BigNumber =
            (tokenBalances.length &&
                wethTokenBalance &&
                availableLendingTokensAddress.length &&
                tokenBalances
                    .concat(wethTokenBalance)
                    .filter(tb => tb.token.c_id !== null)
                    .filter(tb => availableLendingTokensAddress.includes(tb.token.address))
                    .map(tb => {
                        const tokenPrice = tokensPrice && tokensPrice.find(tp => tp.c_id === tb.token.c_id);
                        if (tokenPrice) {
                            const { token, balance } = tb;
                            const b = isWethToken(token) ? wethTokenBalance.balance.plus(ethBalance) : balance;

                            const formattedBalance = new BigNumber(
                                tokenAmountInUnits(b, token.decimals, token.displayDecimals),
                            );
                            return formattedBalance.multipliedBy(tokenPrice.price_usd);
                        } else {
                            return new BigNumber(0);
                        }
                    })
                    .reduce((p, c) => {
                        return p.plus(c);
                    })) ||
            new BigNumber(0);

        const totalLendingHoldingsValue: BigNumber =
            (iTokensData.length &&
                iTokensData
                    .filter(tb => tb.token.c_id !== null)
                    .map(tb => {
                        const tokenPrice = tokensPrice && tokensPrice.find(tp => tp.c_id === tb.token.c_id);
                        if (tokenPrice) {
                            const { token, balance } = tb;
                            const formattedBalance = new BigNumber(
                                tokenAmountInUnits(balance, token.decimals, token.displayDecimals),
                            );
                            return formattedBalance.multipliedBy(tokenPrice.price_usd);
                        } else {
                            return new BigNumber(0);
                        }
                    })
                    .reduce((p, c) => {
                        return p.plus(c);
                    })) ||
            new BigNumber(0);
        const totalProfitsValue: BigNumber =
            (iTokensData.length &&
                iTokensData
                    .filter(td => td.token.c_id !== null)
                    .map(td => {
                        const tokenPrice = tokensPrice && tokensPrice.find(tp => tp.c_id === td.token.c_id);
                        if (tokenPrice) {
                            const profit = computeProfit(td);
                            return tokenPrice.price_usd.multipliedBy(profit);
                        } else {
                            return new BigNumber(0);
                        }
                    })
                    .reduce((p, c) => {
                        return p.plus(c);
                    })) ||
            new BigNumber(0);
        if (isMobileView) {
            return (
                <tbody>
                    <TR>
                        <TH>Total Balances</TH>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'center', tabular: true }}>
                            {`${totalHoldingsValue.toFixed(3)}$`}
                        </CustomTD>
                    </TR>
                    <TR>
                        <TH>Total Lend Balances</TH>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'center', tabular: true }}>
                            {`${totalLendingHoldingsValue.toFixed(5)}$`}
                        </CustomTD>
                    </TR>
                    <TR>
                        <TH>Total Profits</TH>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'center', tabular: true }}>
                            {`${totalProfitsValue.toFixed(5)}$`}
                        </CustomTD>
                    </TR>
                </tbody>
            );
        } else {
            return (
                <TR>
                    <CustomTD styles={{ borderBottom: true, textAlign: 'right', tabular: true }} />
                    <CustomTDTokenName styles={{ borderBottom: true }}>TOTAL</CustomTDTokenName>
                    <CustomTD styles={{ borderBottom: true, textAlign: 'right', tabular: true }} />
                    <CustomTD styles={{ borderBottom: true, textAlign: 'right', tabular: true }}>
                        {`${totalHoldingsValue.toFixed(3)}$`}
                    </CustomTD>
                    <CustomTD styles={{ borderBottom: true, textAlign: 'right', tabular: true }}>
                        {`${totalLendingHoldingsValue.toFixed(5)}$`}
                    </CustomTD>
                    <CustomTD styles={{ borderBottom: true, textAlign: 'right', tabular: true }}>
                        {`${totalProfitsValue.toFixed(5)}$`}
                    </CustomTD>
                    <CustomTD styles={{ borderBottom: true, textAlign: 'center' }}>Prices by Coingecko</CustomTD>
                </TR>
            );
        }
    };

    let content: React.ReactNode;
    if (web3State === Web3State.Loading || bzxLoadingState === BZXLoadingState.Loading || !wethTokenBalance) {
        content = <LoadingWrapper />;
    } else {
        const closeModal = () => {
            setIsModalOpenState(false);
        };
        const handleSubmit = async (
            amount: BigNumber,
            token: Token,
            iToken: iTokenData,
            isEth: boolean,
            isLending: boolean,
        ) => {
            setIsSubmittingState(true);

            try {
                if (isLending) {
                    await props.onSubmitLendingToken(amount, token, iToken, isEth);
                } else {
                    await props.onSubmitUnLendingToken(amount, token, iToken, isEth);
                }
            } finally {
                setIsSubmittingState(false);
                closeModal();
            }
        };
        const wethToken = wethTokenBalance.token;

        const wethPlusEthBalance = (wethTokenBalance && wethTokenBalance.balance.plus(ethBalance)) || new BigNumber(0);

        if (isMobileView) {
            content = (
                <>
                    <Table isResponsive={true}>
                        {tokensRows()}
                        {totalHoldingsRow()}
                    </Table>
                    {isModalOpenState && (
                        <LendingTokenModal
                            isOpen={isModalOpenState}
                            tokenBalance={tokenBalanceState}
                            isSubmitting={isSubmittingState}
                            onSubmit={handleSubmit}
                            iToken={iTokenDataState}
                            style={theme.modalTheme}
                            closeModal={closeModal}
                            ethBalance={wethPlusEthBalance}
                            isEth={isEthState}
                            wethToken={wethToken}
                            isLending={isLendingState}
                        />
                    )}
                    <PStyled>Prices by Coingecko </PStyled>
                </>
            );
        } else {
            content = (
                <>
                    <Table isResponsive={true}>
                        <THead>
                            <TR>
                                <THStyled>Token</THStyled>
                                <THStyled>{}</THStyled>
                                <THStyled styles={{ textAlign: 'right' }}>Interest APR</THStyled>
                                <THStyled styles={{ textAlign: 'right' }}>Balance</THStyled>
                                <THStyled styles={{ textAlign: 'right' }}>Lend Balance</THStyled>
                                <THStyled styles={{ textAlign: 'right' }}>Profit</THStyled>
                                <THLast styles={{ textAlign: 'center' }}>Actions</THLast>
                            </TR>
                        </THead>
                        <TBody>
                            {/*totalEthRow*/}
                            {tokensRows()}
                            {totalHoldingsRow()}
                        </TBody>
                    </Table>
                    {isModalOpenState && (
                        <LendingTokenModal
                            isOpen={isModalOpenState}
                            tokenBalance={tokenBalanceState}
                            isSubmitting={isSubmittingState}
                            onSubmit={handleSubmit}
                            iToken={iTokenDataState}
                            style={theme.modalTheme}
                            closeModal={closeModal}
                            ethBalance={wethPlusEthBalance}
                            isEth={isEthState}
                            wethToken={wethToken}
                            isLending={isLendingState}
                        />
                    )}
                </>
            );
        }
    }

    return <Card title="LEND">{content}</Card>;
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethBalance: getEthBalance(state),
        ethTotalBalance: getTotalEthBalance(state),
        iTokensData: getITokensData(state),
        tokenBalances: getTokenBalances(state),
        web3State: getWeb3State(state),
        wethTokenBalance: getWethTokenBalance(state),
        ethAccount: getEthAccount(state),
        ethUsd: getEthInUsd(state),
        tokensPrice: getTokensPrice(state),
        wallet: getWallet(state),
        bzxLoadingState: getBZXLoadingState(state),
    };
};
const mapDispatchToProps = {
    onSubmitLendingToken: startLendingTokenSteps,
    onSubmitUnLendingToken: startUnLendingTokenSteps,
    onClickOpenFiatOnRampModal: openFiatOnRampModal,
    initBZXFetching: initBZX,
};

const WalletLendingBalancesContainer = withTheme(
    withWindowWidth(
        connect(
            mapStateToProps,
            mapDispatchToProps,
        )(WalletLendingBalances),
    ),
);

// tslint:disable-next-line: max-file-line-count
export { WalletLendingBalances, WalletLendingBalancesContainer };
