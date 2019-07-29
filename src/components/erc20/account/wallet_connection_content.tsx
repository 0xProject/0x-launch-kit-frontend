import React, { HTMLAttributes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { logoutWallet } from '../../../store/actions';
import { getEthAccount } from '../../../store/selectors';
import { truncateAddress } from '../../../util/number_utils';
import { StoreState } from '../../../util/types';
import { WalletConnectionStatusContainer } from '../../account/wallet_connection_status';
import { CardBase } from '../../common/card_base';
import { DropdownTextItem } from '../../common/dropdown_text_item';

interface OwnProps extends HTMLAttributes<HTMLSpanElement> {}

interface StateProps {
    ethAccount: string;
}
interface DispatchProps {
    onLogoutWallet: () => any;
}

type Props = StateProps & OwnProps & DispatchProps;

const connectToExplorer = () => {
    window.open('https://0xtracker.com/search?q=0x5265bde27f57e738be6c1f6ab3544e82cdc92a8f');
};

const DropdownItems = styled(CardBase)`
    box-shadow: ${props => props.theme.componentsTheme.boxShadow};
    min-width: 240px;
`;

class WalletConnectionContent extends React.PureComponent<Props> {
    public render = () => {
        const { ethAccount, onLogoutWallet, ...restProps } = this.props;
        const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';

        const viewOnEtherscan = () => {
            window.open(`https://etherscan.io/address/${ethAccount}`);
        };

        const viewOnFabrx = () => {
            window.open(
                `https://dash.fabrx.io/thread/partner/VeriDex&a3bccf&1127661506559188992--K_DyiHA0_400x400--jpg&ETH&${ethAccount}/`,
            );
        };

        const content = (
            <DropdownItems>
                <CopyToClipboard text={ethAccount ? ethAccount : ''}>
                    <DropdownTextItem text="Copy Address to Clipboard" />
                </CopyToClipboard>
                <DropdownTextItem onClick={viewOnEtherscan} text="View Address on Etherscan" />
                <DropdownTextItem onClick={connectToExplorer} text="Track DEX volume" />
                <DropdownTextItem onClick={viewOnFabrx} text="Set Alerts" />
                <DropdownTextItem onClick={onLogoutWallet} text="Logout Wallet" />
            </DropdownItems>
        );

        return (
            <WalletConnectionStatusContainer
                walletConnectionContent={content}
                headerText={ethAccountText}
                ethAccount={ethAccount}
                {...restProps}
            />
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
    };
};
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onLogoutWallet: () => dispatch(logoutWallet()),
    };
};

const WalletConnectionContentContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WalletConnectionContent);

export { WalletConnectionContent, WalletConnectionContentContainer };
