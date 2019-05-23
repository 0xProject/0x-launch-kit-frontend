import { isDutchAuction } from './orders';
import { SortableCollectible } from './sortable_collectibles';
import { Collectible } from './types';

export enum CollectibleFilterType {
    ShowAll = 'show_all',
    FixedPrice = 'fixed_price',
    DecliningAuction = 'declining_auction',
    Name = 'name',
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

const filterCollectibleByName = (collectible: Collectible, name: string): boolean => {
    const collectibleName = collectible.name.toLowerCase();
    const filterName = name.toLowerCase();
    return collectibleName.indexOf(filterName) > -1;
};

export const getFilterFunction = (filterType: CollectibleFilterType): ((sc: SortableCollectible) => boolean) => {
    switch (filterType) {
        case CollectibleFilterType.DecliningAuction:
            return (sc: SortableCollectible) => isCollectibleSoldInDutchAuction(sc.collectible);
        case CollectibleFilterType.FixedPrice:
            return (sc: SortableCollectible) => isCollectibleSoldInBasicSell(sc.collectible);
        case CollectibleFilterType.Name:
            return (sc: SortableCollectible) => filterCollectibleByName(sc.collectible, sc.name);
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
