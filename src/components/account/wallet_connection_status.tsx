import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';

import { getEthAccount } from '../../store/selectors';
import { StoreState } from '../../util/types';

interface OwnProps extends HTMLAttributes<HTMLSpanElement> {}

interface StateProps {
    ethAccount: string;
}

type Props = StateProps & OwnProps;

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

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const WalletConnectionStatusContainer = connect(mapStateToProps, {})(WalletConnectionStatus);

export { WalletConnectionStatus, WalletConnectionStatusContainer };
