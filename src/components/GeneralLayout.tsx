import React from 'react';
import styled from 'styled-components';
import { Toolbar } from './common/toolbar';

const General = styled.div`
    background: #F5F5F5;
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const Content = styled.div`
    flex-grow: 1;
    overflow: auto;
    padding: 10px;
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
