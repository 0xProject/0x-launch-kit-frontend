import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    disabled: boolean;
}

const StyledButton = styled.button`
    background-color: #002979;
    color: white;
    border: 0;
    border-radius: 4px;
    padding: 0.5em;

    &:focus {
        outline: none;
    }

    &:disabled {
        background-color: #b2bfd7;
    }
`;

export const Button: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return (
        <StyledButton {...restProps}>
            {children}
        </StyledButton>
    );
};
