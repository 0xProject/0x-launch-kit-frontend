import { BigNumber } from '0x.js';
import React from 'react';

import { tokenAmountInUnits, unitsInTokenAmount } from '../../util/tokens';

interface Props {
    value: BigNumber;
    decimals: number;
    onChange: (newValue: BigNumber) => void;
    min?: BigNumber;
    max?: BigNumber;
    step?: BigNumber;
}

interface State {
    currentValueStr: string;
}

export class BigNumberInput extends React.Component<Props, State> {
    public readonly state = {
        currentValueStr: tokenAmountInUnits(this.props.value, this.props.decimals),
    };

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

    public render = () => {
        const { currentValueStr } = this.state;
        const { decimals, step, min, max } = this.props;

        const stepStr = step && tokenAmountInUnits(step, decimals);
        const minStr = min && tokenAmountInUnits(min, decimals);
        const maxStr = max && tokenAmountInUnits(max, decimals);

        return (
            <input
                type="number"
                value={currentValueStr}
                onChange={this._updateValue}
                step={stepStr}
                min={minStr}
                max={maxStr}
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
