import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { WalletTokenBalancesContainer, WalletWethBalanceContainer } from '../components/account';
import { ColumnNarrow } from '../components/common/column_narrow';
import { ColumnWide } from '../components/common/column_wide';
import { MetamaskErrorModal } from '../components/common/metamask_error_modal';
import { connectWallet, goToHome } from '../store/actions';
import { getWeb3State } from '../store/selectors';
import { ModalDisplay, StoreState, Web3State } from '../util/types';

interface State {
    isModalOpen: boolean;
    modalToDisplay: ModalDisplay | null;
}

interface StateProps {
    web3State: Web3State;
}

interface DispatchProps {
    onGoToHome: () => any;
    onConnectWallet: () => any;
}

type Props = StateProps & DispatchProps;

class MyWallet extends React.Component<Props, State> {
    public state = {
        isModalOpen: true,
        modalToDisplay: null,
    };

    public componentDidMount = () => {
        this._updateState();
    };

    public componentDidUpdate = (prevProps: Readonly<Props>) => {
        const { web3State } = this.props;
        if (prevProps.web3State !== web3State) {
            this._updateState();
        }
    };

    public render = () => {
        const { isModalOpen, modalToDisplay } = this.state;
        const { onConnectWallet, onGoToHome } = this.props;
        let modalContent = null;
        if (modalToDisplay) {
            modalContent = (
                <MetamaskErrorModal
                    isOpen={isModalOpen}
                    closeModal={onGoToHome}
                    noMetamaskType={modalToDisplay}
                    connectWallet={onConnectWallet}
                />
            );
        }

        return (
            <>
                <ColumnNarrow>
                    <WalletWethBalanceContainer />
                </ColumnNarrow>
                <ColumnWide>
                    <WalletTokenBalancesContainer />
                </ColumnWide>
                {modalContent}
            </>
        );
    };

    private readonly _updateState = () => {
        const { web3State } = this.props;
        if (web3State === Web3State.Locked) {
            this.setState({ isModalOpen: true, modalToDisplay: ModalDisplay.EnablePermissions });
        } else if (web3State === Web3State.NotInstalled) {
            this.setState({ isModalOpen: true, modalToDisplay: ModalDisplay.InstallMetamask });
        }
    };
}
const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    return {
        onGoToHome: () => dispatch(goToHome()),
        onConnectWallet: () => dispatch(connectWallet()),
    };
};

const MyWalletContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MyWallet);

export { MyWallet, MyWalletContainer };
