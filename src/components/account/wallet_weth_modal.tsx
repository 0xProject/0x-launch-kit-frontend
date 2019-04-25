import { BigNumber } from '0x.js';
import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import { tokenAmountInUnits, unitsInTokenAmount } from '../../util/tokens';
import { StyledComponentThemeProps } from '../../util/types';
import { BigNumberInput } from '../common/big_number_input';
import { Button } from '../common/button';
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

interface StateProps extends StyledComponentThemeProps {}

interface OwnProps extends React.ComponentProps<typeof Modal> {
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

type Props = OwnProps & StateProps;

const sliderThumbDimensions = '16px';
const sliderTrackProps = styled.div<StyledComponentThemeProps>`
    background: #999;
    background: linear-gradient(${props => props.themeColors.darkBlue};, ${props => props.themeColors.darkBlue};) 0 /
        var(--sx) 100% no-repeat #999;
    border-radius: 2.5px;
    border: none;
    box-sizing: border-box;
    height: 5px;
`;
const sliderThumbProps = `
    background: #fff;
    border-radius: 50%;
    border: 0.5px solid rgba(0, 0, 0, 0.142);
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
    }
    &::-moz-range-track {
        ${sliderTrackProps}
    }
    &::-ms-track {
        ${sliderTrackProps}
    }
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        ${sliderThumbProps}
        margin-top: -6px;
    }
    &::-moz-range-thumb {
        ${sliderThumbProps}
    }
    &::-ms-thumb {
        ${sliderThumbProps}
        margin-top: 0;
    }
    &::-ms-tooltip {
        display: none;
    }
    &::-moz-focus-outer {
        border: 0;
    }
`;

const ButtonStyled = styled(Button)`
    width: 100%;
`;

const Title = styled.h1<{ marginBottomSmall: any }>`
    color: #000;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: ${props => (props.marginBottomSmall ? '0 0 5px' : '0')};
    text-align: center;
`;

const ETHPrice = styled.h2<StyledComponentThemeProps>`
    color: ${props => props.themeColors.textLight};
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

interface EthBoxProps extends StyledComponentThemeProps {
    boxType: ETHBoxType;
    isZero?: boolean;
}

const EthBox = styled.div<EthBoxProps>`
    align-items: center;
    border-radius: 4px;
    border: 1px solid ${props => props.themeColors.borderColor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 146px;
    min-height: 105px;
    padding: 10px;
    position: relative;
    transition: border-color 0.15s ease-in;

    &:focus-within {
        border-color: ${props =>
            props.boxType === ETHBoxType.Weth ? props.themeColors.darkBlue : props.themeColors.darkerGray};

        h4 {
            color: ${props =>
                props.boxType === ETHBoxType.Weth ? props.themeColors.darkBlue : props.themeColors.textLight};
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
    color: ${props => (props.boxType === ETHBoxType.Eth ? props.themeColors.darkerGray : props.themeColors.darkBlue)};
    font-feature-settings: 'tnum' 1;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 5px;
    text-align: center;
`;

const EthBoxUnit = styled.h4<StyledComponentThemeProps>`
    color: ${props => props.themeColors.textLight};
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
    margin: 0;
    text-align: center;
`;

interface MinEthWrapperProps extends StyledComponentThemeProps {
    hideWarning: boolean;
}

const SetMinEthWrapper = styled.p<MinEthWrapperProps>`
    color: ${props => props.themeColors.darkerGray};
    font-size: 13px;
    font-style: italic;
    font-weight: 500;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
    visibility: ${props => (props.hideWarning ? 'hidden' : 'visible')};
`;

const SetMinEthButton = styled.a<StyledComponentThemeProps>`
    border-bottom: 1px dotted #000;
    color: ${props => props.themeColors.darkerGray};
    text-decoration: none;
`;

const InputEth = styled<any>(BigNumberInput)<EthBoxProps>`
    border-color: transparent;
    color: ${props =>
        props.ethBoxProps.boxType === ETHBoxType.Eth ? props.themeColors.darkerGray : props.themeColors.darkBlue};
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
        const { onSubmit, isSubmitting, totalEth, wethBalance, ethInUsd, themeColors, ...restProps } = this.props;
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
                <Title marginBottomSmall={ethInUsd}>Available Balance</Title>
                {ethInUsd ? <ETHPrice themeColors={themeColors}>1 ETH ≈ ${ethInUsd.toString()} </ETHPrice> : null}
                <EthBoxes>
                    <EthBox boxType={ETHBoxType.Eth} themeColors={themeColors}>
                        {editing === Editing.Eth ? (
                            <form noValidate={true} onSubmit={this._disableEdit}>
                                <InputEth
                                    autofocus={true}
                                    boxType={ETHBoxType.Eth}
                                    decimals={18}
                                    max={totalEth}
                                    min={new BigNumber(0)}
                                    onChange={this._updateEth}
                                    value={selectedEth}
                                />
                            </form>
                        ) : (
                            <EthBoxValue
                                boxType={ETHBoxType.Eth}
                                isZero={selectedEthStr === minSlidervalue}
                                onClick={this._enableEditEth}
                                themeColors={themeColors}
                            >
                                {selectedEthStr}
                            </EthBoxValue>
                        )}
                        <EthBoxUnit themeColors={themeColors}>ETH</EthBoxUnit>
                    </EthBox>
                    <EthBox boxType={ETHBoxType.Weth} themeColors={themeColors}>
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
                                themeColors={themeColors}
                            >
                                {selectedWethStr}
                            </EthBoxValue>
                        )}
                        <EthBoxUnit themeColors={themeColors}>wETH</EthBoxUnit>
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
                <SetMinEthWrapper hideWarning={!isInsufficientEth} themeColors={themeColors}>
                    ETH required for fees.&nbsp;
                    <SetMinEthButton href="" onClick={this._setMinEth} themeColors={themeColors}>
                        0.5 ETH Recommended
                    </SetMinEthButton>
                </SetMinEthWrapper>
                // @ts-ignore
                <ButtonStyled onClick={this.submit} disabled={isDisabled}>
                    Update Balance{isSubmitting && '...'}
                </ButtonStyled>
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
