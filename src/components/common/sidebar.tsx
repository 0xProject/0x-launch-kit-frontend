import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../util/theme';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const SidebarWrapper = styled.div`
    flex-shrink: 0;
    margin-right: 10px;
    max-width: 100%;
    width: ${themeDimensions.sidebarWidth};
`;

export const Sidebar: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <SidebarWrapper {...restProps}>{children}</SidebarWrapper>;
};
