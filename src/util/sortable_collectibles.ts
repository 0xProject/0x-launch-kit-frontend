import { BigNumber } from '0x.js';

import { getCollectiblePrice } from './collectibles';
import { Collectible } from './types';

export interface SortableCollectible {
    price: BigNumber | null;
    creationDate: BigNumber | null;
    collectible: Collectible;
}

export enum CollectibleSortType {
    PriceLowToHigh = 'Newest Added',
    PriceHighToLow = 'Price: low to high',
    NewestAdded = 'Price: hight to low',
}

export const getCompareFunctionForSort = (sortType: CollectibleSortType) => {
    switch (sortType) {
        case CollectibleSortType.PriceLowToHigh:
            return (a: SortableCollectible, b: SortableCollectible) => compareAscending(a.price, b.price);
        case CollectibleSortType.PriceHighToLow:
            return (a: SortableCollectible, b: SortableCollectible) => compareAscending(a.price, b.price) * -1;
        default:
            return (a: SortableCollectible, b: SortableCollectible) =>
                compareAscending(a.creationDate, b.creationDate) * -1;
    }
};

enum CompareOrder {
    AFirst = -1,
    BFirst = 1,
    Equals = 0,
}

export const compareAscending = (a: BigNumber | null, b: BigNumber | null): CompareOrder => {
    // If both are null, they are equal
    if (a === null && b === null) {
        return CompareOrder.Equals;
    }
    // If only one is a BigNumber, it should come first
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
        return valueA.isLessThan(valueB) ? CompareOrder.AFirst : CompareOrder.BFirst;
    }
};

export const getSortedCollectibles = (
    collectibles: Collectible[],
    sortType: CollectibleSortType,
): SortableCollectible[] => {
    const comparePriceAscending = getCompareFunctionForSort(sortType);
    return collectibles
        .map(collectible => {
            const price = getCollectiblePrice(collectible);
            const creationDate = collectible.order ? collectible.order.salt : null;
            return {
                price,
                creationDate,
                collectible,
            };
        })
        .sort(comparePriceAscending);
};
