import { assetDataUtils, BigNumber, SignedOrder } from '0x.js';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { INSTANT_FEE_PERCENTAGE, NETWORK_ID } from '../../../common/constants';
import { fetchLaunchpad, openFiatOnRampModal, startTranferTokenSteps } from '../../../store/actions';
import {
    getEthAccount,
    getEthBalance,
    getEthInUsd,
    getIEOOrders,
    getTokenBalancesIEO,
    getTokensPrice,
    getWallet,
    getWeb3State,
    getWethTokenBalance,
} from '../../../store/selectors';
import { Theme, themeBreakPoints } from '../../../themes/commons';
import { isMobile } from '../../../util/screen';
import { getEtherscanLinkForToken, getEtherscanLinkForTokenAndAddress, tokenAmountInUnits } from '../../../util/tokens';
import { StoreState, Token, TokenBalance, TokenBalanceIEO, TokenPrice, Wallet, Web3State } from '../../../util/types';
import { TransferTokenModal } from '../../account/wallet_transfer_token_modal';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { withWindowWidth } from '../../common/hoc/withWindowWidth';
import { SocialIcon } from '../../common/icons/social_icon';
import { TokenIcon } from '../../common/icons/token_icon';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, THLast, TR } from '../../common/table';
import { IconType, Tooltip } from '../../common/tooltip';
import { ZeroXInstantWidget } from '../common/0xinstant_widget';

interface StateProps {
    ethBalance: BigNumber;
    tokenBalances: TokenBalanceIEO[] | null;
    web3State: Web3State;
    wethTokenBalance: TokenBalance | null;
    ethAccount: string;
    ethUsd: BigNumber | null;
    tokensPrice: TokenPrice[] | null;
    wallet: Wallet | null;
    orders: SignedOrder[] | undefined;
}
interface OwnProps {
    theme: Theme;
    windowWidth: number;
}

interface DispatchProps {
    onFetchLaunchpad: () => Promise<any>;
    onSubmitTransferToken: (amount: BigNumber, token: Token, address: string, isEth: boolean) => Promise<any>;
    onClickOpenFiatOnRampModal: (isOpen: boolean) => void;
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

const QuantityEtherscanLink = styled.a`
    align-items: center;
    color: ${props => props.theme.componentsTheme.myWalletLinkColor};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const TokenName = styled.span`
    font-weight: 700;
`;
const TokenNameSeparator = styled.span``;

const TBody = styled.tbody`
    > tr:last-child > td {
        border-bottom: none;
    }
`;

const ButtonsContainer = styled.span`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    @media (min-width: ${themeBreakPoints.xs}) {
        flex-wrap: wrap;
        display: -webkit-inline-box;
    }
`;

const SocialsContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
`;

const TooltipStyled = styled(Tooltip)`
    flex-wrap: wrap;
    .reactTooltip {
        max-width: 650px;
    }
    @media (max-width: ${themeBreakPoints.sm}) {
        .reactTooltip {
            max-width: 350px;
            text-align: center;
        }
    }
`;

const WebsiteLink = styled.a`
    align-items: center;
    color: ${props => props.theme.componentsTheme.myWalletLinkColor};
    display: flex;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const LabelWrapper = styled.span`
    align-items: center;
    display: flex;
    flex-shrink: 0;
    margin-right: 15px;
`;

const parsedUrl = new URL(window.location.href.replace('#/', ''));
const tokenName = parsedUrl.searchParams.get('token');

const tokensPartialTable = (
    tokenBalances: TokenBalanceIEO[] | null,
    props: Props,
    setIsModalOpen: any,
    setTokenBalanceSelected: any,
    setIsEth: any,
    isMobileView: boolean,
) => {
    const isProject = (tb: TokenBalance) => {
        if (!tokenName) {
            return true;
        } else {
            return tb.token.name.toLowerCase() === tokenName.toLowerCase();
        }
    };
    const { orders, wallet, ethAccount } = props;

    return (
        tokenBalances &&
        tokenBalances
            .filter(tb => tb.token.symbol !== 'weth')
            .filter(isProject)
            .map((tokenBalance, index) => {
                const { token, balance } = tokenBalance;
                const { symbol } = token;
                const formattedBalance = tokenAmountInUnits(balance, token.decimals, token.displayDecimals);

                /* const openTransferModal = () => {
                    setIsModalOpen(true);
                    setTokenBalanceSelected(tokenBalance);
                    setIsEth(false);
                };*/
                let orderSource: SignedOrder[] = [];
                if (orders) {
                    if (orders.length) {
                        const assetData = assetDataUtils.encodeERC20AssetData(token.address);
                        orderSource = orders.filter(
                            o =>
                                token.owners.map(own => own.toLowerCase()).includes(o.makerAddress.toLowerCase()) &&
                                assetData === o.makerAssetData.toLowerCase(),
                        );
                    }
                }
                const social_urls_keys = Object.keys(token.social);
                const social_urls = token.social || [];
                const socialButtons = () => {
                    return social_urls_keys.map(s => (
                        // @ts-ignore
                        <SocialIcon key={s} color={'black'} icon={s.split('_')[0]} url={social_urls[s]} />
                    ));
                };
                const feePercentage = Number(token.feePercentage)
                    ? Number(token.feePercentage)
                    : INSTANT_FEE_PERCENTAGE;
                const hasOrders = orderSource.length ? true : false;

                const website = token.website ? (
                    <WebsiteLink href={token.website} target={'_blank'}>
                        {token.website}
                    </WebsiteLink>
                ) : (
                    '-'
                );
                if (isMobileView) {
                    return (
                        <tbody key={symbol}>
                            <TR>
                                <TH>Token</TH>
                                <CustomTDTokenName styles={{ borderBottom: true, textAlign: 'center' }}>
                                    <LabelWrapper>
                                        <TokenEtherscanLink href={getEtherscanLinkForToken(token)} target={'_blank'}>
                                            <TokenName>{token.symbol.toUpperCase()}</TokenName>{' '}
                                            <TokenNameSeparator>{` - `}</TokenNameSeparator>
                                            {`${token.name}`}
                                        </TokenEtherscanLink>
                                        <TooltipStyled
                                            description={token.description || 'no description'}
                                            iconType={IconType.Fill}
                                        />
                                    </LabelWrapper>
                                </CustomTDTokenName>
                            </TR>
                            <TR>
                                <TH>Actions </TH>
                                <CustomTD styles={{ borderBottom: true, textAlign: 'center' }}>
                                    <ButtonsContainer>
                                        {/*<Button onClick={openTransferModal} variant={ButtonVariant.Primary}>
                                            Send
                    </Button>*/}
                                        {hasOrders && (
                                            <ZeroXInstantWidget
                                                orderSource={orderSource}
                                                tokenAddress={token.address}
                                                networkId={NETWORK_ID}
                                                walletDisplayName={wallet}
                                                feePercentage={feePercentage}
                                                isIEO={true}
                                            />
                                        )}
                                        {!hasOrders && 'No Orders'}
                                    </ButtonsContainer>
                                </CustomTD>
                            </TR>
                            <TR>
                                <TH>Website</TH>
                                <CustomTD styles={{ borderBottom: true, textAlign: 'center' }}>{website}</CustomTD>
                            </TR>
                            <TR>
                                <TH>Balance</TH>
                                <CustomTD styles={{ borderBottom: true, textAlign: 'center' }}>
                                    <QuantityEtherscanLink
                                        href={getEtherscanLinkForTokenAndAddress(token, ethAccount)}
                                        target={'_blank'}
                                    >
                                        {formattedBalance}
                                    </QuantityEtherscanLink>
                                </CustomTD>
                            </TR>
                            <TR>
                                <TH>Links</TH>
                                <CustomTD styles={{ borderBottom: true, textAlign: 'center' }}>
                                    <SocialsContainer>{socialButtons()}</SocialsContainer>
                                </CustomTD>
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
                            <CustomTDTokenName styles={{ borderBottom: true, textAlign: 'center' }}>
                                <LabelWrapper>
                                    <TokenEtherscanLink href={getEtherscanLinkForToken(token)} target={'_blank'}>
                                        <TokenName>{token.symbol.toUpperCase()}</TokenName>{' '}
                                        <TokenNameSeparator>{` - `}</TokenNameSeparator>
                                        {`${token.name}`}
                                    </TokenEtherscanLink>
                                    <TooltipStyled
                                        description={token.description || 'no description'}
                                        iconType={IconType.Fill}
                                    />
                                </LabelWrapper>
                            </CustomTDTokenName>
                            <CustomTD styles={{ borderBottom: true, textAlign: 'center' }}>
                                <ButtonsContainer>
                                    {/*<Button onClick={openTransferModal} variant={ButtonVariant.Primary}>
                                        Send
                                    </Button>*/}
                                    {hasOrders && (
                                        <ZeroXInstantWidget
                                            orderSource={orderSource}
                                            tokenAddress={token.address}
                                            networkId={NETWORK_ID}
                                            walletDisplayName={wallet}
                                            feePercentage={feePercentage}
                                            isIEO={true}
                                        />
                                    )}
                                    {!hasOrders && 'No Orders'}
                                </ButtonsContainer>
                            </CustomTD>
                            <CustomTD styles={{ borderBottom: true, textAlign: 'center' }}>{website}</CustomTD>
                            <CustomTD styles={{ borderBottom: true, textAlign: 'center' }}>
                                <QuantityEtherscanLink
                                    href={getEtherscanLinkForTokenAndAddress(token, ethAccount)}
                                    target={'_blank'}
                                >
                                    {formattedBalance}
                                </QuantityEtherscanLink>
                            </CustomTD>
                            <CustomTD styles={{ borderBottom: true, textAlign: 'center' }}>
                                <SocialsContainer>{socialButtons()}</SocialsContainer>
                            </CustomTD>
                        </TR>
                    );
                }
            })
    );
};

const IEOTokenBalances = (props: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEth, setIsEth] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tokenBalanceSelected, setTokenBalanceSelected] = useState();
    let content: React.ReactNode;
    const {
        ethBalance,
        tokenBalances,
        web3State,
        wethTokenBalance,
        theme,
        ethAccount,
        onFetchLaunchpad,
        windowWidth,
    } = props;

    let wethToken = null;
    if (!wethTokenBalance) {
        content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
    } else {
        wethToken = wethTokenBalance.token;
    }

    useEffect(() => {
        // tslint:disable-next-line: no-floating-promises
        onFetchLaunchpad();
    }, [ethAccount]);

    if (!wethTokenBalance) {
        content = <LoadingWrapper />;
    } else if (web3State === Web3State.Loading || !tokenBalances) {
        content = <LoadingWrapper />;
    } else if (tokenBalances.length === 0) {
        content = <EmptyContent alignAbsoluteCenter={true} text="There are no tokens to show" />;
    } else {
        const closeModal = () => setIsModalOpen(false);

        const handleSubmit = async (amount: BigNumber, token: Token, address: string, isETH: boolean) => {
            setIsSubmitting(true);
            try {
                await props.onSubmitTransferToken(amount, token, address, isETH);
            } finally {
                setIsSubmitting(false);
                setIsModalOpen(false);
                fetchLaunchpad();
            }
        };
        const transferTokenModal = wethToken ? (
            <TransferTokenModal
                isOpen={isModalOpen}
                tokenBalance={tokenBalanceSelected as TokenBalance}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                style={theme.modalTheme}
                closeModal={closeModal}
                ethBalance={ethBalance}
                isEth={isEth}
                wethToken={wethToken}
            />
        ) : null;

        const isMobileView = isMobile(windowWidth);
        if (isMobileView) {
            content = (
                <>
                    <Table isResponsive={true}>
                        {tokensPartialTable(
                            tokenBalances,
                            props,
                            setIsModalOpen,
                            setTokenBalanceSelected,
                            setIsEth,
                            isMobileView,
                        )}
                    </Table>
                    {transferTokenModal}
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
                                <THLast styles={{ textAlign: 'center' }}>Actions</THLast>
                                <THStyled styles={{ textAlign: 'center' }}>Website</THStyled>
                                <THStyled styles={{ textAlign: 'center' }}>Your Balance</THStyled>
                                <THStyled styles={{ textAlign: 'center' }}>Links</THStyled>
                            </TR>
                        </THead>
                        <TBody>
                            {tokensPartialTable(
                                tokenBalances,
                                props,
                                setIsModalOpen,
                                setTokenBalanceSelected,
                                setIsEth,
                                isMobileView,
                            )}
                        </TBody>
                    </Table>
                    {transferTokenModal}
                </>
            );
        }
    }
    return <Card title="LAUNCHPAD">{content}</Card>;
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethBalance: getEthBalance(state),
        tokenBalances: getTokenBalancesIEO(state),
        web3State: getWeb3State(state),
        wethTokenBalance: getWethTokenBalance(state),
        ethAccount: getEthAccount(state),
        ethUsd: getEthInUsd(state),
        tokensPrice: getTokensPrice(state),
        wallet: getWallet(state),
        orders: getIEOOrders(state),
    };
};
const mapDispatchToProps = {
    onFetchLaunchpad: fetchLaunchpad,
    onSubmitTransferToken: startTranferTokenSteps,
    onClickOpenFiatOnRampModal: openFiatOnRampModal,
};

const IEOTokenBalancesContainer = withTheme(
    withWindowWidth(
        connect(
            mapStateToProps,
            mapDispatchToProps,
        )(IEOTokenBalances),
    ),
);

// tslint:disable-next-line: max-file-line-count
export { IEOTokenBalances, IEOTokenBalancesContainer };
