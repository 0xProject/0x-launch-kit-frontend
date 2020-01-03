import React from 'react';
import ReactSVG from 'react-svg';
import styled, { withTheme } from 'styled-components';

import { Theme } from '../../../themes/commons';

interface Props {
    isInline?: boolean;
    icon?: string;
    theme: Theme;
}

const IconContainer = styled.div<{ color: string; isInline?: boolean }>`
    align-items: center;
    background-color: ${props => (props.color ? props.color : 'transparent')};
    border-radius: 50%;
    display: ${props => (props.isInline ? 'inline-flex' : 'flex')};
    height: 26px;
    justify-content: center;
    width: 26px;
`;

const LogoIconContainer = (props: Props) => {
    const { theme, icon, ...restProps } = props;
    const fallBack = null;
    const isSvg = new RegExp('.svg$');
    const isImage = new RegExp('(http(s?):).*.(?:jpg|gif|png)');
    let Icon;
    if (isSvg.test(icon as string)) {
        Icon =
            // tslint:disable-next-line:jsx-no-lambda
            icon ? <ReactSVG src={icon as string} fallback={() => fallBack} /> : fallBack;
    }
    if (isImage.test(icon as string)) {
        Icon = icon ? <img src={icon as string} alt="logo" /> : fallBack;
    }
    if (!Icon) {
        return null;
    }

    return (
        <IconContainer color={theme.componentsTheme.gray} {...restProps}>
            {Icon}
        </IconContainer>
    );
};

const LogoIcon = withTheme(LogoIconContainer);

export { LogoIcon };
