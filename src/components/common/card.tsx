import React from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../themes/ThemeCommons';
import { StyledComponentThemeProps } from '../../util/types';

import { CardBase } from './card_base';

interface Props extends StyledComponentThemeProps {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

const CardWrapper = styled(CardBase)`
    margin-bottom: 10px;
`;

const CardHeader = styled.div<StyledComponentThemeProps>`
    align-items: center;
    border-bottom: 1px solid ${props => props.themeColors.borderColor};
    display: flex;
    justify-content: space-between;
    padding: 15px ${themeDimensions.horizontalPadding};
`;

const CardTitle = styled.h1`
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
    padding: 0 20px 0 0;
`;

const CardBody = styled.div`
    margin: 0;
    min-height: 140px;
    overflow-x: auto;
    padding: ${themeDimensions.verticalPadding} ${themeDimensions.horizontalPadding};
    position: relative;
`;

export const Card: React.FC<Props> = props => {
    const { title, action, children, themeColors, ...restProps } = props;

    return (
        <CardWrapper themeColors={themeColors} {...restProps}>
            {title || action ? (
                <CardHeader themeColors={themeColors}>
                    <CardTitle>{title}</CardTitle>
                    {action ? action : null}
                </CardHeader>
            ) : null}
            <CardBody>{children}</CardBody>
        </CardWrapper>
    );
};
