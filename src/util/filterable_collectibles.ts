import { isDutchAuction } from './orders';
import { SortableCollectible } from './sortable_collectibles';
import { Collectible } from './types';

export enum CollectibleFilterType {
    ShowAll = 'show_all',
    FixedPrice = 'fixed_price',
    DecliningAuction = 'declining_auction',
}

const isCollectibleSoldInDutchAuction = (collectible: Collectible): boolean => {
    if (collectible.order === null) {
        return false;
    }
    return isDutchAuction(collectible.order);
};

const isCollectibleSoldInBasicSell = (collectible: Collectible): boolean => {
    if (collectible.order === null) {
        return false;
    }
    return !isDutchAuction(collectible.order);
};

export const getFilterFunction = (filterType: CollectibleFilterType): ((sc: SortableCollectible) => boolean) => {
    switch (filterType) {
        case CollectibleFilterType.DecliningAuction:
            return (sc: SortableCollectible) => isCollectibleSoldInDutchAuction(sc.collectible);
        case CollectibleFilterType.FixedPrice:
            return (sc: SortableCollectible) => isCollectibleSoldInBasicSell(sc.collectible);
        default:
            return () => true;
    }
};

export const getFilteredCollectibles = (
    collectibles: SortableCollectible[],
    filterType: CollectibleFilterType,
): SortableCollectible[] => {
    const filterFunction = getFilterFunction(filterType);
    return collectibles.filter(filterFunction);
};

export const filterCollectibleByName = (collectibles: Collectible[], name: string): Collectible[] => {
    return collectibles.filter(collectible => {
        const collectibleName = (collectible.name || '').toLowerCase();
        return collectibleName.indexOf(name.toLowerCase()) > -1;
    });
};
