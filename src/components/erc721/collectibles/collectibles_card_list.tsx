import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../../themes/commons';
import { Collectible } from '../../../util/types';

import { CollectibleAssetContainer } from './collectible_details';

const CollectiblesListOverflow = styled.div`
    flex-grow: 1;
    overflow: auto;
`;

const CollectiblesList = styled.div`
    column-gap: 16px;
    display: grid;
    grid-template-columns: 1fr;
    margin: 0 auto;
    max-width: 1280px;
    row-gap: 24px;
    width: 100%;

    @media (min-width: ${themeBreakPoints.md}) {
        grid-template-columns: 1fr 1fr;
    }

    @media (min-width: ${themeBreakPoints.xl}) {
        grid-template-columns: 1fr 1fr 1fr;
    }

    @media (min-width: ${themeBreakPoints.xxl}) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
`;

interface Props {
    collectibles: Collectible[];
}

export const CollectiblesCardList = (props: Props) => {
    const { collectibles } = props;
    return (
        <CollectiblesListOverflow>
            <CollectiblesList>
                {collectibles.map((item, index) => {
                    const { name, image, color, order, tokenId } = item;
                    const price = order ? order.takerAssetAmount : null;
                    return (
                        <CollectibleAssetContainer
                            color={color}
                            id={tokenId}
                            image={image}
                            key={index}
                            name={name}
                            price={price}
                        />
                    );
                })}
            </CollectiblesList>
        </CollectiblesListOverflow>
    );
};
