import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { lockToken, unlockTokenAndUpdateTokenBalance } from '../../store/actions';
import { getTokenBalances, getWeb3State } from '../../store/selectors';
import { tokenAmountInUnits } from '../../util/tokens';
import { StoreState, Token, TokenBalance, Web3State } from '../../util/types';
import { Card } from '../common/card';
import { TokenIcon } from '../common/icons/token_icon';
import { CardLoading } from '../common/loading';
import { CustomTD, CustomTDLast, Table, TH, THead, THLast, TR } from '../common/table';

interface StateProps {
    tokenBalances: TokenBalance[];
    web3State: Web3State;
}
interface DispatchProps {
    onUnlockToken: (token: Token) => void;
    onLockToken: (token: Token) => void;
}

type Props = StateProps & DispatchProps;

const TokenTD = styled(CustomTD)`
    padding-bottom: 10px;
    padding-top: 10px;
    width: 50px;
`;

const TokenIconStyled = styled(TokenIcon)`
    margin: 0 auto;
`;

const CustomTDTokenName = styled(CustomTD)`
    white-space: nowrap;
`;

const TokenName = styled.span`
    font-weight: 700;
`;

const TBody = styled.tbody`
    > tr:last-child > td {
        border-bottom: none;
    }
`;

const FontAwesomeIconStyles = styled(FontAwesomeIcon)`
    cursor: pointer;
`;

const CustomTDLock = styled(CustomTDLast)<{ isUnlocked?: boolean }>`
    color: ${props => (props.isUnlocked ? '#c4c4c4' : '#000')};
`;

interface LockCellProps {
    isUnlocked: boolean;
    onClick: any;
    styles?: any;
}

const LockCell = ({ styles, isUnlocked, onClick }: LockCellProps) => {
    return (
        <CustomTDLock isUnlocked={isUnlocked} styles={styles} onClick={onClick}>
            <FontAwesomeIconStyles icon={isUnlocked ? 'lock-open' : 'lock'} />
        </CustomTDLock>
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
                    <TokenTD>
                        <TokenIconStyled token={token} />
                    </TokenTD>
                    <CustomTDTokenName styles={{ borderBottom: true }}>
                        <TokenName>{token.symbol.toUpperCase()}</TokenName> {`- ${token.name}`}
                    </CustomTDTokenName>
                    <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>{formattedBalance}</CustomTD>
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
            content = <CardLoading />;
        } else {
            content = (
                <Table isResponsive={true}>
                    <THead>
                        <TR>
                            <TH>Token</TH>
                            <TH>{}</TH>
                            <TH styles={{ textAlign: 'center' }}>Available Qty.</TH>
                            <TH styles={{ textAlign: 'center' }}>Price (USD)</TH>
                            <TH styles={{ textAlign: 'center' }}>% Change</TH>
                            <THLast styles={{ textAlign: 'center' }}>Locked?</THLast>
                        </TR>
                    </THead>
                    <TBody>{rows}</TBody>
                </Table>
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
    onUnlockToken: unlockTokenAndUpdateTokenBalance,
    onLockToken: lockToken,
};

const WalletTokenBalancesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WalletTokenBalances);

export { WalletTokenBalances, WalletTokenBalancesContainer };
