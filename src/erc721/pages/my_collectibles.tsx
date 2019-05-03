import React from 'react';

import img1 from '../../assets/cryptokitties/1.png';
import img10 from '../../assets/cryptokitties/10.png';
import img2 from '../../assets/cryptokitties/2.png';
import img3 from '../../assets/cryptokitties/3.png';
import img4 from '../../assets/cryptokitties/4.png';
import img5 from '../../assets/cryptokitties/5.png';
import img6 from '../../assets/cryptokitties/6.png';
import img7 from '../../assets/cryptokitties/7.png';
import img8 from '../../assets/cryptokitties/8.png';
import img9 from '../../assets/cryptokitties/9.png';
import { CheckMetamaskStateModalContainer } from '../../components/common/check_metamask_state_modal_container';
import { ColumnMyCollectibles } from '../../components/common/column_my_collectibles';
import { CryptoKitty } from '../../components/common/cryptokitty';

const cryptoKitties = [
    {
        name: 'Glitter',
        price: '2.30',
        color: '#F6FEFC',
        image: img1,
    },
    {
        name: 'Furbeard',
        price: '1.22',
        color: '#F6C68A',
        image: img2,
    },
    {
        name: 'Glasswalker',
        price: '3.41',
        color: '#CAFAF7',
        image: img3,
    },
    {
        name: 'Ande',
        price: '4.40',
        color: '#B8F1B9',
        image: img4,
    },
    {
        name: 'Squib',
        price: '10.30',
        color: '#CFD4F9',
        image: img5,
    },
    {
        name: 'Negato',
        price: '11.30',
        color: '#D7BBF3',
        image: img6,
    },
    {
        name: 'DuCat',
        price: '12.90',
        color: '#D6DDD8',
        image: img7,
    },
    {
        name: 'Berry',
        price: '2.30',
        color: '#F7B4D5',
        image: img8,
    },
    {
        name: 'Vernon',
        price: '9.30',
        color: '#EADDDD',
        image: img9,
    },
    {
        name: 'Lee',
        price: '7.80',
        color: '#B8B2B3',
        image: img10,
    },
];

export const MyCollectibles = () => {
    const rows = cryptoKitties.map((item, index) => {
        const { name, price, image, color } = item;
        return <CryptoKitty name={name} price={price} image={image} color={color} key={index} />;
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
