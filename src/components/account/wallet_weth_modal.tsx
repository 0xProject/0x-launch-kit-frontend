import { BigNumber } from '0x.js';
import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import { tokenAmountInUnits, unitsInTokenAmount } from '../../util/tokens';
import { Button as ButtonBase } from '../common/button';

interface Props extends React.ComponentProps<typeof Modal> {
    wethBalance: BigNumber;
    totalEth: BigNumber;
    isSubmitting: boolean;
    onSubmit: (b: BigNumber) => any;
}

interface State {
    selectedWeth: BigNumber;
}

const Slider = styled.input`
    -webkit-appearance: none;
    margin: 1em 0;
    cursor: pointer;
    width: 100%;

    &:focus {
        outline: none;
    }

    &::-webkit-slider-runnable-track {
        height: 0.25em;

        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        background: #3071a9;
        border-radius: 1.3px;
        border: 0.2px solid #010101;
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
        border: 0.5px solid rgba(0, 0, 0, 0.142);
        height: 1em;
        width: 1em;
        border-radius: 1em;
        background: white;
        cursor: pointer;
        margin-top: -0.4em;
    }
`;

const Button = styled(ButtonBase)`
    width: 100%;
    font-weight: bold;
`;

const CloseButton = styled.span`
    float: right;
    cursor: pointer;
`;

const Title = styled.h1`
    clear: both;
    font-size: 20px;
    text-align: center;
`;

const SetMinEthWrapper = styled.div`
    margin-bottom: 1rem;
`;

const SetMinEthButton = styled.a`
    display: inline-block;
    color: black;
    text-decoration: none;
    border-bottom: 1px dotted black;
`;

const EthBox = styled.div`
    display: inline-block;
    text-align: center;
    border: 1px solid #dedede;
    padding: 28px 40px;
`;
const WethBox = styled(EthBox)`
    float: right;
`;

const EthBoxValue = styled.div`
    font-size: 24px;
    color: #666666;
`;
const EthBoxUnit = styled.div``;

const minEth = unitsInTokenAmount('0.5', 18);

class WethModal extends React.Component<Props, State> {
    public state = {
        selectedWeth: this.props.wethBalance,
    };

    public render = () => {
        const { onSubmit, isSubmitting, totalEth, wethBalance, ...restProps } = this.props;

        const selectedEth = totalEth.sub(this.state.selectedWeth);

        const initialWethStr = tokenAmountInUnits(this.props.wethBalance, 18);
        const selectedWethStr = tokenAmountInUnits(this.state.selectedWeth, 18);
        const selectedEthStr = tokenAmountInUnits(selectedEth, 18);
        const totalEthStr = tokenAmountInUnits(totalEth, 18);

        const isInsufficientEth = selectedEth.lessThan(minEth);

        const isDisabled = selectedWethStr === initialWethStr || isSubmitting || isInsufficientEth;

        return (
            <Modal {...restProps}>
                <CloseButton onClick={this.closeModal}>X</CloseButton>
                <Title>Available Balance</Title>
                <EthBox>
                    <EthBoxValue>{selectedEthStr}</EthBoxValue>
                    <EthBoxUnit>ETH</EthBoxUnit>
                </EthBox>
                <WethBox>
                    <EthBoxValue>{selectedWethStr}</EthBoxValue>
                    <EthBoxUnit>wETH</EthBoxUnit>
                </WethBox>
                <div>
                    <Slider
                        type="range"
                        min="0"
                        max={totalEthStr}
                        step="0.01"
                        value={selectedWethStr}
                        onChange={this.updateSelectedWeth}
                    />
                </div>
                {isInsufficientEth ? (
                    <SetMinEthWrapper>
                        ETH required for fees.&nbsp;
                        <SetMinEthButton href="" onClick={this.setMinEth}>
                            0.5 ETH Recommended
                        </SetMinEthButton>
                    </SetMinEthWrapper>
                ) : (
                    <SetMinEthWrapper>&nbsp;</SetMinEthWrapper>
                )}
                <Button onClick={this.submit} disabled={isDisabled}>
                    Update Balance{isSubmitting && '...'}
                </Button>
            </Modal>
        );
    };

    public submit = () => {
        this.props.onSubmit(this.state.selectedWeth);
    };

    public updateSelectedWeth: React.ReactEventHandler<HTMLInputElement> = e => {
        const newSelectedWeth = unitsInTokenAmount(e.currentTarget.value, 18);

        this.setState({
            selectedWeth: newSelectedWeth,
        });
    };

    public closeModal = (e: any) => {
        if (this.props.onRequestClose) {
            this.props.onRequestClose(e);
        }
    };

    public setMinEth: React.ReactEventHandler<HTMLAnchorElement> = e => {
        e.preventDefault();

        this.setState({
            selectedWeth: this.props.totalEth.sub(minEth),
        });
    };
}

export { WethModal };
