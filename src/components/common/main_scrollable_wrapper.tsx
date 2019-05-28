import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../themes/commons';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const MainScrollable = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: -${themeDimensions.mainPadding};
    overflow: auto;
    padding: ${themeDimensions.mainPadding};
`;

export const MainScrollableWrapper: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <MainScrollable {...restProps}>{children}</MainScrollable>;
};
