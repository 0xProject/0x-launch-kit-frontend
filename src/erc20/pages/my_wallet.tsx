import React from 'react';

import { WalletTokenBalancesContainer, WalletWethBalanceContainer } from '../../components/account';
import { CheckMetamaskStateModalContainer } from '../../components/common/check_metamask_state_modal_container';
import { ColumnNarrow } from '../../components/common/column_narrow';
import { ColumnWide } from '../../components/common/column_wide';

export const MyWallet = () => (
    <>
        <CheckMetamaskStateModalContainer>
            <ColumnNarrow>
                <WalletWethBalanceContainer />
            </ColumnNarrow>
            <ColumnWide>
                <WalletTokenBalancesContainer />
            </ColumnWide>
        </CheckMetamaskStateModalContainer>
    </>
);
