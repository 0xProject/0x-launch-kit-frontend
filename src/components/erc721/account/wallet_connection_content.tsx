import React, { HTMLAttributes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';

import { getEthAccount } from '../../../store/selectors';
import { StoreState } from '../../../util/types';
import { WalletWethBalanceContainer } from '../../account';
import { WalletConnectionStatusContainer } from '../../account/wallet_connection_status';
import { DropdownTextItem } from '../../common/dropdown_text_item';

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

class WalletConnectionContent extends React.PureComponent<Props> {
    public render = () => {
        const { ethAccount } = this.props;

        const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';

        const content = (
            <>
                <DropdownTextItem text={ethAccountText} />
                <WalletWethBalanceContainer />
                <CopyToClipboard text={ethAccount ? ethAccount : ''}>
                    <DropdownTextItem text="Copy Address" />
                </CopyToClipboard>
                <DropdownTextItem onClick={connectToWallet} text="Connect a different address" />
            </>
        );

        return <WalletConnectionStatusContainer walletConnectionContent={content} />;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const WalletConnectionContentContainer = connect(
    mapStateToProps,
    {},
)(WalletConnectionContent);

export { WalletConnectionContent, WalletConnectionContentContainer };
