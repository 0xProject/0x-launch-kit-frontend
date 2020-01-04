import { OrderStatus, SignedOrder } from '@0x/types';
import { BigNumber, NULL_BYTES } from '@0x/utils';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import { CHAIN_ID, ZERO } from '../../../../common/constants';
import { CostValue, OrderDetails, Value } from '../../../../components/erc20/marketplace/order_details';
import { tokenSymbolToDisplayString, unitsInTokenAmount } from '../../../../util/tokens';
import { OrderSide, OrderType } from '../../../../util/types';

const ORDER_DEFAULTS = {
    makerAssetData: NULL_BYTES,
    takerAssetData: NULL_BYTES,
    chainId: CHAIN_ID,
};

const ORDER_FEE_DEFAULTS = {
    makerFee: ZERO,
    takerFee: ZERO,
    makerFeeAssetData: NULL_BYTES,
    takerFeeAssetData: NULL_BYTES,
};

describe('OrderDetails', () => {
    const getZeroTotalCost = (): string => {
        return `0.00`;
    };

    const getExpectedTotalCostText = (amount: number, symbol: string, price: number): string => {
        return `${new BigNumber(amount).toFixed(3)} ${tokenSymbolToDisplayString(symbol)} (${new BigNumber(amount)
            .times(price)
            .toFixed(2)} $)`;
    };

    const getExpectedFeeText = (amount: number): string => {
        return `${new BigNumber(amount).toFixed(2)} ${tokenSymbolToDisplayString('zrx')}`;
    };
    const getAmountTextFromWrapper = (wrapper: ShallowWrapper): string =>
        wrapper
            .find(CostValue)
            .at(0)
            .text();
    const getFeeTextFromWrapper = (wrapper: ShallowWrapper): string =>
        wrapper
            .find(Value)
            .at(0)
            .text();

    const currencyPair = {
        base: 'zrx',
        quote: 'weth',
        config: {
            basePrecision: 8,
            pricePrecision: 8,
            quotePrecision: 8,
            minAmount: 0,
            maxAmount: 1000000,
        },
    };

    it('Calculates total cost for limit orders', () => {
        // given
        const makerAmount = unitsInTokenAmount('13', 18);
        const tokenPrice = new BigNumber(3);
        const fees = async () => ORDER_FEE_DEFAULTS;
        const qouteInUSD = new BigNumber(1);

        // when
        const wrapper = shallow(
            <OrderDetails
                orderSide={OrderSide.Sell}
                orderType={OrderType.Limit}
                tokenAmount={makerAmount}
                tokenPrice={tokenPrice}
                currencyPair={currencyPair}
                qouteInUSD={qouteInUSD}
                openBuyOrders={[]}
                openSellOrders={[]}
                onFetchTakerAndMakerFee={fees}
            />,
        );

        const amountText = getAmountTextFromWrapper(wrapper);
        expect(amountText).toEqual(getExpectedTotalCostText(0, currencyPair.quote, 1));
        const feeText = getFeeTextFromWrapper(wrapper);
        expect(feeText).toEqual(getZeroTotalCost());
    });

    it('Calculates fees for market orders', () => {
        // given
        const makerAmount = unitsInTokenAmount('10', 18);
        const tokenPrice = new BigNumber(2);
        const qouteInUSD = new BigNumber(1);
        const MAKER_FEE = unitsInTokenAmount('3', 18);
        const TAKER_FEE = unitsInTokenAmount('7', 18);

        const signedOrder1: SignedOrder = {
            ...ORDER_DEFAULTS,
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFeeAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFeeAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            takerFee: TAKER_FEE,
        };
        const signedOrder2 = {
            ...ORDER_DEFAULTS,
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            makerFeeAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFeeAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            takerFee: TAKER_FEE,
        };

        const sellOrder1 = {
            rawOrder: signedOrder1,
            side: OrderSide.Sell,
            size: unitsInTokenAmount('5', 18),
            filled: ZERO,
            price: new BigNumber(1),
            status: OrderStatus.Fillable,
        };
        const sellOrder2 = {
            rawOrder: signedOrder2,
            side: OrderSide.Sell,
            size: unitsInTokenAmount('5', 18),
            filled: ZERO,
            price: new BigNumber(1),
            status: OrderStatus.Fillable,
        };
        const fees = async () => ORDER_FEE_DEFAULTS;

        // when
        const wrapper = shallow(
            <OrderDetails
                orderType={OrderType.Market}
                orderSide={OrderSide.Buy}
                tokenAmount={makerAmount}
                tokenPrice={tokenPrice}
                currencyPair={currencyPair}
                qouteInUSD={qouteInUSD}
                openBuyOrders={[]}
                openSellOrders={[sellOrder1, sellOrder2]}
                onFetchTakerAndMakerFee={fees}
            />,
        );

        // then
        const feeText = getFeeTextFromWrapper(wrapper);
        expect(feeText).toEqual(getExpectedFeeText(14));
    });

    it('Calculates total cost for market orders', () => {
        // given
        // makerAmount = 10
        const makerAmount = unitsInTokenAmount('10', 18);
        const tokenPrice = new BigNumber(10);
        const qouteInUSD = new BigNumber(1);
        const MAKER_FEE = unitsInTokenAmount('1', 18);
        const TAKER_FEE = unitsInTokenAmount('1', 18);

        const signedOrder1 = {
            ...ORDER_DEFAULTS,
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFee: TAKER_FEE,
            makerFeeAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFeeAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
        };
        const signedOrder2 = {
            ...ORDER_DEFAULTS,
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFee: TAKER_FEE,
            makerFeeAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFeeAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
        };

        const sellOrder1 = {
            rawOrder: signedOrder1,
            side: OrderSide.Sell,
            size: unitsInTokenAmount('10', 18),
            filled: ZERO,
            price: new BigNumber(2),
            status: OrderStatus.Fillable,
        };
        const sellOrder2 = {
            rawOrder: signedOrder2,
            side: OrderSide.Sell,
            size: unitsInTokenAmount('3', 18),
            filled: ZERO,
            price: new BigNumber(1),
            status: OrderStatus.Fillable,
        };
        const fees = async () => ORDER_FEE_DEFAULTS;

        // when
        const wrapper = shallow(
            <OrderDetails
                orderType={OrderType.Market}
                orderSide={OrderSide.Buy}
                tokenAmount={makerAmount}
                tokenPrice={tokenPrice}
                currencyPair={currencyPair}
                qouteInUSD={qouteInUSD}
                openBuyOrders={[]}
                openSellOrders={[sellOrder1, sellOrder2]}
                onFetchTakerAndMakerFee={fees}
            />,
        );

        // then
        const amountText = getAmountTextFromWrapper(wrapper);
        expect(amountText).toEqual(getExpectedTotalCostText(17, currencyPair.quote, 1));
    });

    it('Do not displays a value if the order amount is not fillable on market', () => {
        // given
        const makerAmount = unitsInTokenAmount('50', 18);
        const qouteInUSD = new BigNumber(1);
        const tokenPrice = new BigNumber(1);
        const MAKER_FEE = unitsInTokenAmount('1', 18);

        const signedOrder1 = {
            ...ORDER_DEFAULTS,
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFee: new BigNumber(1),
            makerFeeAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFeeAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
        };
        const signedOrder2 = {
            ...ORDER_DEFAULTS,
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFee: new BigNumber(1),
            makerFeeAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFeeAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
        };

        const sellOrder1 = {
            rawOrder: signedOrder1,
            side: OrderSide.Sell,
            size: unitsInTokenAmount('10', 18),
            filled: ZERO,
            price: new BigNumber(2),
            status: OrderStatus.Fillable,
        };
        const sellOrder2 = {
            rawOrder: signedOrder2,
            side: OrderSide.Sell,
            size: unitsInTokenAmount('1', 18),
            filled: ZERO,
            price: new BigNumber(1),
            status: OrderStatus.Fillable,
        };
        const fees = async () => ORDER_FEE_DEFAULTS;

        // when
        const wrapper = shallow(
            <OrderDetails
                orderType={OrderType.Market}
                orderSide={OrderSide.Buy}
                tokenAmount={makerAmount}
                tokenPrice={tokenPrice}
                qouteInUSD={qouteInUSD}
                currencyPair={currencyPair}
                openBuyOrders={[]}
                openSellOrders={[sellOrder1, sellOrder2]}
                onFetchTakerAndMakerFee={fees}
            />,
        );

        // then
        const amountText = getAmountTextFromWrapper(wrapper);
        expect(amountText).toEqual('---');
    });
});
