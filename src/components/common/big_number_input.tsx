import { BigNumber } from '0x.js';
import React from 'react';
import styled from 'styled-components';

import { tokenAmountInUnits, unitsInTokenAmount } from '../../util/tokens';

interface Props {
    autofocus?: boolean;
    className?: string;
    decimals: number;
    placeholder?: string;
    max?: BigNumber;
    min?: BigNumber;
    onChange: (newValue: BigNumber) => void;
    step?: BigNumber;
    value: BigNumber | null;
    valueFixedDecimals?: number;
}

interface State {
    currentValueStr: string;
}

const Input = styled.input`
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;
`;

export class BigNumberInput extends React.Component<Props, State> {
    public static defaultProps = {
        placeholder: '0.00',
    };

    public readonly state = {
        currentValueStr: this.props.value
            ? tokenAmountInUnits(this.props.value, this.props.decimals, this.props.valueFixedDecimals)
            : '',
    };

    private _textInput: any;

    public static getDerivedStateFromProps = (props: Props, state: State) => {
        const { decimals, value, valueFixedDecimals } = props;
        const { currentValueStr } = state;

        if (!value) {
            return {
                currentValueStr: '',
            };
        } else if (value && !unitsInTokenAmount(currentValueStr || '0', decimals).eq(value)) {
            return {
                currentValueStr: tokenAmountInUnits(value, decimals, valueFixedDecimals),
            };
        } else {
            return null;
        }
    };

    public componentDidMount = () => {
        const { autofocus } = this.props;

        if (autofocus) {
            this._textInput.focus();
        }
    };

    public render = () => {
        const { currentValueStr } = this.state;
        const { decimals, step, min, max, className, placeholder } = this.props;
        const stepStr = step && tokenAmountInUnits(step, decimals);
        const minStr = min && tokenAmountInUnits(min, decimals);
        const maxStr = max && tokenAmountInUnits(max, decimals);

        return (
            <Input
                className={className}
                max={maxStr}
                min={minStr}
                onChange={this._updateValue}
                ref={_ref => (this._textInput = _ref)}
                step={stepStr}
                type={'number'}
                value={currentValueStr}
                placeholder={placeholder}
            />
        );
    };

    private readonly _updateValue: React.ReactEventHandler<HTMLInputElement> = e => {
        const { decimals, onChange, min, max } = this.props;
        const newValueStr = e.currentTarget.value;

        const newValue = unitsInTokenAmount(newValueStr || '0', decimals);
        const invalidValue = (min && newValue.isLessThan(min)) || (max && newValue.isGreaterThan(max));
        if (invalidValue) {
            return;
        }

        onChange(newValue);

        this.setState({
            currentValueStr: newValueStr,
        });
    };
}
