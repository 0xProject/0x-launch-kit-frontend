import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import React from 'react';
import styled from 'styled-components';

import { DECIMALS_TWO } from '../../common/constants';

interface Props {
    autofocus?: boolean;
    className?: string;
    // If decimals is not specified, then toBaseUnitAmount` will not be applied.
    decimals?: number;
    placeholder?: string;
    max?: BigNumber;
    min?: BigNumber;
    onChange: (newValue: BigNumber) => void;
    step?: BigNumber;
    value: BigNumber | null;
}

interface State {
    currentValueStr: string;
}

const { toUnitAmount, toBaseUnitAmount } = Web3Wrapper;

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
        currentValueStr:
            this.props.value && this.props.decimals
                ? toUnitAmount(this.props.value, this.props.decimals).toFixed(DECIMALS_TWO)
                : new BigNumber(this.props.value || '0').toString(),
    };

    private _textInput: any;

    public static getDerivedStateFromProps = (props: Props, state: State) => {
        const { value } = props;
        const { currentValueStr } = state;

        const newValue = BigNumberInput.getPriceValue(props, currentValueStr);

        if (!value) {
            return {
                currentValueStr: '',
            };
        } else if (value && !newValue.eq(value)) {
            return {
                currentValueStr: newValue,
            };
        } else {
            return null;
        }
    };

    public static getPriceValue = (props: Props, currentValue: string): BigNumber => {
        const { decimals } = props;

        const currentValueToBigNumber = new BigNumber(currentValue || '0');

        if (decimals && decimals > 0) {
            return toBaseUnitAmount(currentValueToBigNumber, decimals);
        }
        return currentValueToBigNumber;
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

        const stepStr = step && decimals && toUnitAmount(step, decimals).toFixed(DECIMALS_TWO);
        const minStr = min && decimals && toUnitAmount(min, decimals).toFixed(DECIMALS_TWO);
        const maxStr = max && decimals && toUnitAmount(max, decimals).toFixed(DECIMALS_TWO);

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
        const { onChange, min, max } = this.props;
        const newValueStr = e.currentTarget.value;

        const newValue = BigNumberInput.getPriceValue(this.props, newValueStr);

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
