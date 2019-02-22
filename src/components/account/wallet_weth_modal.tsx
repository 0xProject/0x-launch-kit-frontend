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

enum Editing {
    Eth,
    Weth,
    None,
}

interface Props extends React.ComponentProps<typeof Modal> {
    wethBalance: BigNumber;
    totalEth: BigNumber;
    isSubmitting: boolean;
    onSubmit: (b: BigNumber) => any;
}

interface State {
    selectedWeth: BigNumber;
    editing: Editing;
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

const CloseButtonContainer = styled.div`
    align-items: center;
    display: flex;
    height: 20px;
    justify-content: flex-end;
    margin-right: -10px;
    margin-top: -10px;
`;

const Title = styled.h1`
    color: #000;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

const EthBoxes = styled.div`
    column-gap: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 25px;
`;

const EthBox = styled.div`
    align-items: center;
    border-radius: 4px;
    border: 1px solid ${themeColors.borderColor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 105px;
    padding: 10px;
    position: relative;
`;

const TooltipStyled = styled.div`
    cursor: pointer;
    position: absolute;
    right: 8px;
    top: 8px;
`;

interface EthBoxProps {
    isZero?: boolean;
}

const EthBoxValue = styled.h2<EthBoxProps>`
    color: ${props => (props.isZero ? '#666' : themeColors.darkBlue)};
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 5px;
    text-align: center;
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

const minEth = unitsInTokenAmount('0.5', 18);
const minSlidervalue = '0.00';

class WethModal extends React.Component<Props, State> {
    public state = {
        selectedWeth: this.props.wethBalance,
        editing: Editing.None,
    };

    public render = () => {
        const { onSubmit, isSubmitting, totalEth, wethBalance, ...restProps } = this.props;
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
                <CloseButtonContainer>
                    <CloseModalButton onClick={this._closeModal} />
                </CloseButtonContainer>
                <Title>Available Balance</Title>
                <EthBoxes>
                    <EthBox>
                        {editing === Editing.Eth ? (
                            <form noValidate={true} onSubmit={this._disableEdit}>
                                <BigNumberInput
                                    value={selectedEth}
                                    onChange={this._updateEth}
                                    min={new BigNumber(0)}
                                    max={totalEth}
                                    decimals={18}
                                />
                            </form>
                        ) : (
                            <EthBoxValue isZero={selectedEthStr === minSlidervalue} onClick={this._enableEditEth}>
                                {selectedEthStr}
                            </EthBoxValue>
                        )}
                        <EthBoxUnit>ETH</EthBoxUnit>
                    </EthBox>
                    <EthBox>
                        {editing === Editing.Weth ? (
                            <form noValidate={true} onSubmit={this._disableEdit}>
                                <BigNumberInput
                                    value={selectedWeth}
                                    onChange={this._updateWeth}
                                    min={new BigNumber(0)}
                                    max={totalEth}
                                    decimals={18}
                                />
                            </form>
                        ) : (
                            <EthBoxValue isZero={selectedWethStr === minSlidervalue} onClick={this._enableEditWeth}>
                                {selectedWethStr}
                            </EthBoxValue>
                        )}
                        <EthBoxUnit>wETH</EthBoxUnit>
                        <TooltipStyled>
                            <Tooltip />
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
