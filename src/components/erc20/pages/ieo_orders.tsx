import React from 'react';

import { FiatOnRampModalContainer } from '../../account/fiat_modal';
import { CheckWalletStateModalContainer } from '../../common/check_wallet_state_modal_container';
import { ColumnNarrow } from '../../common/column_narrow';
import { ColumnWide } from '../../common/column_wide';
import { Content } from '../common/content_wrapper';
import { IEOOrderContainer } from '../ieo_desk/ieo_order';
import { IEOOrderHistoryContainer } from '../ieo_desk/ieo_order_history';
import { IEOWalletBalanceContainer } from '../ieo_desk/ieo_wallet_balance';

const IEOOrdersPage = () => (
    <>
        <Content>
            <CheckWalletStateModalContainer>
                <ColumnNarrow>
                    <IEOOrderContainer />
                </ColumnNarrow>
                <ColumnWide>
                    <IEOOrderHistoryContainer />
                    <IEOWalletBalanceContainer />
                </ColumnWide>
            </CheckWalletStateModalContainer>
            <FiatOnRampModalContainer />
        </Content>
    </>
);

export { IEOOrdersPage as default };
