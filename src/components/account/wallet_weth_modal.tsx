import { BigNumber } from '0x.js';
import React from 'react';
import Modal from 'react-modal';

import { tokenAmountInUnits, unitsInTokenAmount } from '../../util/tokens';

interface Props extends React.ComponentProps<typeof Modal> {
    ethBalance: BigNumber;
    wethBalance: BigNumber;
    totalEth: BigNumber;
    isSubmitting: boolean;
    onSubmit: (b: BigNumber) => any;
}

interface State {
    selectedWeth: BigNumber;
}

class WethModal extends React.Component<Props, State> {
    public state = {
        selectedWeth: this.props.wethBalance,
    };

    public render = () => {
        const { onSubmit, isSubmitting, totalEth, ethBalance, wethBalance, ...restProps } = this.props;

        const maxEth = totalEth.mul(1.05);

        const initialWethStr = tokenAmountInUnits(this.props.wethBalance, 18);
        const maxEthStr = tokenAmountInUnits(maxEth, 18);
        const selectedWethStr = tokenAmountInUnits(this.state.selectedWeth, 18);

        const ethBalanceStr = tokenAmountInUnits(this.props.ethBalance, 18);
        const wethBalanceStr = tokenAmountInUnits(this.props.wethBalance, 18);

        const isDisabled = selectedWethStr === initialWethStr || isSubmitting;

        return (
            <Modal {...restProps}>
                <span onClick={this.closeModal} style={{float: 'right'}}>X</span>
                <div>{ethBalanceStr} ETH</div>
                <div>{wethBalanceStr} wETH</div>
                <div>Selected: {selectedWethStr}</div>
                <div>
                    <label>
                        Select wETH
                        <input type="range" min="0" max={maxEthStr} step="0.1" value={selectedWethStr} onChange={this.updateSelectedWeth}/>
                    </label>
                </div>
                <button onClick={this.submit} disabled={isDisabled}>Update Balance{isSubmitting && '...'}</button>
            </Modal>
        );
    }

    public submit = () => {
        this.props.onSubmit(this.state.selectedWeth);
    }

    public updateSelectedWeth: React.ReactEventHandler<HTMLInputElement> = e => {
        const { totalEth } = this.props;

        let newSelectedWeth = unitsInTokenAmount(e.currentTarget.value, 18);
        const totalEthMinusFee = totalEth.sub(unitsInTokenAmount('0.5', 18));
        if (newSelectedWeth.greaterThan(totalEthMinusFee)) {
            newSelectedWeth = totalEthMinusFee;
        }

        this.setState({
            selectedWeth: newSelectedWeth,
        });
    }

    public closeModal = (e: any) => {
        if (this.props.onRequestClose) {
            this.props.onRequestClose(e);
        }
    }
}

export { WethModal };
