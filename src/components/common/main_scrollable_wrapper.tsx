import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const MainScrollable = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: -${props => props.theme.dimensions.mainPadding};
    overflow: auto;
    padding: ${props => props.theme.dimensions.mainPadding};
`;

export const MainScrollableWrapper: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <MainScrollable {...restProps}>{children}</MainScrollable>;
};
