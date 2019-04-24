import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getThemeColors } from '../../store/selectors';
import { StoreState, StyledComponentThemeProps } from '../../util/types';

interface EmptyWrapperProps extends StyledComponentThemeProps {
    alignAbsoluteCenter?: boolean;
}

interface Props extends HTMLAttributes<HTMLDivElement>, EmptyWrapperProps {
    text: string;
}

const EmptyContentWrapper = styled.div<EmptyWrapperProps>`
    align-items: center;
    color: ${props => props.themeColors.lightGray}
    display: flex;
    font-size: 16px;
    font-weight: 500;
    height: 100%;
    justify-content: center;
    width: 100%;

    ${props =>
        props.alignAbsoluteCenter
            ? `
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
    `
            : ''}
`;

const EmptyContent: React.FC<Props> = props => {
    const { text, themeColors, ...restProps } = props;

    return (
        <EmptyContentWrapper themeColors={themeColors} {...restProps}>
            {text}
        </EmptyContentWrapper>
    );
};

const mapStateToProps = (state: StoreState): StyledComponentThemeProps => {
    return {
        themeColors: getThemeColors(state),
    };
};

const EmptyContentContainer = connect(mapStateToProps)(EmptyContent);

export { EmptyContent, EmptyContentContainer };
