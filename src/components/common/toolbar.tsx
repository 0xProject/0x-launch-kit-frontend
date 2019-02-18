import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { WalletConnectionStatusContainer } from '../account';

const toolbarHeight = 64;

const ToolbarWrapper = styled.div`
    align-items: center;
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
    display: flex;
    height: ${toolbarHeight}px;
    justify-content: space-between;
    padding: 0 20px;
`;

const MyWalletLink = styled(Link)`
    color: black;
    margin-right: 1em;
    text-decoration: underline;
`;

const StyledWalletConnectionStatusContainer = styled(WalletConnectionStatusContainer)`

`;

export const Toolbar = () => (
    <ToolbarWrapper>
        <Logo />
        <StyledWalletConnectionStatusContainer />
        <MyWalletLink to="/my-wallet">My Wallet</MyWalletLink>
    </ToolbarWrapper>
);
