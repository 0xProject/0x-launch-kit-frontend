import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getKnownTokens } from '../../store/selectors';
import { tokenAmountInUnits } from '../../util/tokens';
import { StoreState, TokenBalance } from '../../util/types';
import { Card } from '../common/card';
import { TH, THead } from '../common/table';

interface PropsFromState {
    knownTokens: TokenBalance[];
}

type WalletTokenBalancesProps = PropsFromState;

const Row = styled.tr<{ isLast: boolean }>`
    border-bottom: ${props => (props.isLast ? '' : '1px solid #e7e7e7')};
`;

const TD = styled.td`
    padding: 10px 0;
`;

const TDTokens = styled(TD)`
    min-width: 20em;
`;

const tokenBalanceToRow = (tokenBalance: TokenBalance, index: number, tokensCount: number) => {
    const { symbol } = tokenBalance.token;

    const formattedBalance = tokenAmountInUnits(tokenBalance.token, tokenBalance.balance);

    return (
        <Row key={symbol} isLast={index + 1 === tokensCount}>
            <TDTokens>{symbol}</TDTokens>
            <TD>{formattedBalance}</TD>
        </Row>
    );
};

class WalletTokenBalances extends React.PureComponent<WalletTokenBalancesProps> {
    public render = () => {
        const { knownTokens } = this.props;

        return (
            <Card title="Token Balances">
                <table>
                    <THead>
                        <tr>
                            <TH>Token</TH>
                            <TH>Available Qty.</TH>
                        </tr>
                    </THead>
                    <tbody>
                        {knownTokens.map((tokenBalance, index) =>
                            tokenBalanceToRow(tokenBalance, index, knownTokens.length),
                        )}
                    </tbody>
                </table>
            </Card>
        );
    };
}

const mapStateToProps = (state: StoreState): PropsFromState => {
    return {
        knownTokens: getKnownTokens(state),
    };
};

const WalletTokenBalancesContainer = connect(mapStateToProps)(WalletTokenBalances);

export { WalletTokenBalances, WalletTokenBalancesContainer };
