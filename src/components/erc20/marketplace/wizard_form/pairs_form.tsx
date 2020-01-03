import React, { useState } from 'react';
import { Field, useField } from 'react-final-form';
import { FieldArray, useFieldArray } from 'react-final-form-arrays';
import { OnChange } from 'react-final-form-listeners';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { ConfigTemplate } from '../../../../common/config';
import { updateAvailableMarkets } from '../../../../common/markets';
import { fetchMarkets } from '../../../../store/actions';
import { themeDimensions } from '../../../../themes/commons';
import { getKnownTokens } from '../../../../util/known_tokens';
import { CurrencyPair } from '../../../../util/types';
import { AccordionCollapse } from '../../../common/accordion_collapse';
import { TextInput } from '../../../common/final_form/text_input';

import { FieldContainer, Label, LabelContainer } from './styles';

const StyledPair = styled.div`
    padding-left: 20px;
    padding-top: 10px;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

const StyledActions = styled(Label)`
    padding: 5px;
`;

const StyledFieldContainer = styled(FieldContainer)`
    display: flex;
    justify-content: space-between;
`;

export const PairsForm = ({ isOpen = false, selector }: { isOpen?: boolean; selector?: string }) => {
    const fieldArray = useFieldArray('tokens');
    const dispatch = useDispatch();
    const fieldsArray = fieldArray.fields;
    return (
        <>
            <AccordionCollapse title={'4-Listed Pairs'} setIsOpen={isOpen} className={selector}>
                <FieldArray name="pairs">
                    {({ fields }) =>
                        fields.map((name, index) => (
                            <StyledPair key={name}>
                                <PairReadOnly name={name} index={index} />
                            </StyledPair>
                        ))
                    }
                </FieldArray>
                <OnChange name={'pairs'}>
                    {(value: CurrencyPair[], _previous: CurrencyPair[]) => {
                        const tokens = getKnownTokens();
                        tokens.updateTokens(fieldsArray.value);
                        updateAvailableMarkets(value);
                        const config = ConfigTemplate.getInstance();
                        config.setPairs(value);
                        config.setTokens(fieldsArray.value);
                        dispatch(fetchMarkets());

                        // do something
                    }}
                </OnChange>
            </AccordionCollapse>
        </>
    );
};

const PairConfigForm = ({ name, onSetRemoveIsEdit }: { name: string; onSetRemoveIsEdit: any }) => {
    return (
        <>
            <StyledActions onClick={onSetRemoveIsEdit} style={{ cursor: 'pointer' }}>
                ➖
            </StyledActions>
            <LabelContainer>
                <Label>Price Precision</Label>
            </LabelContainer>
            <FieldContainer>
                <Field name={`${name}.config.pricePrecision`} component={TextInput} placeholder={`Price Precision`} />
            </FieldContainer>
            <LabelContainer>
                <Label>Base Token Precision</Label>
            </LabelContainer>
            <FieldContainer>
                <Field name={`${name}.config.basePrecision`} component={TextInput} placeholder={`Base Precision`} />
            </FieldContainer>
            <LabelContainer>
                <Label>Min Amount</Label>
            </LabelContainer>
            <FieldContainer>
                <Field name={`${name}.config.minAmount`} component={TextInput} placeholder={`Min Precision`} />
            </FieldContainer>
        </>
    );
};

const PairReadOnly = ({ name, index }: { name: string; index: number }) => {
    const field = useField(name);
    const [isEdit, setIsEdit] = useState(false);
    const base: string = field.input.value.base || ' ';
    const quote: string = field.input.value.quote || ' ';
    const fieldArray = useFieldArray('pairs');
    const { fields } = fieldArray;
    const onSwapUp = () => {
        const newIndex = index - 1;
        if (newIndex >= 0) {
            fields.move(index, newIndex);
            updateAvailableMarkets(fields.value);
        }
    };
    const onSwapDown = () => {
        const total = fields.value.length;
        const newIndex = index + 1;
        if (newIndex < total) {
            fields.move(index, newIndex);
            updateAvailableMarkets(fields.value);
        }
    };

    const onSetRemoveIsEdit = () => {
        setIsEdit(false);
    };

    const onSetIsEdit = () => {
        setIsEdit(true);
    };

    return (
        <>
            <StyledFieldContainer>
                <LabelContainer>
                    <Label>{`${base.toUpperCase()}-${quote.toUpperCase()}`}</Label>
                </LabelContainer>
                <div>
                    <StyledActions onClick={onSetIsEdit} style={{ cursor: 'pointer' }}>
                        ✎
                    </StyledActions>
                    <StyledActions onClick={onSwapDown} style={{ cursor: 'pointer' }}>
                        ▼
                    </StyledActions>
                    <StyledActions onClick={onSwapUp} style={{ cursor: 'pointer' }}>
                        ▲
                    </StyledActions>
                </div>
            </StyledFieldContainer>
            {isEdit && <PairConfigForm name={name} onSetRemoveIsEdit={onSetRemoveIsEdit} />}
        </>
    );
};
