import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { updateWethBalance } from '../../store/actions';
import { getEthBalance, getWeb3State, getWethBalance } from '../../store/selectors';
import { tokenAmountInUnits } from '../../util/tokens';
import { StoreState, Web3State } from '../../util/types';
import { Card } from '../common/card';
import { CardLoading } from '../common/loading';

import { WethModal } from './wallet_weth_modal';

interface StateProps {
    ethBalance: BigNumber;
    wethBalance: BigNumber;
    web3State: Web3State;
}
interface DispatchProps {
    onUpdateWethBalance: (newBalance: BigNumber) => Promise<any>;
}

type Props = StateProps & DispatchProps;

interface State {
    modalIsOpen: boolean;
    selectedWeth: string;
    isSubmitting: boolean;
}

const Content = styled.div`
    position: relative;
    font-size: 16px;
`;

const Row = styled.div`
    width: 100%;
    padding: 18px 30px;
    border-bottom: solid 1px #dedede;
`;

const Label = styled.div`
    display: inline-block;
    width: 30%;
`;

const Value = styled.div`
    display: inline-block;
    width: 70%;
    text-align: right;
    font-weight: bold;
`;

const Button = styled.button`
    padding: 4px 10px 10px 10px;
    background-color: white;
    border: 1px solid #dedede;
    border-radius: 4px;

    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    &:focus {
        outline: none;
    }
`;

const ButtonLabel = styled.span`
    line-height: 32px;
    vertical-align: bottom;
`;

const Arrow = styled.span`
    font-size: 32px;
`;
const ArrowUp = styled(Arrow)``;
const ArrowDown = styled(Arrow)`
    margin-left: -5px;
`;

const modalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '350px',
    },
};

class WalletWethBalance extends React.PureComponent<Props, State> {
    public readonly state: State = {
        modalIsOpen: false,
        selectedWeth: '0',
        isSubmitting: false,
    };

    public render = () => {
        const { ethBalance, web3State, wethBalance } = this.props;
        const { isSubmitting } = this.state;
        const totalEth = ethBalance.add(wethBalance);

        const formattedEth = tokenAmountInUnits(ethBalance, 18);
        const formattedWeth = tokenAmountInUnits(wethBalance, 18);
        const formattedTotalEth = tokenAmountInUnits(totalEth, 18);

        let content: React.ReactNode;
        if (web3State === Web3State.Done) {
            content = (
                <>
                    <Row>
                        <Label>ETH</Label>
                        <Value>{formattedEth}</Value>
                    </Row>
                    <Button onClick={this.openModal}>
                        <ButtonLabel>Convert</ButtonLabel> <ArrowUp>↑</ArrowUp>
                        <ArrowDown>↓</ArrowDown>
                    </Button>
                    <Row>
                        <Label>wETH</Label>
                        <Value>{formattedWeth}</Value>
                    </Row>
                    <Row>
                        <Label>Total Value</Label>
                        <Value>{formattedTotalEth} ETH</Value>
                    </Row>
                    <WethModal
                        wethBalance={wethBalance}
                        totalEth={totalEth}
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        style={modalStyle}
                        onSubmit={this.handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                </>
            );
        } else {
            content = <CardLoading />;
        }

        return (
            <Card title="ETH/wETH Balances">
                <Content>{content}</Content>
            </Card>
        );
    };

    public handleSubmit = async (newWeth: BigNumber) => {
        this.setState({
            isSubmitting: true,
        });
        try {
            await this.props.onUpdateWethBalance(newWeth);
        } finally {
            this.setState({
                isSubmitting: false,
            });
            this.closeModal();
        }
    };

    public openModal = () => {
        this.setState({
            modalIsOpen: true,
        });
    };

    public closeModal = () => {
        this.setState({
            modalIsOpen: false,
        });
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethBalance: getEthBalance(state),
        wethBalance: getWethBalance(state),
        web3State: getWeb3State(state),
    };
};
const mapDispatchToProps = {
    onUpdateWethBalance: updateWethBalance,
};

const WalletWethBalanceContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WalletWethBalance);

export { WalletWethBalance, WalletWethBalanceContainer };
