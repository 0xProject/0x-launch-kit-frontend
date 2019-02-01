import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getKnownTokens, getWeb3State } from '../../store/selectors';
import { StoreState, Web3State } from '../../store/types';
import { TokenBalance } from '../../util/types';
import { Card } from '../common/card';

interface PropsFromState {
    web3State: Web3State;
    knownTokens: TokenBalance[];
}

type WalletTokenBalancesProps = PropsFromState;

const headerPaddingBottom = 20;
const rowsVerticalPadding = 10;

const THead = styled.thead`
    text-transform: uppercase;
    color: #ccc;
    font-size: 12px;
`;

const Row = styled.tr<{ isLast: boolean }>`
    border-bottom: ${props => (props.isLast ? '' : '1px solid #e7e7e7')};
`;

const THTokens = styled.th`
    padding-bottom: ${headerPaddingBottom}px;
    text-align: left;
`;

const THAmount = styled.th`
    padding-bottom: ${headerPaddingBottom}px;
    text-align: left;
`;

const TDTokens = styled.td`
    padding: ${rowsVerticalPadding}px 0;
    min-width: 20em;
`;

const TDAmount = styled.td`
    padding: ${rowsVerticalPadding}px 0;
`;

const tokenBalanceToRow = (tokenBalance: TokenBalance, index: number, tokensCount: number) => {
    const { symbol } = tokenBalance.token;

    const decimalsPerToken = new BigNumber(10).pow(tokenBalance.token.decimals);

    const formattedBalance = tokenBalance.balance.div(decimalsPerToken).toFixed(2);

    return (
        <Row key={symbol} isLast={index + 1 === tokensCount}>
            <TDTokens>{symbol}</TDTokens>
            <TDAmount>{formattedBalance}</TDAmount>
        </Row>
    );
};

class WalletTokenBalances extends React.PureComponent<WalletTokenBalancesProps> {
    public render = () => {
        const { knownTokens, web3State } = this.props;

        return (
            <Card title="Token Balances">
                {web3State === Web3State.Error ? (
                    <p>Your wallet is not connected</p>
                ) : (
                    <table>
                        <THead>
                            <tr>
                                <THTokens>Token</THTokens>
                                <THAmount>Available Qty.</THAmount>
                            </tr>
                        </THead>
                        <tbody>
                            {knownTokens.map((tokenBalance, index) =>
                                tokenBalanceToRow(tokenBalance, index, knownTokens.length),
                            )}
                        </tbody>
                    </table>
                )}
            </Card>
        );
    };
}

const mapStateToProps = (state: StoreState): PropsFromState => {
    return {
        knownTokens: getKnownTokens(state),
        web3State: getWeb3State(state),
    };
};

const WalletTokenBalancesContainer = connect(mapStateToProps)(WalletTokenBalances);

export { WalletTokenBalances, WalletTokenBalancesContainer };
