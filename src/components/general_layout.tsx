import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { WalletConnectionStatusContainer } from './account';

const General = styled.div`
    background: #F5F5F5;
`;

const Toolbar = styled.div`
    height: 40px;
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
    padding: 0.5em 1em;
`;

const Content = styled.div`
    margin-top: 10px;
    padding: 0.5em 1em;
`;

const LogoLink = styled(Link)`
    margin-right: 1em;
`;

const MyWalletLink = styled(Link)`
    float: right;
`;

interface GeneralLayoutProps {
    children: React.ReactChildren;
}

export const GeneralLayout = (props: React.Props<any> | GeneralLayoutProps) => {
  const { children } = props;

  return (
    <General>
        <Toolbar>
            <LogoLink to="/">Launchkit</LogoLink>
            <WalletConnectionStatusContainer />
            <MyWalletLink to="/my-wallet">My Wallet</MyWalletLink>
        </Toolbar>
        <Content>{children}</Content>
    </General>
  );
};
