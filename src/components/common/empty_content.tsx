import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {
    alignAbsoluteCenter?: boolean;
    text?: string;
}

const EmptyContentWrapper = styled.div<Props>`
    align-items: center;
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

export const EmptyContent: React.FC<Props> = props => {
    const { text, ...restProps } = props;

    return <EmptyContentWrapper {...restProps}>{text}</EmptyContentWrapper>;
};
