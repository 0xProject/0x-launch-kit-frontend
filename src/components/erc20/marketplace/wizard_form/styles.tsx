import styled from 'styled-components';

import { themeDimensions } from '../../../../themes/commons';

export const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;
export const FieldContainer = styled.div`
    height: ${themeDimensions.fieldHeight};
    margin-bottom: 10px;
    position: relative;
`;

export const LabelContainer = styled.div`
    align-items: flex-start;
    display: flex;
    justify-content: start;
    margin-bottom: 10px;
`;
