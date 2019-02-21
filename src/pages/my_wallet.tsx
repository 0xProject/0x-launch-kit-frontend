import React from 'react';

import { WalletTokenBalancesContainer, WalletWethBalanceContainer } from '../components/account';
import { MainContent } from '../components/common/main_content';
import { Sidebar } from '../components/common/sidebar';

export const MyWallet = () => (
    <>
        <Sidebar>
            <WalletWethBalanceContainer />
        </Sidebar>
        <MainContent>
            <WalletTokenBalancesContainer />
        </MainContent>
    </>
);
