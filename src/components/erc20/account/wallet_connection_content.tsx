import React, { HTMLAttributes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { goToHomeLaunchpad, goToHomeMarginLend, logoutWallet } from '../../../store/actions';
import { getEthAccount } from '../../../store/selectors';
import { connectToExplorer, viewOnFabrx } from '../../../util/external_services';
import { truncateAddress } from '../../../util/number_utils';
import { viewAddressOnEtherscan } from '../../../util/transaction_link';
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
    onGoToHomeLaunchpad: () => any;
    onGoToHomeMarginLend: () => any;
}

type Props = StateProps & OwnProps & DispatchProps;

const DropdownItems = styled(CardBase)`
    box-shadow: ${props => props.theme.componentsTheme.boxShadow};
    min-width: 240px;
`;

class WalletConnectionContent extends React.PureComponent<Props> {
    public render = () => {
        const { ethAccount, onLogoutWallet, onGoToHomeLaunchpad, onGoToHomeMarginLend, ...restProps } = this.props;
        const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';

        const openFabrx = () => {
            viewOnFabrx(ethAccount);
        };

        const viewAccountExplorer = () => {
            viewAddressOnEtherscan(ethAccount);
        };

        const content = (
            <DropdownItems>
                <CopyToClipboard text={ethAccount ? ethAccount : ''}>
                    <DropdownTextItem text="Copy Address to Clipboard" />
                </CopyToClipboard>
                <DropdownTextItem onClick={viewAccountExplorer} text="View Address on Etherscan" />
                <DropdownTextItem onClick={connectToExplorer} text="Track DEX volume" />
                <DropdownTextItem onClick={openFabrx} text="Set Alerts" />
                <DropdownTextItem onClick={onGoToHomeLaunchpad} text="Launchpad" />
                <DropdownTextItem onClick={onGoToHomeMarginLend} text="Lend" />
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
        onGoToHomeLaunchpad: () => dispatch(goToHomeLaunchpad()),
        onGoToHomeMarginLend: () => dispatch(goToHomeMarginLend()),
    };
};

const WalletConnectionContentContainer = connect(mapStateToProps, mapDispatchToProps)(WalletConnectionContent);

export { WalletConnectionContent, WalletConnectionContentContainer };
