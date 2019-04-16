import { tokenSymbolToDisplayString } from './tokens';
import { TokenSymbol } from './types';

describe('tokenSymbolToDisplayString', () => {
    it('should return weth token correctly formated', async () => {
        // given
        const symbol = TokenSymbol.Weth;
        // when
        const result = tokenSymbolToDisplayString(symbol);

        // then
        const expected = 'wETH';
        expect(result === expected).toBe(true);
    });

    it('should return generic token (no weth) in uppercase', async () => {
        // given
        const symbol = TokenSymbol.Zrx;
        // when
        const result = tokenSymbolToDisplayString(symbol);

        // then
        const expected = 'ZRX';
        expect(result === expected).toBe(true);
    });
});
