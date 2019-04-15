import { BigNumber } from '0x.js';
import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import { themeColors } from '../../util/theme';
import { tokenAmountInUnits, unitsInTokenAmount } from '../../util/tokens';
import { BigNumberInput } from '../common/big_number_input';
import { Button as ButtonBase } from '../common/button';
import { CloseModalButton } from '../common/icons/close_modal_button';
import { Tooltip } from '../common/tooltip';

enum ETHBoxType {
    Eth,
    Weth,
}

enum Editing {
    Eth,
    None,
    Weth,
}

interface Props extends React.ComponentProps<typeof Modal> {
    isSubmitting: boolean;
    onSubmit: (b: BigNumber) => any;
    totalEth: BigNumber;
    wethBalance: BigNumber;
    ethInUsd: BigNumber | null;
}

interface State {
    editing: Editing;
    selectedWeth: BigNumber;
}

const Slider = styled.input`
    -webkit-appearance: none;
    cursor: pointer;
    margin: 0 0 20px;
    width: 100%;

    &:focus {
        outline: none;
    }

    &::-webkit-slider-runnable-track {
        background: ${themeColors.darkBlue};
        border-radius: 1.3px;
        border: none;
        height: 5px;
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: #fff;
        border-radius: 1em;
        border: 0.5px solid rgba(0, 0, 0, 0.142);
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
        cursor: pointer;
        height: 16px;
        margin-top: -6px;
        width: 16px;
    }
`;

const Button = styled(ButtonBase)`
    width: 100%;
`;

const Title = styled.h1`
    color: #000;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

const ETHPrice = styled.div`
    position: absolute;
    width: 243px;
    height: 19px;
    left: 54px;
    top: 60px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color: ${themeColors.textLight};
`;

const EthBoxes = styled.div`
    column-gap: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 25px;
    padding-top: 19px;
`;

interface EthBoxProps {
    boxType: ETHBoxType;
    isZero?: boolean;
}

const EthBox = styled.div<EthBoxProps>`
    align-items: center;
    border-radius: 4px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 105px;
    padding: 10px;
    position: relative;
    border: 1px solid ${themeColors.lightGray}

    &:hover {
        border: 1px solid ${props => (props.boxType === ETHBoxType.Eth ? themeColors.darkGray : themeColors.darkBlue)}
    }
`;

const TooltipStyled = styled.div`
    cursor: pointer;
    position: absolute;
    right: 8px;
    top: 8px;
`;

const EthBoxValue = styled.h2<EthBoxProps>`
    font-feature-settings: 'tnum' 1;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 5px;
    text-align: center;
    color: ${props => (props.boxType === ETHBoxType.Eth ? themeColors.darkGray : themeColors.darkBlue)};
`;

const EthBoxUnit = styled.div`
    color: ${themeColors.textLight};
    font-size: 15px;
    font-weight: 400;
    line-height: 1.2;
    text-align: center;
`;

const SetMinEthWrapper = styled.div`
    color: #666;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0 0 22px;
    text-align: center;
`;

const SetMinEthButton = styled.a`
    border-bottom: 1px dotted black;
    color: #666;
    text-decoration: none;
`;

const InputEth = styled<any>(BigNumberInput)`
    border-color: transparent;
    color: ${props => (props.boxType === ETHBoxType.Eth ? themeColors.darkGray : themeColors.darkBlue)}
    font-feature-settings: 'tnum' 1;
    font-size: 24px;
    font-weight: 600;
    height: 28px;
    line-height: 1.2;
    margin: 0 0 5px;
    padding: 0;
    text-align: center;


    &:focus,
    &:active {
        border-bottom: dotted 1px ${themeColors.darkBlue};
        outline: none;
    }
`;

const minEth = unitsInTokenAmount('0.5', 18);
const minSlidervalue = '0.00';

class WethModal extends React.Component<Props, State> {
    public state = {
        selectedWeth: this.props.wethBalance,
        editing: Editing.None,
    };

    public render = () => {
        const { onSubmit, isSubmitting, totalEth, wethBalance, ethInUsd, ...restProps } = this.props;
        const { editing, selectedWeth } = this.state;

        const selectedEth = totalEth.sub(this.state.selectedWeth);

        const initialWethStr = tokenAmountInUnits(this.props.wethBalance, 18);
        const selectedWethStr = tokenAmountInUnits(this.state.selectedWeth, 18);
        const selectedEthStr = tokenAmountInUnits(selectedEth, 18);
        const totalEthStr = tokenAmountInUnits(totalEth, 18);

        const isInsufficientEth = selectedEth.lessThan(minEth);

        const isDisabled = selectedWethStr === initialWethStr || isSubmitting || isInsufficientEth;

        return (
            <Modal {...restProps}>
                <CloseModalButton onClick={this._closeModal} />
                <Title>Available Balance</Title>
                {ethInUsd ? <ETHPrice>1 ETH ≈ ${ethInUsd.toString()} </ETHPrice> : null}
                <EthBoxes>
                    <EthBox boxType={ETHBoxType.Eth}>
                        {editing === Editing.Eth ? (
                            <form noValidate={true} onSubmit={this._disableEdit}>
                                <InputEth
                                    autofocus={true}
                                    decimals={18}
                                    max={totalEth}
                                    min={new BigNumber(0)}
                                    onChange={this._updateEth}
                                    value={selectedEth}
                                    boxType={ETHBoxType.Eth}
                                />
                            </form>
                        ) : (
                            <EthBoxValue
                                boxType={ETHBoxType.Eth}
                                isZero={selectedEthStr === minSlidervalue}
                                onClick={this._enableEditEth}
                            >
                                {selectedEthStr}
                            </EthBoxValue>
                        )}
                        <EthBoxUnit>ETH</EthBoxUnit>
                    </EthBox>
                    <EthBox boxType={ETHBoxType.Weth}>
                        {editing === Editing.Weth ? (
                            <form noValidate={true} onSubmit={this._disableEdit}>
                                <InputEth
                                    autofocus={true}
                                    decimals={18}
                                    max={totalEth}
                                    min={new BigNumber(0)}
                                    onChange={this._updateWeth}
                                    value={selectedWeth}
                                    boxType={ETHBoxType.Weth}
                                />
                            </form>
                        ) : (
                            <EthBoxValue
                                boxType={ETHBoxType.Weth}
                                isZero={selectedWethStr === minSlidervalue}
                                onClick={this._enableEditWeth}
                            >
                                {selectedWethStr}
                            </EthBoxValue>
                        )}
                        <EthBoxUnit>wETH</EthBoxUnit>
                        <TooltipStyled>
                            <Tooltip description="ETH cannot be traded with other tokens directly.<br />You need to convert it to WETH first.<br />WETH can be converted back to ETH at any time." />
                        </TooltipStyled>
                    </EthBox>
                </EthBoxes>
                <Slider
                    max={totalEthStr}
                    min="0"
                    onChange={this._updateSelectedWeth}
                    step="0.01"
                    type="range"
                    value={selectedWethStr}
                />
                {isInsufficientEth ? (
                    <SetMinEthWrapper>
                        ETH required for fees.&nbsp;
                        <SetMinEthButton href="" onClick={this._setMinEth}>
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

    private readonly _updateEth = (newEth: BigNumber) => {
        const { totalEth } = this.props;

        this.setState({
            selectedWeth: totalEth.sub(newEth),
        });
    };

    private readonly _updateWeth = (newWeth: BigNumber) => {
        this.setState({
            selectedWeth: newWeth,
        });
    };

    private readonly _updateSelectedWeth: React.ReactEventHandler<HTMLInputElement> = e => {
        const newSelectedWeth = unitsInTokenAmount(e.currentTarget.value, 18);

        this.setState({
            selectedWeth: newSelectedWeth,
        });
    };

    private readonly _closeModal = (e: any) => {
        if (this.props.onRequestClose) {
            this.props.onRequestClose(e);
        }
    };

    private readonly _setMinEth: React.ReactEventHandler<HTMLAnchorElement> = e => {
        e.preventDefault();

        this.setState({
            selectedWeth: this.props.totalEth.sub(minEth),
        });
    };

    private readonly _enableEditEth = () => {
        this.setState({
            editing: Editing.Eth,
        });
    };

    private readonly _enableEditWeth = () => {
        this.setState({
            editing: Editing.Weth,
        });
    };

    private readonly _disableEdit = () => {
        this.setState({
            editing: Editing.None,
        });
    };
}

export { WethModal };
