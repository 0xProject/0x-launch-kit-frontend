import React from 'react';

import { WalletTokenBalancesContainer, WalletWethBalanceContainer } from '../../account';
import { CheckMetamaskStateModalContainer } from '../../common/check_metamask_state_modal_container';
import { ColumnNarrow } from '../../common/column_narrow';
import { ColumnWide } from '../../common/column_wide';

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
