import { BigNumber } from '0x.js';
import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import { ETH_DECIMALS, UI_DECIMALS_DISPLAYED_ON_STEP_MODALS } from '../../common/constants';
import { tokenAmountInUnits, unitsInTokenAmount } from '../../util/tokens';
import { ButtonVariant } from '../../util/types';
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

const sliderThumbDimensions = '16px';
const sliderTrackProps = `
    background: #999;
    border-radius: 2.5px;
    border: none;
    box-sizing: border-box;
    height: 5px;
`;
const sliderThumbProps = `
    border-radius: 50%;
    border-width: 0.5px;
    border-style: solid;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    height: ${sliderThumbDimensions};
    width: ${sliderThumbDimensions};
`;
const Slider = styled.input`
    --range: calc(var(--max) - var(--min));
    --ratio: calc((var(--val) - var(--min)) / var(--range));
    --sx: calc(0.5 * ${sliderThumbDimensions} + var(--ratio) * (100% - ${sliderThumbDimensions}));

    -webkit-appearance: none;
    background-color: transparent;
    cursor: pointer;
    margin: 0 0 15px;
    outline: none;
    width: 100%;

    &:focus {
        outline: none;
    }
    &::-webkit-slider-runnable-track {
        ${sliderTrackProps}
        background: linear-gradient(${props => props.theme.componentsTheme.ethBoxActiveColor}, ${props =>
    props.theme.componentsTheme.ethBoxActiveColor}) 0 / var(--sx) 100% no-repeat #999;
    }
    &::-moz-range-track {
        ${sliderTrackProps}
        background: linear-gradient(${props => props.theme.componentsTheme.ethBoxActiveColor}, ${props =>
    props.theme.componentsTheme.ethBoxActiveColor}) 0 / var(--sx) 100% no-repeat #999;
    }
    &::-ms-track {
        ${sliderTrackProps}
        background: linear-gradient(${props => props.theme.componentsTheme.ethBoxActiveColor}, ${props =>
    props.theme.componentsTheme.ethBoxActiveColor}) 0 / var(--sx) 100% no-repeat #999;
    }
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        ${sliderThumbProps}
        background-color: ${props => props.theme.componentsTheme.ethSliderThumbColor};
        border-color: ${props => props.theme.componentsTheme.ethSliderThumbBorderColor};
        margin-top: -6px;
    }
    &::-moz-range-thumb {
        ${sliderThumbProps}
        background-color: ${props => props.theme.componentsTheme.ethSliderThumbColor};
        border-color: ${props => props.theme.componentsTheme.ethSliderThumbBorderColor};
    }
    &::-ms-thumb {
        ${sliderThumbProps}
        background-color: ${props => props.theme.componentsTheme.ethSliderThumbColor};
        border-color: ${props => props.theme.componentsTheme.ethSliderThumbBorderColor};
        margin-top: 0;
    }
    &::-ms-tooltip {
        display: none;
    }
    &::-moz-focus-outer {
        border: 0;
    }
`;

const Button = styled(ButtonBase)`
    width: 100%;
`;

const Title = styled.h1<{ marginBottomSmall: any }>`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: ${props => (props.marginBottomSmall ? '0 0 5px' : '0')};
    text-align: center;
`;

const ETHPrice = styled.h2`
    color: ${props => props.theme.componentsTheme.textLight};
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    line-height: 1.2;
    margin: 0;
    text-align: center;
`;

const EthBoxes = styled.div`
    column-gap: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 15px;
    padding-top: 30px;
`;

interface EthBoxProps {
    boxType: ETHBoxType;
    isZero?: boolean;
}

const EthBox = styled.div<EthBoxProps>`
    align-items: center;
    border-radius: 4px;
    border: 1px solid ${props => props.theme.componentsTheme.ethBoxBorderColor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 146px;
    min-height: 105px;
    padding: 10px 5px;
    position: relative;
    transition: border-color 0.15s ease-in;

    &:focus-within {
        border-color: ${props =>
            props.boxType === ETHBoxType.Weth
                ? props.theme.componentsTheme.ethBoxActiveColor
                : props.theme.componentsTheme.textDark};

        h4 {
            color: ${props =>
                props.boxType === ETHBoxType.Weth
                    ? props.theme.componentsTheme.ethBoxActiveColor
                    : props.theme.componentsTheme.textLight};
        }
    }
`;

const TooltipStyled = styled.div`
    cursor: pointer;
    position: absolute;
    right: 8px;
    top: 8px;
`;

const EthBoxValue = styled.h2<EthBoxProps>`
    color: ${props =>
        props.boxType === ETHBoxType.Eth
            ? props.theme.componentsTheme.textLight
            : props.theme.componentsTheme.ethBoxActiveColor};
    font-feature-settings: 'tnum' 1;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 5px;
    padding: 0;
    text-align: center;
    width: 100%;
`;

const EthBoxUnit = styled.h4`
    color: ${props => props.theme.componentsTheme.textLight};
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
    margin: 0;
    text-align: center;
`;

const SetMinEthWrapper = styled.p<{ hideWarning: boolean }>`
    color: ${props => props.theme.componentsTheme.textLight};
    font-size: 13px;
    font-style: italic;
    font-weight: 500;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
    visibility: ${props => (props.hideWarning ? 'hidden' : 'visible')};
`;

const SetMinEthButton = styled.a`
    border-bottom: 1px dotted ${props => props.theme.componentsTheme.ethSetMinEthButtonBorderColor};
    color: ${props => props.theme.componentsTheme.textLight};
    text-decoration: none;
`;

const FormBox = styled.form`
    width: 100%;
`;

const InputEth = styled<any>(BigNumberInput)`
    background-color: transparent;
    border: none;
    color: ${props =>
        props.boxType === ETHBoxType.Eth
            ? props.theme.componentsTheme.textDark
            : props.theme.componentsTheme.ethBoxActiveColor};
    font-feature-settings: 'tnum' 1;
    font-size: 24px;
    font-weight: 600;
    height: 28px;
    line-height: 1.2;
    margin: 0 0 5px;
    padding: 0;
    text-align: center;
    width: 100%;

    &:focus,
    &:active {
        outline: none;
    }
`;

const minEth = unitsInTokenAmount('0.05', ETH_DECIMALS);
const minSlidervalue = '0.00';
const PLACEHOLDER = '0.000';

class WethModal extends React.Component<Props, State> {
    public state = {
        selectedWeth: this.props.wethBalance,
        editing: Editing.None,
    };

    public render = () => {
        const { isSubmitting, totalEth, wethBalance, ethInUsd, ...restProps } = this.props;
        const { editing, selectedWeth } = this.state;

        const selectedEth = totalEth.minus(selectedWeth);
        const selectedWethStr = tokenAmountInUnits(selectedWeth, ETH_DECIMALS, UI_DECIMALS_DISPLAYED_ON_STEP_MODALS);
        const selectedEthStr = tokenAmountInUnits(selectedEth, ETH_DECIMALS, UI_DECIMALS_DISPLAYED_ON_STEP_MODALS);
        const totalEthStr = tokenAmountInUnits(totalEth, ETH_DECIMALS);
        const isInsufficientEth = selectedEth.isLessThan(minEth);
        const isDisabled = wethBalance.isEqualTo(selectedWeth) || isSubmitting || isInsufficientEth;

        return (
            <Modal {...restProps}>
                <CloseModalButton onClick={this._closeModal} />
                <Title marginBottomSmall={ethInUsd}>Available Balance</Title>
                {ethInUsd ? <ETHPrice>1 ETH ≈ ${ethInUsd.toFixed(2)} </ETHPrice> : null}
                <EthBoxes>
                    <EthBox boxType={ETHBoxType.Eth}>
                        {editing === Editing.Eth ? (
                            <FormBox noValidate={true} onSubmit={this._disableEdit}>
                                <InputEth
                                    autofocus={true}
                                    boxType={ETHBoxType.Eth}
                                    decimals={18}
                                    max={totalEth}
                                    min={new BigNumber(0)}
                                    onChange={this._updateEth}
                                    value={selectedEth}
                                    placeholder={PLACEHOLDER}
                                    valueFixedDecimals={UI_DECIMALS_DISPLAYED_ON_STEP_MODALS}
                                />
                            </FormBox>
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
                            <FormBox noValidate={true} onSubmit={this._disableEdit}>
                                <InputEth
                                    autofocus={true}
                                    decimals={ETH_DECIMALS}
                                    max={totalEth}
                                    min={new BigNumber(0)}
                                    onChange={this._updateWeth}
                                    value={selectedWeth}
                                    boxType={ETHBoxType.Weth}
                                    placeholder={PLACEHOLDER}
                                    valueFixedDecimals={UI_DECIMALS_DISPLAYED_ON_STEP_MODALS}
                                />
                            </FormBox>
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
                    style={{
                        '--min': '0',
                        '--max': totalEthStr,
                        '--val': selectedWethStr,
                        '--color': 'red',
                        color: 'var(--color)',
                    }}
                    type="range"
                    value={selectedWethStr}
                />
                <SetMinEthWrapper hideWarning={isInsufficientEth ? false : true}>
                    ETH required for fees.&nbsp;
                    <SetMinEthButton href="" onClick={this._setMinEth}>
                        0.05 ETH Recommended
                    </SetMinEthButton>
                </SetMinEthWrapper>
                <Button onClick={this.submit} disabled={isDisabled} variant={ButtonVariant.Balance}>
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
            selectedWeth: totalEth.minus(newEth),
        });
    };

    private readonly _updateWeth = (newWeth: BigNumber) => {
        this.setState({
            selectedWeth: newWeth,
        });
    };

    private readonly _updateSelectedWeth: React.ReactEventHandler<HTMLInputElement> = e => {
        const newSelectedWeth = unitsInTokenAmount(e.currentTarget.value, ETH_DECIMALS);

        this.setState({
            selectedWeth: newSelectedWeth,
        });
    };

    private readonly _closeModal = (e: any) => {
        if (this.props.onRequestClose) {
            this.props.onRequestClose(e);
        }
        this.setState({
            selectedWeth: this.props.wethBalance,
        });
    };

    private readonly _setMinEth: React.ReactEventHandler<HTMLAnchorElement> = e => {
        e.preventDefault();

        this.setState({
            selectedWeth: this.props.totalEth.minus(minEth),
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
