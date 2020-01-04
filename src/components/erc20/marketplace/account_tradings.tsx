import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { changeMarket, fetchAccountMarketStats as fetchStats, goToHome } from '../../../store/actions';
import { getAccountMarketStats, getBaseToken, getQuoteToken } from '../../../store/selectors';
import {
    getCurrencyPairByMarket,
    getCurrencyPairFromTokens,
    getTokensFromCurrencyPair,
} from '../../../util/known_currency_pairs';
import { marketToString } from '../../../util/markets';
import { getAddressLinkExplorer } from '../../../util/transaction_link';
import { AccountMarketStat, CurrencyPair, StoreState, Token } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../../common/table';

const AccountTradingsCard = styled(Card)`
    height: 100%;
    overflow: auto;
`;

interface StateProps {
    baseToken: Token | null;
    quoteToken: Token | null;
    accountMarketStats: AccountMarketStat[] | undefined;
}

interface DispatchProps {
    changeMarket: (currencyPair: CurrencyPair) => any;
    goToHome: () => any;
    fetchAccountMarketStats: (market: string | null, from: number, to: number) => any;
}

type Props = StateProps & DispatchProps;

const AccountEtherscanLink = styled.a`
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

export const ClicableTD = styled(CustomTD)`
    cursor: pointer;
`;

const statsToRow = (stat: AccountMarketStat, index: number) => {
    return (
        <TR key={index}>
            <ClicableTD styles={{ textAlign: 'center', tabular: true }}>
                <AccountEtherscanLink href={getAddressLinkExplorer(stat.address)} target={'_blank'}>
                    {`${stat.address}`}
                </AccountEtherscanLink>
            </ClicableTD>
            <CustomTD styles={{ textAlign: 'center', tabular: true }}>{stat.totalClosedOrders}</CustomTD>
            <CustomTD styles={{ textAlign: 'center', tabular: true }}>{stat.totalAmountBase}</CustomTD>
            <CustomTD styles={{ textAlign: 'center', tabular: true }}>{stat.totalAmountQuote}</CustomTD>
        </TR>
    );
};

const parsedUrl = new URL(window.location.href.replace('#/', ''));
const fromQuery = parsedUrl.searchParams.get('from');
const toQuery = parsedUrl.searchParams.get('to');
const marketQuery = parsedUrl.searchParams.get('market');

const AccountTradings: React.FC<Props> = props => {
    const { accountMarketStats, baseToken, quoteToken, fetchAccountMarketStats } = props;
    let content: React.ReactNode;
    const [isLoading, setLoading] = useState(true);
    let currencyPair: CurrencyPair | null = null;
    let isInvalidMarket = false;
    try {
        if (marketQuery) {
            currencyPair = getCurrencyPairByMarket(marketQuery);
        } else {
            if (baseToken && quoteToken) {
                currencyPair = getCurrencyPairFromTokens(baseToken, quoteToken);
            }
        }
    } catch (e) {
        isInvalidMarket = true;
    }

    const month = new Date().getUTCMonth() + 1;
    const year = new Date().getUTCFullYear();
    const monthDays = new Date(year, month, 0).getDate();
    const from = fromQuery || new Date(`${month}-1-${year}`).getTime();
    const to = toQuery || new Date(`${month}-${monthDays}-${year}`).getTime();
    useEffect(() => {
        if (baseToken && quoteToken && !isInvalidMarket && currencyPair) {
            const market = marketToString(currencyPair);
            fetchAccountMarketStats(market, Number(from), Number(to));
            setLoading(false);
        }
        if (isInvalidMarket) {
            setLoading(false);
        }
    }, [baseToken, quoteToken]);

    if (accountMarketStats && !isInvalidMarket && currencyPair) {
        const [bToken, qToken] = getTokensFromCurrencyPair(currencyPair);
        content = (
            <Table isResponsive={true}>
                <THead>
                    <TR>
                        <TH styles={{ textAlign: 'center' }}>Account</TH>
                        <TH styles={{ textAlign: 'center' }}>Orders Closed</TH>
                        <TH styles={{ textAlign: 'center' }}>Base Amount ({bToken.symbol})</TH>
                        <TH styles={{ textAlign: 'center' }}>Quote Amount ({qToken.symbol})</TH>
                    </TR>
                </THead>
                <tbody>{accountMarketStats.map((a, index: number) => statsToRow(a, index))}</tbody>
            </Table>
        );
    } else {
        if (isLoading) {
            content = <LoadingWrapper minHeight="120px" />;
        } else if (isInvalidMarket) {
            content = <EmptyContent alignAbsoluteCenter={true} text="Market not available" />;
        } else {
            content = <EmptyContent alignAbsoluteCenter={true} text="There are no stats to show" />;
        }
    }
    const marketName = currencyPair ? marketToString(currencyPair) : '';

    return (
        <AccountTradingsCard
            title={`Trading Stats ${marketName} -  From:${new Date(Number(from)).toDateString()}   To: ${new Date(
                Number(to),
            ).toDateString()}`}
        >
            {content}
        </AccountTradingsCard>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseToken(state),
        quoteToken: getQuoteToken(state),
        accountMarketStats: getAccountMarketStats(state),
    };
};
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        changeMarket: (currencyPair: CurrencyPair) => dispatch(changeMarket(currencyPair)),
        fetchAccountMarketStats: (market, from, to) => dispatch(fetchStats(market, from, to)),
        goToHome: () => dispatch(goToHome()),
    };
};

const AccountTradingsContainer = connect(mapStateToProps, mapDispatchToProps)(AccountTradings);

export { AccountTradings, AccountTradingsContainer };
