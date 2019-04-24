import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../themes/ThemeCommons';
import { StyledComponentThemeProps } from '../../util/types';

import { LockIcon } from './icons/lock_icon';
import { MetamaskSideIcon } from './icons/metamask_side_icon';
import { SadIcon } from './icons/sad_icon';

interface ErrorProps extends StyledComponentThemeProps {
    fontSize?: FontSize;
    icon?: ErrorIcons;
    textAlign?: string;
}

interface OwnProps extends HTMLAttributes<HTMLDivElement> {
    text: string;
}

type Props = OwnProps & ErrorProps;

export enum ErrorIcons {
    Lock = 1,
    Sad = 2,
    Metamask = 3,
}

export enum FontSize {
    Large = 1,
    Medium = 2,
}

const StyledErrorCardContainer = styled.div<ErrorProps>`
    align-items: center;
    background-color: ${props => props.themeColors.errorCardBackground};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.themeColors.errorCardBorder};
    color: ${props => props.themeColors.errorCardText};
    display: flex;
    font-size: ${props => (props.fontSize === FontSize.Large ? '16px' : '14px')};
    line-height: 1.2;
    padding: 10px 15px;
    ${props => (props.textAlign === 'center' ? 'justify-content: center;' : '')}
`;

const IconContainer = styled.span`
    margin-right: 10px;
`;

const getIcon = (icon: ErrorIcons) => {
    let theIcon: any;

    if (icon === ErrorIcons.Lock) {
        theIcon = <LockIcon />;
    }
    if (icon === ErrorIcons.Metamask) {
        theIcon = <MetamaskSideIcon />;
    }
    if (icon === ErrorIcons.Sad) {
        theIcon = <SadIcon />;
    }

    return <IconContainer>{theIcon}</IconContainer>;
};

export const ErrorCard = (props: Props) => {
    const { text, icon, themeColors, ...restProps } = props;
    const errorIcon = icon ? getIcon(icon) : null;

    return (
        <StyledErrorCardContainer themeColors={themeColors} {...restProps}>
            {errorIcon}
            {text}
        </StyledErrorCardContainer>
    );
};
