import styled from 'styled-components';

import { themeBreakPoints, themeDimensions } from '../../themes/commons';

interface TableStyleProps {
    borderBottom?: boolean;
    borderTop?: boolean;
    color?: string;
    tabular?: boolean;
    textAlign?: string;
    fontWeight?: string;
    lineWeight?: string;
}

interface TableProps {
    fitInCard?: boolean;
    isResponsive?: boolean;
    styles?: TableStyleProps;
}

interface TableTDProps {
    styles?: TableStyleProps;
}

export const Table = styled.table<TableProps>`
    border-bottom: ${props =>
        props.styles && props.styles.borderBottom
            ? `1px solid ${props.theme.componentsTheme.tableBorderColor}`
            : 'none'};
    border-top: ${props =>
        props.styles && props.styles.borderTop ? `1px solid ${props.theme.componentsTheme.tableBorderColor}` : 'none'};
    margin-left: ${props => (props.fitInCard ? `-${themeDimensions.horizontalPadding}` : '0')};
    margin-right: ${props => (props.fitInCard ? `-${themeDimensions.horizontalPadding}` : '0')};
    min-width: ${props => (props.isResponsive ? 'fit-content' : '0')};
    width: ${props =>
        props.fitInCard
            ? `calc(100% + ${themeDimensions.horizontalPadding} + ${themeDimensions.horizontalPadding})`
            : '100%'};

    @media (min-width: ${themeBreakPoints.xl}) {
        min-width: 100%;
    }
`;

export const THead = styled.thead`
    font-size: 12px;
    text-transform: uppercase;
`;

export const TBody = styled.tbody``;

export const TR = styled.tr``;

export const TH = styled.th<TableTDProps>`
    border-bottom: ${props =>
        props.styles && props.styles.borderBottom
            ? `1px solid ${props.theme.componentsTheme.tableBorderColor}`
            : 'none'};
    border-top: ${props =>
        props.styles && props.styles.borderTop ? `1px solid ${props.theme.componentsTheme.tableBorderColor}` : 'none'};
    color: ${props => (props.styles && props.styles.color ? props.styles.color : props.theme.componentsTheme.thColor)};
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 1.2;
    padding: 0 ${themeDimensions.horizontalPadding} 5px 0;
    text-align: ${props =>
        props.styles && props.styles.textAlign && props.styles.textAlign.length ? props.styles.textAlign : 'left'};
    text-transform: uppercase;
    white-space: nowrap;

    &:last-child {
        padding-right: 0;
    }
`;

export const CustomTD = styled.td<TableTDProps>`
    border-bottom: ${props =>
        props.styles && props.styles.borderBottom
            ? `1px solid ${props.theme.componentsTheme.tableBorderColor}`
            : 'none'};
    border-top: ${props =>
        props.styles && props.styles.borderTop ? `1px solid ${props.theme.componentsTheme.tableBorderColor}` : 'none'};
    color: ${props => (props.styles && props.styles.color ? props.styles.color : props.theme.componentsTheme.tdColor)};
    font-feature-settings: 'tnum' ${props => (props.styles && props.styles.tabular ? '1' : '0')};
    font-size: 14px;
    font-weight: ${props => (props.styles && props.styles.fontWeight ? props.styles.fontWeight : 'normal')};
    line-height: ${props => (props.styles && props.styles.lineWeight ? props.styles.lineWeight : '1.2')};
    padding: 5px ${themeDimensions.horizontalPadding} 5px 0;
    text-align: ${props =>
        props.styles && props.styles.textAlign && props.styles.textAlign.length ? props.styles.textAlign : 'left'};

    &:last-child {
        padding-right: 0;
    }
`;

export const CustomTDFirst = styled(CustomTD)`
    &,
    &:last-child {
        padding-left: ${themeDimensions.horizontalPadding};
    }
`;

export const CustomTDLast = styled(CustomTD)`
    &,
    &:last-child {
        padding-right: ${themeDimensions.horizontalPadding};
    }
`;

export const CustomTDTitle = styled(CustomTD)`
    color: ${props => (props.styles && props.styles.color ? props.styles.color : props.theme.componentsTheme.thColor)};
    font-size: 12px;
    text-transform: uppercase;
`;

export const THFirst = styled(TH)`
    &,
    &:last-child {
        padding-left: ${themeDimensions.horizontalPadding};
    }
`;

export const THLast = styled(TH)`
    &,
    &:last-child {
        padding-right: ${themeDimensions.horizontalPadding};
    }
`;
