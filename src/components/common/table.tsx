import styled from 'styled-components';

import { themeColors, themeDimensions } from '../../util/theme';

export const THead = styled.thead`
    text-transform: uppercase;
    color: #ccc;
    font-size: 12px;
`;

interface TableStyleProps {
    color?: string;
    borderBottom?: boolean;
    borderTop?: boolean;
    textAlign?: string;
}

interface TableTDProps {
    styles?: TableStyleProps;
}

interface TableProps {
    styles?: TableStyleProps;
    fitInCard?: boolean;
}

export const Table = styled.table<TableProps>`
    border-bottom: ${props =>
        props.styles && props.styles.borderBottom ? `1px solid ${themeColors.borderColor}` : 'none'};
    border-top: ${props => (props.styles && props.styles.borderTop ? `1px solid ${themeColors.borderColor}` : 'none')};
    margin-left: ${props => (props.fitInCard ? `-${themeDimensions.horizontalPadding}` : '0')};
    margin-right: ${props => (props.fitInCard ? `-${themeDimensions.horizontalPadding}` : '0')};
    width: ${props =>
        props.fitInCard
            ? `calc(100% + ${themeDimensions.horizontalPadding} + ${themeDimensions.horizontalPadding})`
            : '100%'};
`;

export const TR = styled.tr``;

export const TH = styled.th<TableTDProps>`
    border-bottom: ${props =>
        props.styles && props.styles.borderBottom ? `1px solid ${themeColors.borderColor}` : 'none'};
    border-top: ${props => (props.styles && props.styles.borderTop ? `1px solid ${themeColors.borderColor}` : 'none')};
    color: ${props => (props.styles && props.styles.color ? props.styles.color : themeColors.lightGray)};
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 1.2;
    padding: 0 10px 5px 0;
    text-align: ${props =>
        props.styles && props.styles.textAlign && props.styles.textAlign.length ? props.styles.textAlign : 'left'};
    text-transform: uppercase;

    &:last-child {
        padding-right: 0;
    }
`;

export const CustomTD = styled.td<TableTDProps>`
    border-bottom: ${props =>
        props.styles && props.styles.borderBottom ? `1px solid ${themeColors.borderColor}` : 'none'};
    border-top: ${props => (props.styles && props.styles.borderTop ? `1px solid ${themeColors.borderColor}` : 'none')};
    color: ${props => (props.styles && props.styles.color ? props.styles.color : '#000')};
    font-size: 14px;
    font-weight: normal;
    line-height: 1.2;
    padding: 5px 10px 5px 0;
    text-align: ${props =>
        props.styles && props.styles.textAlign && props.styles.textAlign.length ? props.styles.textAlign : 'left'};

    &:last-child {
        padding-right: 0;
    }
`;

export const CustomTDLast = styled(CustomTD)`
    &,
    &:last-child {
        padding-right: ${themeDimensions.horizontalPadding};
    }
`;

export const CustomTDTitle = styled(CustomTD)`
    color: ${props => (props.styles && props.styles.color ? props.styles.color : themeColors.lightGray)};
    font-size: 12px;
    text-transform: uppercase;
`;

export const THLast = styled(TH)`
    &,
    &:last-child {
        padding-right: ${themeDimensions.horizontalPadding};
    }
`;
