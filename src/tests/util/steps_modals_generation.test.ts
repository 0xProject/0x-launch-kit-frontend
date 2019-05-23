import { BigNumber } from '0x.js';

import * as CONSTANTS from '../../common/constants';
import {
    createBuySellLimitSteps,
    createBuySellMarketSteps,
    getUnlockTokenStepIfNeeded,
    getUnlockZrxStepIfNeeded,
    getWrapEthStepIfNeeded,
} from '../../util/steps_modals_generation';
import { tokenFactory } from '../../util/test-utils';
import { unitsInTokenAmount } from '../../util/tokens';
import {
    OrderSide,
    Step,
    StepKind,
    StepToggleTokenLock,
    StepWrapEth,
    TokenBalance,
    TokenSymbol,
} from '../../util/types';

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

describe('Buy sell market steps for zrx/weth', () => {
    it('should create just one buy market step if base and quote tokens are unlocked', async () => {
        // given
        const baseToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Zrx });
        const quoteToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Weth });
        // Unlocks base zrx token
        tokenBalances[0].isUnlocked = true;
        const wethTokenBalance = {
            balance: ZERO,
            token: wethToken,
            isUnlocked: true,
        };
        const amount: BigNumber = new BigNumber(0);
        const side: OrderSide = OrderSide.Buy;
        const amountOfWethNeededForOrders = new BigNumber('0');

        // when
        const buySellMarketFlow: Step[] = createBuySellMarketSteps(
            baseToken,
            quoteToken,
            tokenBalances,
            wethTokenBalance,
            amount,
            side,
            amountOfWethNeededForOrders,
        );

        // then
        expect(buySellMarketFlow).toHaveLength(1);
        expect(buySellMarketFlow[0].kind).toBe(StepKind.BuySellMarket);
    });
    it('Should create a unlock zrx step if TAKER FEE is positive and if zrx is locked', async () => {
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
        const side: OrderSide = OrderSide.Buy;
        // @ts-ignore
        CONSTANTS.TAKER_FEE = unitsInTokenAmount('1', 18);
        const amountOfWethNeededForOrders = new BigNumber('0');

        // when
        const buySellMarketFlow: Step[] = createBuySellMarketSteps(
            baseToken,
            quoteToken,
            tokenBalances,
            wethTokenBalance,
            amount,
            side,
            amountOfWethNeededForOrders,
        );

        // then
        expect(buySellMarketFlow).toHaveLength(2);
        expect(buySellMarketFlow[0].kind).toBe(StepKind.ToggleTokenLock);
        expect(buySellMarketFlow[1].kind).toBe(StepKind.BuySellMarket);
    });
});

describe('getUnlockTokenStepIfNeeded', () => {
    it('if the token is locked, should return a toggle lock step', async () => {
        // given
        const lockedToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Mkr });
        // locks mkr token
        tokenBalances[1].isUnlocked = false;
        const wethTokenBalance = {
            balance: ZERO,
            token: wethToken,
            isUnlocked: true,
        };

        // when
        const unlockStep: StepToggleTokenLock | null = getUnlockTokenStepIfNeeded(
            lockedToken,
            tokenBalances,
            wethTokenBalance,
        );
        // then
        expect(unlockStep).not.toBeNull();
        if (unlockStep) {
            expect(unlockStep.kind).toBe(StepKind.ToggleTokenLock);
        }
    });
    it('if the token is unlocked, should return null', async () => {
        // given
        const lockedToken = tokenFactory.build({ decimals: 18, symbol: TokenSymbol.Mkr });
        // unlock mkr token
        tokenBalances[1].isUnlocked = true;
        const wethTokenBalance = {
            balance: ZERO,
            token: wethToken,
            isUnlocked: true,
        };

        // when
        const unlockStep: StepToggleTokenLock | null = getUnlockTokenStepIfNeeded(
            lockedToken,
            tokenBalances,
            wethTokenBalance,
        );
        // then
        expect(unlockStep).toBeNull();
    });
});

describe('getWrapEthStepIfNeeded', () => {
    it('if the weth balance is less than the amount multiplied by price, should return a wrap eth step', async () => {
        // given
        const wethTokenBalance = {
            balance: ZERO,
            token: wethToken,
            isUnlocked: true,
        };
        const amount: BigNumber = new BigNumber(10);
        const price: BigNumber = new BigNumber(1);
        const side: OrderSide = OrderSide.Buy;

        // when
        const stepWrapEth: StepWrapEth | null = getWrapEthStepIfNeeded(amount, price, side, wethTokenBalance);

        // then
        expect(stepWrapEth).not.toBeNull();
        if (stepWrapEth) {
            expect(stepWrapEth.kind).toBe(StepKind.WrapEth);
        }
    });
    it('if the weth balance is bigger than the amount multiplied by price, should not return a wrap eth step', async () => {
        // given
        const wethTokenBalance = {
            balance: new BigNumber(11),
            token: wethToken,
            isUnlocked: true,
        };
        const amount: BigNumber = new BigNumber(10);
        const price: BigNumber = new BigNumber(1);
        const side: OrderSide = OrderSide.Buy;

        // when
        const stepWrapEth: StepWrapEth | null = getWrapEthStepIfNeeded(amount, price, side, wethTokenBalance);

        // then
        expect(stepWrapEth).toBeNull();
    });
    it('If creating sell order, should not return a wrap eth step', async () => {
        // given
        const wethTokenBalance = {
            balance: new BigNumber(11),
            token: wethToken,
            isUnlocked: true,
        };
        const amount: BigNumber = new BigNumber(10);
        const price: BigNumber = new BigNumber(1);
        const side: OrderSide = OrderSide.Sell;

        // when
        const stepWrapEth: StepWrapEth | null = getWrapEthStepIfNeeded(amount, price, side, wethTokenBalance);

        // then
        expect(stepWrapEth).toBeNull();
    });
});

describe('getUnlockZrxStepIfNeeded', () => {
    it('should return toggle lock step for zrx if zrx is locked', async () => {
        // given
        // Locks zrx
        tokenBalances[0].isUnlocked = false;

        // when
        const stepLockZrx: StepToggleTokenLock | null = getUnlockZrxStepIfNeeded(tokenBalances);

        // then
        expect(stepLockZrx).not.toBeNull();
        if (stepLockZrx) {
            expect(stepLockZrx.kind).toBe(StepKind.ToggleTokenLock);
        }
    });
    it('should return null if zrx is locked', async () => {
        // given
        // Unlocks zrx
        tokenBalances[0].isUnlocked = true;

        // when
        const stepLockZrx: StepToggleTokenLock | null = getUnlockZrxStepIfNeeded(tokenBalances);

        // then
        expect(stepLockZrx).toBeNull();
    });
});
