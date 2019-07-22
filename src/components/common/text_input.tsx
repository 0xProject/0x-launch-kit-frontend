import React from 'react';
import styled from 'styled-components';

interface Props {
    autofocus?: boolean;
    className?: string;
    placeholder?: string;
    onChange: (newValue: string) => void;
    value: string | null;
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

export class TextInput extends React.Component<Props, State> {
    public static defaultProps = {
        placeholder: 'Insert send address',
    };

    public readonly state = {
        currentValueStr: this.props.value ? this.props.value : '',
    };

    private _textInput: any;

    public static getDerivedStateFromProps = (props: Props, state: State) => {
        const { value } = props;
        const { currentValueStr } = state;

        if (!value) {
            return {
                currentValueStr: '',
            };
        } else if (value && currentValueStr) {
            return {
                currentValueStr: value,
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
        const { className, placeholder } = this.props;
        return (
            <Input
                className={className}
                onChange={this._updateValue}
                ref={_ref => (this._textInput = _ref)}
                type={'text'}
                value={currentValueStr}
                placeholder={placeholder}
            />
        );
    };

    private readonly _updateValue: React.ReactEventHandler<HTMLInputElement> = e => {
        const { onChange } = this.props;
        const newValueStr = e.currentTarget.value;

        const newValue = newValueStr;
        /* const invalidValue = (min && newValue.isLessThan(min)) || (max && newValue.isGreaterThan(max));
        if (invalidValue) {
            return;
        }*/

        onChange(newValue);

        this.setState({
            currentValueStr: newValueStr,
        });
    };
}
