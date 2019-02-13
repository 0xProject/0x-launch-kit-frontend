import { BigNumber } from '0x.js';

import { tokenAmountInUnits } from './tokens';
import { Token } from './types';

describe('tokenAmountInUnits', () => {
    it('should format the token amount', async () => {
        // given
        const token: Token = {
            decimals: 2,
            address: '0x0',
            symbol: 'MOCK',
        };
        const amount = new BigNumber('123');

        // when
        const result = tokenAmountInUnits(token, amount);

        // then
        expect(result).toEqual('1.23');
    });

    it('should have 2 digits of precision', async () => {
        // given
        const token: Token = {
            decimals: 4,
            address: '0x0',
            symbol: 'MOCK',
        };
        const amount = new BigNumber('12345');

        // when
        const result = tokenAmountInUnits(token, amount);

        // then
        expect(result).toEqual('1.23');
    });
});
