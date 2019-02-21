import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { lockToken, unlockToken } from '../../store/actions';
import { getTokenBalances, getWeb3State } from '../../store/selectors';
import { tokenAmountInUnits } from '../../util/tokens';
import { StoreState, Token, TokenBalance, Web3State } from '../../util/types';
import { Card } from '../common/card';
import { CardLoading } from '../common/loading';
import { TH as THBase, THead } from '../common/table';

interface StateProps {
    tokenBalances: TokenBalance[];
    web3State: Web3State;
}
interface DispatchProps {
    onUnlockToken: (token: Token) => void;
    onLockToken: (token: Token) => void;
}

type Props = StateProps & DispatchProps;

const TR = styled.tr`
    &:last-child {
        border-bottom: 1px solid #e7e7e7;
    }
`;

const TH = styled(THBase)`
    padding: 10px 0;

    &:first-child {
        padding-left: 18px;
    }
`;

const THBalance = styled(TH)`
    text-align: right;
`;

const THLock = styled(TH)`
    text-align: center;
`;

const TD = styled.td`
    padding: 10px 0;
    white-space: nowrap;

    &:first-child {
        padding-left: 18px;
    }

    &:last-child {
        width: 100%;
    }
`;

const TDTokens = styled(TD)`
    min-width: 10em;
`;

const TDBalance = styled(TD)`
    min-width: 10em;
    text-align: right;
`;

const TDLock = styled(TD)<{ isUnlocked: boolean }>`
    min-width: 6em;
    text-align: center;
    cursor: ${props => (props.isUnlocked ? 'default' : 'pointer')};
    color: ${props => (props.isUnlocked ? '#c4c4c4' : 'black')};
`;

interface LockCellProps {
    isUnlocked: boolean;
    onClick: any;
}

const LockCell = ({ isUnlocked, onClick }: LockCellProps) => {
    return (
        <TDLock isUnlocked={isUnlocked} onClick={onClick}>
            <FontAwesomeIcon icon={isUnlocked ? 'lock-open' : 'lock'} />
        </TDLock>
    );
};

class WalletTokenBalances extends React.PureComponent<Props> {
    public render = () => {
        const { tokenBalances, onUnlockToken, onLockToken, web3State } = this.props;

        const rows = tokenBalances.map((tokenBalance, index) => {
            const { token, balance, isUnlocked } = tokenBalance;
            const { symbol } = token;

            const formattedBalance = tokenAmountInUnits(balance, token.decimals);

            const onClick = () => {
                isUnlocked ? onLockToken(token) : onUnlockToken(token);
            };

            return (
                <TR key={symbol}>
                    <TDTokens>{symbol}</TDTokens>
                    <TDBalance>{formattedBalance}</TDBalance>
                    <LockCell isUnlocked={isUnlocked} onClick={onClick} />
                    <TD />
                </TR>
            );
        });

        let content: React.ReactNode;
        if (web3State === Web3State.Loading) {
            content = <CardLoading />;
        } else {
            content = (
                <table>
                    <THead>
                        <TR>
                            <TH>Token</TH>
                            <THBalance>Available Qty.</THBalance>
                            <THLock>Locked?</THLock>
                            <TH />
                        </TR>
                    </THead>
                    <tbody>{rows}</tbody>
                </table>
            );
        }

        return <Card title="Token Balances">{content}</Card>;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        tokenBalances: getTokenBalances(state),
        web3State: getWeb3State(state),
    };
};
const mapDispatchToProps = {
    onUnlockToken: unlockToken,
    onLockToken: lockToken,
};

const WalletTokenBalancesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WalletTokenBalances);

export { WalletTokenBalances, WalletTokenBalancesContainer };
