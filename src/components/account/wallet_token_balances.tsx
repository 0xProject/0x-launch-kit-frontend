import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { unlockToken } from '../../store/actions';
import { getTokenBalances } from '../../store/selectors';
import { tokenAmountInUnits } from '../../util/tokens';
import { StoreState, Token, TokenBalance } from '../../util/types';
import { Card } from '../common/card';
import { TH, THead } from '../common/table';

interface StateProps {
    tokenBalances: TokenBalance[];
}
interface DispatchProps {
    onUnlockToken: (token: Token) => void;
}

type Props = StateProps & DispatchProps;

const Row = styled.tr<{ isLast: boolean }>`
    border-bottom: ${props => (props.isLast ? '' : '1px solid #e7e7e7')};
`;

const TD = styled.td`
    padding: 10px 0;
`;

const TDTokens = styled(TD)`
    min-width: 20em;
`;

const TDLock = styled(TD)<{ isUnlocked: boolean }>`
    text-align: center;
    cursor: ${props => props.isUnlocked ? 'default' : 'pointer'};
    color: ${props => props.isUnlocked ? '#c4c4c4' : 'black'};
`;

interface LockCellProps {
    isUnlocked: boolean;
    onClick: any;
}

const LockCell = ({ isUnlocked, onClick }: LockCellProps) => {
    return <TDLock isUnlocked={isUnlocked} onClick={onClick}>
        <FontAwesomeIcon icon={isUnlocked ? 'lock-open' : 'lock'} />
    </TDLock>;
};

class WalletTokenBalances extends React.PureComponent<Props> {
    public render = () => {
        const { tokenBalances, onUnlockToken } = this.props;

        const rows = tokenBalances.map((tokenBalance, index) => {
            const { token, balance, isUnlocked } = tokenBalance;
            const { symbol } = token;

            const formattedBalance = tokenAmountInUnits(token, balance);

            const onClick = () => {
                if (!isUnlocked) {
                    onUnlockToken(token);
                }
            };

            return (
            <Row key={symbol} isLast={index + 1 === tokenBalances.length}>
                <TDTokens>{symbol}</TDTokens>
                <TD>{formattedBalance}</TD>
                <LockCell isUnlocked={isUnlocked} onClick={onClick} />
            </Row>
            );
        });

        return (
            <Card title="Token Balances">
                <table>
                    <THead>
                        <tr>
                            <TH>Token</TH>
                            <TH>Available Qty.</TH>
                            <TH>Locked?</TH>
                        </tr>
                    </THead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </Card>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        tokenBalances: getTokenBalances(state),
    };
};
const mapDispatchToProps = {
    onUnlockToken: unlockToken,
};

const WalletTokenBalancesContainer = connect(mapStateToProps, mapDispatchToProps)(WalletTokenBalances);

export { WalletTokenBalances, WalletTokenBalancesContainer };
