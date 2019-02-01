import React from 'react';
import { connect } from 'react-redux';

import { getEthAccount } from '../../store/selectors';
import { StoreState } from '../../util/types';

interface PropsFromState {
    ethAccount: string;
}

type WalletConnectionStatusProps = PropsFromState & {
    style?: React.CSSProperties;
};

const truncateAddress = (address: string) => {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
};

class WalletConnectionStatus extends React.PureComponent<WalletConnectionStatusProps> {
    public render = () => {
        const { ethAccount, ...restProps } = this.props;

        return (
            <span className="wallet-connection-status" {...restProps}>
                {ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected'}
            </span>
        );
    };
}

const mapStateToProps = (state: StoreState): PropsFromState => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const mapDispatchToProps = (state: StoreState): {} => {
    return {};
};

const WalletConnectionStatusContainer = connect(mapStateToProps, mapDispatchToProps)(WalletConnectionStatus);

export { WalletConnectionStatus, WalletConnectionStatusContainer };
