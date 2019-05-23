import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';

import { selectCollectible } from '../../../store/collectibles/actions';
import { getCollectiblePrice } from '../../../util/collectibles';
import { Collectible } from '../../../util/types';

import { ListItem } from './collectible_details_item_list';
import { TileItem } from './collectible_details_item_tile';

interface OwnProps extends HTMLAttributes<HTMLDivElement> {
    collectible: Collectible;
    isListItem?: boolean;
    onClick: () => any;
}

interface DispatchProps {
    updateSelectedCollectible: (collectible: Collectible) => any;
}

type Props = DispatchProps & OwnProps;

export const CollectibleOnList: React.FC<Props> = (props: Props) => {
    const { collectible, onClick, isListItem } = props;
    const { color, image, name } = collectible;
    const price = getCollectiblePrice(collectible);

    const handleAssetClick: React.EventHandler<React.MouseEvent> = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        onClick();
        try {
            props.updateSelectedCollectible(collectible);
        } catch (err) {
            window.alert(`Could not sell the specified order`);
        }
    };

    return isListItem ? (
        <ListItem onClick={handleAssetClick} color={color} image={image} name={name} />
    ) : (
        <TileItem onClick={handleAssetClick} color={color} image={image} price={price} name={name} />
    );
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        updateSelectedCollectible: (collectible: Collectible) => dispatch(selectCollectible(collectible)),
    };
};

export const CollectibleOnListContainer = connect(
    null,
    mapDispatchToProps,
)(CollectibleOnList);
