import React from 'react';

import { CheckMetamaskStateModalContainer } from '../../components/common/check_metamask_state_modal_container';
import { CollectibleAsset } from '../components/collectible_asset';
import { ColumnMyCollectibles } from '../components/column_my_collectibles';

const collectibleAssets = [
    {
        name: 'Glitter',
        price: '2.30',
        color: '#F6FEFC',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888670/6_w93q19.png',
    },
    {
        name: 'Furbeard',
        price: '1.22',
        color: '#F6C68A',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/9_xunbhn.png',
    },
    {
        name: 'Glasswalker',
        price: '3.41',
        color: '#CAFAF7',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/10_iqm4un.png',
    },
    {
        name: 'Ande',
        price: '4.40',
        color: '#B8F1B9',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888667/5_sxqrol.png',
    },
    {
        name: 'Squib',
        price: '10.30',
        color: '#CFD4F9',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888664/1_sz6sji.png',
    },
    {
        name: 'Negato',
        price: '11.30',
        color: '#D7BBF3',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888661/8_qjebni.png',
    },
    {
        name: 'DuCat',
        price: '12.90',
        color: '#D6DDD8',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888654/2_yndavu.png',
    },
    {
        name: 'Berry',
        price: '2.30',
        color: '#F7B4D5',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888653/4_do9hzd.png',
    },
    {
        name: 'Vernon',
        price: '9.30',
        color: '#EADDDD',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888649/7_n9ro9n.png',
    },
    {
        name: 'Lee',
        price: '7.80',
        color: '#B8B2B3',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888649/3_mpghqd.png',
    },
];

export const MyCollectibles = () => {
    const rows = collectibleAssets.map((item, index) => {
        const { name, price, image, color } = item;
        return <CollectibleAsset name={name} price={price} image={image} color={color} key={index} />;
    });

    const groupSize = 2;
    const rowsReduced = rows.reduce((row: any[], item, index) => {
        const chunkIndex = Math.floor(index / groupSize);

        if (!row[chunkIndex]) {
            row[chunkIndex] = [] as any[];
        }

        row[chunkIndex].push(item);

        return row;
    }, []);

    return (
        <>
            {rowsReduced.map((items, index) => {
                return (
                    <React.Fragment key={index}>
                        <ColumnMyCollectibles>
                            {items.map((item: any) => {
                                return item;
                            })}
                        </ColumnMyCollectibles>
                    </React.Fragment>
                );
            })}
            <CheckMetamaskStateModalContainer />
        </>
    );
};
