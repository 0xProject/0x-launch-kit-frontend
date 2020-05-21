import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ViewAllIcon } from './icons/view_all_icon';

interface Props {
    to: string;
    text: string;
}

const ViewAllWrapper = styled(Link)`
    align-items: center;
    color: ${props => props.theme.componentsTheme.textColorCommon};
    display: flex;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    text-decoration: none;

    svg {
        margin: 0 0 0 8px;
    }
`;

export const ViewAll: React.FC<Props> = props => {
    const { to, text, ...restProps } = props;
    return (
        <ViewAllWrapper to={to} {...restProps}>
            {text}
            <ViewAllIcon />
        </ViewAllWrapper>
    );
};
