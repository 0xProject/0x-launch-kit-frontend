import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const MainContentWrapper = styled.div`
    flex-shrink: 1;
    flex-grow: 1;
`;

export const MainContent: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <MainContentWrapper {...restProps}>{children}</MainContentWrapper>;
};
