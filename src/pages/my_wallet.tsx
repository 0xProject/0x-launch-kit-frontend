import React from 'react';

import { WalletTokenBalancesContainer, WalletWethBalanceContainer } from '../components/account';

export const MyWallet = () => (
    <div>
        <WalletTokenBalancesContainer />
        <WalletWethBalanceContainer />
    </div>
);
