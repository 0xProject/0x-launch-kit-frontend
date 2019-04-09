import { BigNumber } from '0x.js';

import * as CONSTANTS from '../common/constants';

import { createBuySellLimitSteps } from './steps';
import { tokenFactory } from './test-utils';
import { unitsInTokenAmount } from './tokens';
import { OrderSide, Step, StepKind, TokenBalance, TokenSymbol } from './types';

const ZERO = new BigNumber(0);
const wethToken = {
    primaryColor: 'white',
    address: '0x100',
    decimals: 18,
    symbol: 'WETH' as TokenSymbol,
    name: 'wETH',
};

const tokenBalances: TokenBalance[] = [
    {
        balance: new BigNumber(1),
        token: {
            primaryColor: 'white',
            address: '0x1',
            decimals: 18,
            symbol: TokenSymbol.Zrx,
            name: 'Zrx',
        },
        isUnlocked: true,
    },
    {
        balance: new BigNumber(1),
        token: {
            primaryColor: 'white',
            address: '0x2',
            decimals: 18,
            symbol: TokenSymbol.Mkr,
            name: 'Mkr',
        },
        isUnlocked: true,
    },
    {
        balance: new BigNumber(1),
        token: {
            primaryColor: 'white',
            address: '0x3',
            decimals: 18,
            symbol: TokenSymbol.Rep,
            name: 'Augur',
        },
        isUnlocked: true,
    },
    {
        balance: new BigNumber(1),
        token: {
            primaryColor: 'white',
            address: '0x3',
            decimals: 18,
            symbol: TokenSymbol.Dgd,
            name: 'Digi',
        },
        isUnlocked: true,
    },
    {
        balance: new BigNumber(1),
        token: {
            primaryColor: 'white',
            address: '0x3',
            decimals: 18,
            symbol: TokenSymbol.Mln,
            name: 'Melon',
        },
        isUnlocked: true,
    },
];

describe('Buy sell limit steps for zrx/weth', () => {
    it('should create just one buy limit step if base and quote tokens are unlocked', async () => {
        // given
        const baseToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Zrx });
        const quoteToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Weth });
        const wethTokenBalance = {
            balance: ZERO,
            token: wethToken,
            isUnlocked: true,
        };
        const amount: BigNumber = new BigNumber(0);
        const price: BigNumber = new BigNumber(0);
        const side: OrderSide = OrderSide.Buy;

        // when
        const buySellLimitFlow: Step[] = createBuySellLimitSteps(
            baseToken,
            quoteToken,
            tokenBalances,
            wethTokenBalance,
            amount,
            price,
            side,
        );

        // then
        expect(buySellLimitFlow).toHaveLength(1);
        expect(buySellLimitFlow[0].kind).toBe(StepKind.BuySellLimit);
    });
    it('Should create two steps, buy and unlock step if creating a buy limit order for an X/Y market with Y locked', async () => {
        // given
        const baseToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Zrx });
        const quoteToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Weth });
        const wethTokenBalance = {
            balance: ZERO,
            token: wethToken,
            isUnlocked: false,
        };
        const amount: BigNumber = new BigNumber(0);
        const price: BigNumber = new BigNumber(0);
        const side: OrderSide = OrderSide.Buy;

        // when
        const buySellLimitFlow: Step[] = createBuySellLimitSteps(
            baseToken,
            quoteToken,
            tokenBalances,
            wethTokenBalance,
            amount,
            price,
            side,
        );

        // then
        expect(buySellLimitFlow).toHaveLength(2);
        expect(buySellLimitFlow[0].kind).toBe(StepKind.ToggleTokenLock);
        expect(buySellLimitFlow[1].kind).toBe(StepKind.BuySellLimit);
    });
    it('Should create two steps, buy and unlock step if creating a sell limit order for an X/Y market with X locked', async () => {
        // given
        const baseToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Zrx });
        const quoteToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Weth });
        // Base token zrx is locked
        tokenBalances[0].isUnlocked = false;
        const wethTokenBalance = {
            balance: ZERO,
            token: wethToken,
            isUnlocked: true,
        };
        const amount: BigNumber = new BigNumber(0);
        const price: BigNumber = new BigNumber(0);
        const side: OrderSide = OrderSide.Sell;

        // when
        const buySellLimitFlow: Step[] = createBuySellLimitSteps(
            baseToken,
            quoteToken,
            tokenBalances,
            wethTokenBalance,
            amount,
            price,
            side,
        );
        // then
        expect(buySellLimitFlow).toHaveLength(2);
        expect(buySellLimitFlow[0].kind).toBe(StepKind.ToggleTokenLock);
        expect(buySellLimitFlow[1].kind).toBe(StepKind.BuySellLimit);
    });
    it('Should create a unlock zrx step if MAKER FEE is positive and if zrx is locked', async () => {
        // given
        const baseToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Mkr });
        const quoteToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Weth });
        const wethTokenBalance = {
            balance: ZERO,
            token: wethToken,
            isUnlocked: true,
        };
        // Base token zrx is locked
        tokenBalances[0].isUnlocked = false;
        const amount: BigNumber = new BigNumber(0);
        const price: BigNumber = new BigNumber(0);
        const side: OrderSide = OrderSide.Buy;
        // @ts-ignore
        CONSTANTS.MAKER_FEE = unitsInTokenAmount('1', 18);

        // when
        const buySellLimitFlow: Step[] = createBuySellLimitSteps(
            baseToken,
            quoteToken,
            tokenBalances,
            wethTokenBalance,
            amount,
            price,
            side,
        );

        // then
        expect(buySellLimitFlow).toHaveLength(2);
        expect(buySellLimitFlow[0].kind).toBe(StepKind.ToggleTokenLock);
        expect(buySellLimitFlow[1].kind).toBe(StepKind.BuySellLimit);
    });
});
