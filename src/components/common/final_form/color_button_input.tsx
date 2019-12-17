import React, { useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import { FieldRenderProps } from 'react-final-form';
import styled from 'styled-components';

type Props = FieldRenderProps<string, any>;

const Swatch = styled.div`
    padding: 5px;
    background: #fff;
    border-radius: 1px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    display: inline-block;
    cursor: pointer;
`;

const Popover = styled.div`
    position: absolute;
    z-index: 2;
`;

const Cover = styled.div`
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
`;

const Color = styled.div<{ color?: string }>`
    width: 36px;
    height: 14px;
    border-radius: 2px;
    background: ${props => props.color};
`;

export const ColorButtonInput: React.FC<Props> = ({
    // tslint:disable-next-line: boolean-naming
    input: { value, ...input },
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const onChange = (colorResult: ColorResult) => input.onChange(colorResult.hex);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <Swatch onClick={handleClick}>
                <Color color={value || '#fff'} />
            </Swatch>
            {isOpen ? (
                <Popover>
                    <Cover onClick={handleClose} />
                    <SketchPicker color={value || '#fff'} onChange={onChange} />
                </Popover>
            ) : null}
        </div>
    );
};
