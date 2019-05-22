import { BigNumber } from '0x.js';
import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ETH_DECIMALS } from '../../common/constants';
import { getEthAccount, getEthBalance } from '../../store/selectors';
import { truncateAddress } from '../../util/number_utils';
import { tokenAmountInUnits } from '../../util/tokens';
import { StoreState } from '../../util/types';
import { Dropdown, DropdownPositions } from '../common/dropdown';
import { ChevronDownIcon } from '../common/icons/chevron_down_icon';

import { WalletConnectionStatusDot } from './wallet_connections_status_dot';

const WalletConnectionStatusWrapper = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
`;

const WalletConnectionStatusDotStyled = styled(WalletConnectionStatusDot)`
    margin-right: 10px;
`;

const WalletConnectionStatusText = styled.span`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-feature-settings: 'calt' 0;
    font-size: 16px;
    font-weight: 500;
    margin-right: 10px;
`;

interface OwnProps extends HTMLAttributes<HTMLSpanElement> {
    walletConnectionContent: React.ReactNode;
    shouldShowEthAccountInHeader: boolean;
}

interface StateProps {
    ethAccount: string;
    ethBalance: BigNumber;
}

type Props = StateProps & OwnProps;

class WalletConnectionStatus extends React.PureComponent<Props> {
    public render = () => {
        const {
            ethAccount,
            ethBalance,
            walletConnectionContent,
            shouldShowEthAccountInHeader,
            ...restProps
        } = this.props;
        const status: string = ethAccount ? 'active' : '';

        const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';
        const ethBalanceText = ethBalance ? `${tokenAmountInUnits(ethBalance, ETH_DECIMALS)} ETH` : 'No connected';

        const headerText = shouldShowEthAccountInHeader ? ethAccountText : ethBalanceText;
        const header = (
            <WalletConnectionStatusWrapper>
                <WalletConnectionStatusDotStyled status={status} />
                <WalletConnectionStatusText>{headerText}</WalletConnectionStatusText>
                <ChevronDownIcon />
            </WalletConnectionStatusWrapper>
        );

        const body = <>{walletConnectionContent}</>;

        return <Dropdown body={body} header={header} horizontalPosition={DropdownPositions.Right} {...restProps} />;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
        ethBalance: getEthBalance(state),
    };
};

const WalletConnectionStatusContainer = connect(
    mapStateToProps,
    {},
)(WalletConnectionStatus);

export { WalletConnectionStatus, WalletConnectionStatusContainer };
