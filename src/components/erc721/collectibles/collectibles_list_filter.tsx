import React from 'react';

import { CollectibleFilterType } from '../../../util/filterable_collectibles';

interface Props {
    currentValue: CollectibleFilterType;
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

const options: CollectibleFilterType[] = [
    CollectibleFilterType.ShowAll,
    CollectibleFilterType.FixedPrice,
    CollectibleFilterType.DecliningAuction,
];

export const CollectiblesListFilter = (props: Props) => {
    const { currentValue, onChange } = props;
    return (
        <div>
            {options.map(option => (
                <label key={option}>
                    <input type="radio" value={option} checked={currentValue === option} onChange={onChange} />
                    {option}
                </label>
            ))}
        </div>
    );
};
