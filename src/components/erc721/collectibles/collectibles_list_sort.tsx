import React from 'react';
import styled from 'styled-components';

import { CollectibleSortType } from '../../../util/sortable_collectibles';
import { Dropdown } from '../../common/dropdown';
import { DropdownTextItemWrapper } from '../../common/dropdown_text_item';
import { SortIcon } from '../../common/icons/sort_icon';

import { DropdownButton } from './collectibles_dropdown_button';
import { DropdownContainer } from './collectibles_dropdown_container';

interface Props {
    currentValue: CollectibleSortType;
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

const options: CollectibleSortType[] = [
    CollectibleSortType.NewestAdded,
    CollectibleSortType.PriceLowToHigh,
    CollectibleSortType.PriceHighToLow,
];

const DropdownItemFilter = styled(DropdownTextItemWrapper)`
    ${props => (props.active ? 'cursor: default;' : '')}
    position: relative;

    input[type='radio'] {
        cursor: pointer;
        height: 100%;
        left: 0;
        opacity: 0;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 5;

        &:checked {
            cursor: default;
            pointer-events: none;
        }

        &:checked + span {
            font-weight: 500;
        }
    }
`;

const Text = styled.span`
    position: relative;
    z-index: 1;
`;

export const CollectiblesListSort = (props: Props) => {
    const { currentValue, onChange, ...restProps } = props;

    const header = <DropdownButton text={currentValue} extraIcon={<SortIcon />} />;

    const body = (
        <DropdownContainer>
            {options.map(option => (
                <DropdownItemFilter key={option} active={currentValue === option}>
                    <input type="radio" value={option} checked={currentValue === option} onChange={onChange} />
                    <Text>{option}</Text>
                </DropdownItemFilter>
            ))}
        </DropdownContainer>
    );

    return <Dropdown body={body} header={header} {...restProps} />;
};
