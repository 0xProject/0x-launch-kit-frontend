import React from 'react';

import { WalletTokenBalancesContainer, WalletWethBalanceContainer } from '../components/account';
import { ColumnNarrow } from '../components/common/column_narrow';
import { ColumnWide } from '../components/common/column_wide';

export const MyWallet = () => (
    <>
        <ColumnNarrow>
            <WalletWethBalanceContainer />
        </ColumnNarrow>
        <ColumnWide>
            <WalletTokenBalancesContainer />
        </ColumnWide>
    </>
);
