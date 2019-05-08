import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getEthAccount } from '../../store/selectors';
import { StoreState } from '../../util/types';
import { CardBase } from '../common/card_base';
import { Dropdown, DropdownPositions } from '../common/dropdown';
import { ChevronDownIcon } from '../common/icons/chevron_down_icon';

interface WrapperProps {
    status?: string;
}

const WalletConnectionStatusWrapper = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
`;

const WalletConnectionStatusDot = styled.div<WrapperProps>`
    background-color: ${props => (props.status ? '#55BC65' : '#ccc')};
    border-radius: 50%;
    height: 10px;
    margin-right: 10px;
    width: 10px;
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

const truncateAddress = (address: string) => {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
};

class WalletConnectionStatus extends React.PureComponent<Props> {
    public render = () => {
        const { ethAccount, walletConnectionContent, ...restProps } = this.props;
        const status: string = ethAccount ? 'active' : '';

        const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';
        const header = (
            <WalletConnectionStatusWrapper>
                <WalletConnectionStatusDot status={status} />
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
