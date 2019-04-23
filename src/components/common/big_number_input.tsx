import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';
import React from 'react';
import styled from 'styled-components';

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
        currentValueStr: this.props.value ? toUnitAmount(this.props.value, this.props.decimals).toFixed(2) : '',
    };

    private _textInput: any;

    public static getDerivedStateFromProps = (props: Props, state: State) => {
        const { decimals, value } = props;
        const { currentValueStr } = state;

        if (!value) {
            return {
                currentValueStr: '',
            };
        } else if (value && !toBaseUnitAmount(new BigNumber(currentValueStr || '0'), decimals).eq(value)) {
            return {
                currentValueStr: toUnitAmount(value, decimals).toFixed(2),
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

        const stepStr = step && toUnitAmount(step, decimals).toFixed(2);
        const minStr = min && toUnitAmount(min, decimals).toFixed(2);
        const maxStr = max && toUnitAmount(max, decimals).toFixed(2);

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

        const pattern = new RegExp(`^\\d*(\\.\\d{0,${decimals}})?$`);

        if (pattern.test(newValueStr)) {
            const newValue = toBaseUnitAmount(new BigNumber(newValueStr || '0'), decimals);
            const invalidValue = (min && newValue.lessThan(min)) || (max && newValue.greaterThan(max));
            if (invalidValue) {
                return;
            }

            onChange(newValue);

            this.setState({
                currentValueStr: newValueStr,
            });
        }
    };
}
