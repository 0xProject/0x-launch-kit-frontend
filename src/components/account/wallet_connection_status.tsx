import React from 'react';
import { connect } from 'react-redux';

import { getEthAccount } from '../../store/selectors';
import { StoreState } from '../../store/types';

interface PropsFromState {
    ethAccount: string;
}

type WalletConnectionStatusProps = PropsFromState;

class WalletConnectionStatus extends React.PureComponent<WalletConnectionStatusProps> {
    public render = () => {
        const { ethAccount } = this.props;
        return (
            <div className="wallet-connection-status">
                <p>{ethAccount ? `Connected with: ${ethAccount}` : 'Not connected'}</p>
            </div>
        );
    };
}

const mapStateToProps = (state: StoreState): PropsFromState => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const WalletConnectionStatusContainer = connect(mapStateToProps)(WalletConnectionStatus);

export { WalletConnectionStatus, WalletConnectionStatusContainer };
