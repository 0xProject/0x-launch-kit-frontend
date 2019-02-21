import { BigNumber } from '0x.js';
import React from 'react';
import styled from 'styled-components';

import { themeColors } from '../../util/theme';
import { tokenAmountInUnits, unitsInTokenAmount } from '../../util/tokens';

interface Props {
    decimals: number;
    max?: BigNumber;
    min?: BigNumber;
    onChange: (newValue: BigNumber) => void;
    ref?: any;
    step?: BigNumber;
    value: BigNumber;
}

interface State {
    currentValueStr: string;
}

const InputEth = styled.input`
    border-color: transparent;
    color: ${themeColors.darkBlue};
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

export class BigNumberInput extends React.Component<Props, State> {
    public readonly state = {
        currentValueStr: tokenAmountInUnits(this.props.value, this.props.decimals),
    };

    private _textInput: any;

    public static getDerivedStateFromProps = (props: Props, state: State) => {
        const { decimals, value } = props;
        const { currentValueStr } = state;

        if (!unitsInTokenAmount(currentValueStr || '0', decimals).eq(value)) {
            return {
                currentValueStr: tokenAmountInUnits(value, decimals),
            };
        } else {
            return null;
        }
    };

    public componentDidMount = () => {
        this._textInput.focus();
    };

    public render = () => {
        const { currentValueStr } = this.state;
        const { decimals, step, min, max, ref } = this.props;

        const stepStr = step && tokenAmountInUnits(step, decimals);
        const minStr = min && tokenAmountInUnits(min, decimals);
        const maxStr = max && tokenAmountInUnits(max, decimals);

        return (
            <InputEth
                max={maxStr}
                min={minStr}
                onChange={this._updateValue}
                ref={_ref => (this._textInput = _ref)}
                step={stepStr}
                type={'number'}
                value={currentValueStr}
            />
        );
    };

    private readonly _updateValue: React.ReactEventHandler<HTMLInputElement> = e => {
        const { decimals, onChange, min, max } = this.props;
        const newValueStr = e.currentTarget.value;

        const newValue = unitsInTokenAmount(newValueStr || '0', decimals);
        const invalidValue = (min && newValue.lessThan(min)) || (max && newValue.greaterThan(max));
        if (invalidValue) {
            return;
        }

        onChange(newValue);

        this.setState({
            currentValueStr: newValueStr,
        });
    };
}
