import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';

import { getEthAccount } from '../../store/selectors';
import { StoreState } from '../../store/types';

interface Props extends HTMLAttributes<HTMLSpanElement> {
    ethAccount: string;
}

const truncateAddress = (address: string) => {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
};

class WalletConnectionStatus extends React.PureComponent<Props> {
    public render = () => {
        const { ethAccount, ...restProps } = this.props;

        return (
            <span className="wallet-connection-status" {...restProps}>
                {ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected'}
            </span>
        );
    };
}

const mapStateToProps = (state: StoreState): Props => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const WalletConnectionStatusContainer = connect(mapStateToProps, {})(WalletConnectionStatus);

export { WalletConnectionStatus, WalletConnectionStatusContainer };
