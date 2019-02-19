import React from 'react';

import { MainContent } from '../components/common/main_content';
import { Sidebar } from '../components/common/sidebar';
import { WalletTokenBalancesContainer, WalletWethBalanceContainer } from '../components/account';

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
