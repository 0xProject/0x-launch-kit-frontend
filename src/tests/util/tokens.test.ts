import { BigNumber } from '0x.js';

import { tokenAmountInUnits, tokenSymbolToDisplayString, unitsInTokenAmount } from '../../util/tokens';

describe('tokenAmountInUnits', () => {
    it('should format the token amount', async () => {
        // given
        const amount = new BigNumber('123');
        const decimals = 2;

        // when
        const result = tokenAmountInUnits(amount, decimals);

        // then
        expect(result).toEqual('1.23');
    });

    it('should have 2 digits of precision', async () => {
        // given
        const amount = new BigNumber('12345');
        const decimals = 4;

        // when
        const result = tokenAmountInUnits(amount, decimals);

        // then
        expect(result).toEqual('1.23');
    });
});

describe('unitsInTokenAmount', () => {
    it('should convert the given amount to a BigNumber', async () => {
        // given
        const amount = '1.23';
        const decimals = 2;

        // when
        const result = unitsInTokenAmount(amount, decimals);

        // then
        const expected = new BigNumber('123');
        expect(result.eq(expected)).toBe(true);
    });

    it('should take decimals into account', async () => {
        // given
        const amount = '1.23';
        const decimals = 4;

        // when
        const result = unitsInTokenAmount(amount, decimals);

        // then
        const expected = new BigNumber('12300');
        expect(result.eq(expected)).toBe(true);
    });
});

describe('tokenSymbolToDisplayString', () => {
    it('should return weth token correctly formated', async () => {
        // given
        const symbol = 'weth';
        // when
        const result = tokenSymbolToDisplayString(symbol);

        // then
        const expected = 'wETH';
        expect(result === expected).toBe(true);
    });

    it('should return generic token (no weth) in uppercase', async () => {
        // given
        const symbol = 'zrx';
        // when
        const result = tokenSymbolToDisplayString(symbol);

        // then
        const expected = 'ZRX';
        expect(result === expected).toBe(true);
    });
});
