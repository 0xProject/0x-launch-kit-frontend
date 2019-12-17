import React from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import styled from 'styled-components';

import { themeDimensions } from '../../../../themes/commons';
import { AccordionCollapse } from '../../../common/accordion_collapse';
import { TextInput } from '../../../common/final_form/text_input';

import { FieldContainer, Label, LabelContainer } from './styles';

const StyledFilter = styled.div`
    padding-left: 20px;
    padding-top: 10px;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

export const MarketFiltersForm = ({ isOpen = false, selector }: { isOpen?: boolean; selector?: string }) => (
    <>
        <AccordionCollapse title={'5-Market Quotes'} setIsOpen={isOpen} className={selector}>
            <FieldArray name="marketFilters">
                {({ fields }) =>
                    fields.map((name, index) => (
                        <StyledFilter key={name}>
                            <FilterForm name={name} index={index} />
                        </StyledFilter>
                    ))
                }
            </FieldArray>
        </AccordionCollapse>
    </>
);

const FilterForm = ({ name, index }: { name: string; index: number }) => {
    return (
        <>
            <LabelContainer>
                <Label>Symbol</Label>
            </LabelContainer>
            <FieldContainer>
                <Field name={`${name}.text`} component={TextInput} placeholder={`text`} disabled={true} />
            </FieldContainer>
        </>
    );
};
