import React from 'react';
import ReactSVG from 'react-svg';
import styled, { withTheme } from 'styled-components';

import { Theme } from '../../../themes/commons';

interface Props {
    type: 'gold' | 'silver' | 'platinum';
    primaryColor?: string;
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

const VeriSafeStickerContainer = (props: Props) => {
    const { type, primaryColor, theme, icon, ...restProps } = props;
    let Icon;
    switch (type) {
        case 'gold':
            Icon = <ReactSVG src={'assets/verisafe_gold.svg'} />;
            break;
        case 'silver':
            Icon = <ReactSVG src={'assets/verisafe_silver.svg'} />;
            break;
        case 'platinum':
            Icon = <ReactSVG src={'assets/verisafe_platinum.svg'} />;
            break;
        default:
            break;
    }
    return (
        <IconContainer color={primaryColor || theme.componentsTheme.gray} {...restProps}>
            {Icon}
        </IconContainer>
    );
};

const VeriSafeStickerIcon = withTheme(VeriSafeStickerContainer);

export { VeriSafeStickerIcon };
