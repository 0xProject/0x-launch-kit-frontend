import { BigNumber, OrderStatus } from '0x.js';
import { createSelector } from 'reselect';

import { OrderBook, OrderSide, StoreState } from '../util/types';
import { mergeByPrice } from '../util/ui_orders';

export const getEthAccount = (state: StoreState) => state.blockchain.ethAccount;
export const getTokenBalances = (state: StoreState) => state.blockchain.tokenBalances;
export const getWeb3State = (state: StoreState) => state.blockchain.web3State;
export const getEthBalance = (state: StoreState) => state.blockchain.ethBalance;
export const getWethBalance = (state: StoreState) => state.blockchain.wethBalance;
export const getOrders = (state: StoreState) => state.relayer.orders;
export const getUserOrders = (state: StoreState) => state.relayer.userOrders;
export const getSelectedToken = (state: StoreState) => state.relayer.selectedToken;
export const getStepsModalPendingSteps = (state: StoreState) => state.stepsModal.pendingSteps;
export const getStepsModalDoneSteps = (state: StoreState) => state.stepsModal.doneSteps;
export const getStepsModalCurrentStep = (state: StoreState) => state.stepsModal.currentStep;

export const getOpenOrders = createSelector(
    getOrders,
    orders => {
        return orders.filter(order => order.status === OrderStatus.Fillable);
    },
);

export const getOpenSellOrders = createSelector(
    getOpenOrders,
    orders => {
        return orders.filter(order => order.side === OrderSide.Sell).sort((o1, o2) => o2.price.comparedTo(o1.price));
    },
);

export const getOpenBuyOrders = createSelector(
    getOpenOrders,
    orders => {
        return orders.filter(order => order.side === OrderSide.Buy).sort((o1, o2) => o2.price.comparedTo(o1.price));
    },
);

export const getMySizeOrders = createSelector(
    getUserOrders,
    userOrders => {
        return userOrders
            .filter(userOrder => userOrder.status === OrderStatus.Fillable)
            .map(order => {
                return {
                    size: order.size.minus(order.filled),
                    side: order.side,
                    price: order.price,
                };
            });
    },
);

export const getSpread = createSelector(
    getOpenBuyOrders,
    getOpenSellOrders,
    (buyOrders, sellOrders) => {
        if (!buyOrders.length || !sellOrders.length) {
            return new BigNumber(0);
        }

        const lowestPriceSell = sellOrders[sellOrders.length - 1].price;
        const highestPriceBuy = buyOrders[0].price;

        return lowestPriceSell.sub(highestPriceBuy);
    },
);

export const getOrderBook = createSelector(
    getOpenSellOrders,
    getOpenBuyOrders,
    getMySizeOrders,
    getSpread,
    (sellOrders, buyOrders, mySizeOrders, spread): OrderBook => {
        return {
            sellOrders: mergeByPrice(sellOrders),
            buyOrders: mergeByPrice(buyOrders),
            mySizeOrders,
            spread,
        };
    },
);

export const getSelectedTokenSymbol = createSelector(
    getSelectedToken,
    token => (token ? token.symbol : ''),
);
