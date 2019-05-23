import { BigNumber } from '0x.js';

import { getCollectiblePrice } from './collectibles';
import { Collectible } from './types';

export interface SortableCollectible {
    price: BigNumber | null;
    creationDate: BigNumber | null;
    name: string;
    collectible: Collectible;
}

export enum CollectibleSortType {
    PriceLowToHigh = 'price_low_to_high',
    PriceHighToLow = 'price_high_to_low',
    NewestAdded = 'newest_added',
}

export const getCompareFunctionForSort = (sortType: CollectibleSortType) => {
    switch (sortType) {
        case CollectibleSortType.PriceLowToHigh:
            return (a: SortableCollectible, b: SortableCollectible) => compareAscending(a.price, b.price, false);
        case CollectibleSortType.PriceHighToLow:
            return (a: SortableCollectible, b: SortableCollectible) => compareAscending(a.price, b.price, true);
        default:
            return (a: SortableCollectible, b: SortableCollectible) =>
                compareAscending(a.creationDate, b.creationDate, true);
    }
};

enum CompareOrder {
    AFirst = -1,
    BFirst = 1,
    Equals = 0,
}

export const compareAscending = (a: BigNumber | null, b: BigNumber | null, invert: boolean): CompareOrder => {
    // If both are null, they are equal
    if (a === null && b === null) {
        return CompareOrder.Equals;
    }
    // If only one is a BigNumber, "it should come first"
    if (a !== null && b === null) {
        return CompareOrder.AFirst;
    } else if (a === null && b !== null) {
        return CompareOrder.BFirst;
    }
    // If both are BigNumber, return the corresponding comparisson
    const valueA = a as BigNumber;
    const valueB = b as BigNumber;
    if (valueA.isEqualTo(valueB)) {
        return CompareOrder.Equals;
    } else {
        // If invert is set, we are toggling the order, although the null value treatment is the same
        const ascendingResult = valueA.isLessThan(valueB) ? CompareOrder.AFirst : CompareOrder.BFirst;
        return invert ? ascendingResult * -1 : ascendingResult;
    }
};

export const getSortedCollectibles = (
    collectibles: Collectible[],
    sortType: CollectibleSortType,
): SortableCollectible[] => {
    return collectibles
        .map(collectible => {
            const price = getCollectiblePrice(collectible);
            const creationDate = collectible.order ? collectible.order.salt : null;
            return {
                price,
                creationDate,
                collectible,
                name: collectible.name,
            };
        })
        .sort(getCompareFunctionForSort(sortType));
};
