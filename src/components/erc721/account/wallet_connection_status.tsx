import React, { HTMLAttributes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getEthAccount } from '../../../store/selectors';
import { themeFeatures } from '../../../themes/commons';
import { StoreState } from '../../../util/types';
import { WalletWethBalanceContainer } from '../../account';
import { CardBase } from '../../common/card_base';
import { Dropdown, DropdownPositions } from '../../common/dropdown';
import { DropdownTextItem } from '../../common/dropdown_text_item';
import { ChevronDownIcon } from '../../common/icons/chevron_down_icon';

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
    color: #333;
    font-feature-settings: 'calt' 0;
    font-size: 16px;
    font-weight: 500;
    margin-right: 10px;
`;

const DropdownItems = styled(CardBase)`
    box-shadow: ${themeFeatures.boxShadow};
    min-width: 240px;
`;

interface OwnProps extends HTMLAttributes<HTMLSpanElement> {}

interface StateProps {
    ethAccount: string;
}

type Props = StateProps & OwnProps;

const truncateAddress = (address: string) => {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
};

const connectToWallet = () => {
    alert('connect to another wallet');
};

class WalletConnectionStatus extends React.PureComponent<Props> {
    public render = () => {
        const { ethAccount, ...restProps } = this.props;
        const status: string = ethAccount ? 'active' : '';

        const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';
        const header = (
            <WalletConnectionStatusWrapper>
                <WalletConnectionStatusDot status={status} />
                <WalletConnectionStatusText>{ethAccountText}</WalletConnectionStatusText>
                <ChevronDownIcon />
            </WalletConnectionStatusWrapper>
        );

        const body = (
            <DropdownItems>
                <DropdownTextItem text={ethAccountText} />
                <WalletWethBalanceContainer />
                <CopyToClipboard text={ethAccount ? ethAccount : ''}>
                    <DropdownTextItem text="Copy Address" />
                </CopyToClipboard>
                <DropdownTextItem onClick={connectToWallet} text="Connect a different address" />
            </DropdownItems>
        );

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
