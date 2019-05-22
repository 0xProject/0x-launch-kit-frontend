import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getEthAccount } from '../../store/selectors';
import { truncateAddress } from '../../util/number_utils';
import { StoreState } from '../../util/types';
import { CardBase } from '../common/card_base';
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

const DropdownItems = styled(CardBase)`
    box-shadow: ${props => props.theme.componentsTheme.boxShadow};
    min-width: 240px;
`;

interface OwnProps extends HTMLAttributes<HTMLSpanElement> {
    walletConnectionContent: React.ReactNode;
}

interface StateProps {
    ethAccount: string;
}

type Props = StateProps & OwnProps;

class WalletConnectionStatus extends React.PureComponent<Props> {
    public render = () => {
        const { ethAccount, walletConnectionContent, ...restProps } = this.props;
        const status: string = ethAccount ? 'active' : '';

        const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';
        const header = (
            <WalletConnectionStatusWrapper>
                <WalletConnectionStatusDotStyled status={status} />
                <WalletConnectionStatusText>{ethAccountText}</WalletConnectionStatusText>
                <ChevronDownIcon />
            </WalletConnectionStatusWrapper>
        );

        const body = <DropdownItems>{walletConnectionContent}</DropdownItems>;

        return <Dropdown body={body} header={header} horizontalPosition={DropdownPositions.Right} {...restProps} />;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const WalletConnectionStatusContainer = connect(
    mapStateToProps,
    {},
)(WalletConnectionStatus);

export { WalletConnectionStatus, WalletConnectionStatusContainer };
