import React from 'react';
import styled, { css } from 'styled-components';

import { themeBreakPoints, themeDimensions } from '../../../themes/commons';

const noFocusOutline = css`
    :focus {
        outline: none;
    }
`;

const SearchInput = styled.input<Props>`
    background-color: #f9fafc;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNCAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjQiIHN0cm9rZT0iI0RFREVERSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMi41IDExLjVMOCA3IiBzdHJva2U9IiNERURFREUiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K');
    background-position: 12px 50%;
    background-repeat: no-repeat;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
    box-sizing: border-box;
    color: #666;
    font-size: 14px;
    height: 32px;
    margin: 0 auto 0 10px;
    padding-left: 35px;
    width: 140px;

    @media (min-width: ${themeBreakPoints.md}) {
        margin-left: 20px;
        width: 250px;
    }

    @media (min-width: ${themeBreakPoints.xxl}) {
        margin: 0;
        width: 466px;
    }

    ::placeholder {
        color: #bfbfbf;
        font-size: 14px;
        text-align: center;
    }

    ${props => (props.focusOutline ? '' : noFocusOutline)}
`;

SearchInput.defaultProps = {
    focusOutline: true,
};

interface Props {
    placeholder: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any;
    onClick?: (event: React.MouseEvent<HTMLInputElement>) => any;
    autoFocus?: boolean;
    readOnly?: boolean;
    focusOutline?: boolean;
}

export const InputSearch = (props: Props) => {
    return <SearchInput {...props} />;
};
