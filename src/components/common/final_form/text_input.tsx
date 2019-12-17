import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import styled from 'styled-components';

import { themeDimensions } from '../../../themes/commons';

type Props = FieldRenderProps<string, any>;

const TextInputStyled = styled.input`
    background-color: ${props => props.theme.componentsTheme.textInputBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.textInputBorderColor};
    color: ${props => props.theme.componentsTheme.textInputTextColor};
    font-feature-settings: 'tnum' 1;
    font-size: 16px;
    height: 100%;
    padding-left: 14px;
    padding-right: 60px;
    position: absolute;
    width: 50%;
    z-index: 1;
`;

export const TextInput: React.FC<Props> = ({ input, meta, ...rest }: Props) => (
    <TextInputStyled type="text" {...input} {...rest} />
);
