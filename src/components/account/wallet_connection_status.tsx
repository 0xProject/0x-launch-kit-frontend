import React, { HTMLAttributes } from 'react';
import CopyText from 'react-copy-text';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getEthAccount } from '../../store/selectors';
import { StoreState } from '../../util/types';
import { CardBase } from '../common/card_base';
import { Dropdown, DropdownPositions } from '../common/dropdown';
import { DropdownTextItem } from '../common/dropdown_text_item';
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
    color: #333;
    font-size: 16px;
    font-weight: 500;
    margin-right: 10px;
`;

const DropdownItems = styled(CardBase)`
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

const goToURL = () => {
    alert('go to url');
};

interface State {
    textToCopy: string;
}

class WalletConnectionStatus extends React.PureComponent<Props> {
    public readonly state: State = {
        textToCopy: '',
    };

    private readonly _dropdownItems = [
        {
            onClick: () => {
                this.setState({ textToCopy: this.props.ethAccount ? this.props.ethAccount : '' });
            },
            text: 'Copy Address to Clipboard',
        },
        {
            onClick: connectToWallet,
            text: 'Connect a different Wallet',
        },
        {
            onClick: goToURL,
            text: 'Manage Account',
        },
    ];

    public render = () => {
        const { ethAccount, ...restProps } = this.props;
        const status: string = ethAccount ? 'active' : '';

        const header = (
            <WalletConnectionStatusWrapper>
                <WalletConnectionStatusDot status={status} />
                <WalletConnectionStatusText>
                    {ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected'}
                </WalletConnectionStatusText>
                <ChevronDownIcon />
            </WalletConnectionStatusWrapper>
        );

        const body = (
            <DropdownItems>
                {this._dropdownItems.map((item, index) => {
                    return <DropdownTextItem onClick={item.onClick} key={index} text={item.text} />;
                })}
            </DropdownItems>
        );

        return (
            <>
                <Dropdown body={body} header={header} horizontalPosition={DropdownPositions.Right} {...restProps} />
                <CopyText text={this.state.textToCopy} />
            </>
        );
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
