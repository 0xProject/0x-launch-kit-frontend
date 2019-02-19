import React from 'react';
import styled from 'styled-components';

import { Toolbar } from './toolbar';

const General = styled.div`
    background: #f5f5f5;
`;

const Content = styled.div`
    margin-top: 10px;
    padding: 0.5em 1em;
`;

interface GeneralLayoutProps {
    children: React.ReactChildren;
}

export const GeneralLayout = (props: React.Props<any> | GeneralLayoutProps) => {
    const { children } = props;

    return (
        <General>
            <Toolbar />
            <Content>{children}</Content>
        </General>
    );
};
