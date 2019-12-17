import React, { useState } from 'react';
import { FieldArray, useFieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form-html5-validation';
import { OnChange } from 'react-final-form-listeners';
import styled from 'styled-components';

import { getERC20ContractWrapper } from '../../../../services/contract_wrappers';
import { getTokenByAddress } from '../../../../services/tokens';
import { themeDimensions } from '../../../../themes/commons';
import { getKnownTokens } from '../../../../util/known_tokens';
import { ButtonVariant, Token } from '../../../../util/types';
import { AccordionCollapse } from '../../../common/accordion_collapse';
import { Button } from '../../../common/button';
import { ColorButtonInput } from '../../../common/final_form/color_button_input';
import { StyledInput } from '../../../common/final_form/styled_input';
import { TextInput } from '../../../common/final_form/text_input';
import { TokenIcon } from '../../../common/icons/token_icon';
import { IconType, Tooltip } from '../../../common/tooltip';

import { FieldContainer, Label, LabelContainer } from './styles';

const ButtonsContainer = styled.div`
    align-items: flex-start;
    display: flex;
    margin: 10px;
`;
const ButtonContainer = styled.div`
    padding: 10px;
`;

const StyledToken = styled.div`
    padding-left: 20px;
    padding-top: 10px;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

const StyledFieldContainer = styled(FieldContainer)`
    display: flex;
    justify-content: space-between;
`;

const StyledActions = styled(Label)`
    padding: 5px;
`;

const TooltipStyled = styled(Tooltip)``;

export const TokensForm = ({
    unshift,
    isOpen = false,
    selector,
}: {
    unshift: any;
    isOpen?: boolean;
    selector?: string;
}) => {
    const onPush = (e: any) => {
        e.preventDefault();
        unshift('tokens', undefined);
    };
    const fieldArray = useFieldArray('tokens');
    const tokenFields = fieldArray.fields;
    return (
        <>
            <AccordionCollapse title={'3-Listed Tokens'} setIsOpen={isOpen} className={selector}>
                <ButtonsContainer>
                    <ButtonContainer>
                        <Button onClick={onPush} variant={ButtonVariant.Buy} disabled={tokenFields.value.length > 10}>
                            Add
                        </Button>
                    </ButtonContainer>
                    <TooltipStyled
                        description="Add Tokens to be listed using contract address. Logo images are fetched from Coingecko. Max 10 with free basic plan"
                        iconType={IconType.Fill}
                    />
                </ButtonsContainer>
                <FieldArray name="tokens">
                    {({ fields }) =>
                        fields.map((name, index) => (
                            <StyledToken key={name}>
                                <TokenForm name={name} index={index} />
                            </StyledToken>
                        ))
                    }
                </FieldArray>
            </AccordionCollapse>
        </>
    );
};

const TokenForm = ({ name, index }: { name: string; index: number }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const fieldArray = useFieldArray('tokens');
    //  const form = useForm();
    const { fields } = fieldArray;
    const pairsArray = useFieldArray('pairs');
    const pairsFieldArray = pairsArray.fields;
    const marketFilterArray = useFieldArray('marketFilters');
    const marketFilters = marketFilterArray.fields.value;

    const onChangeListener = (
        <OnChange name={`${name}.mainnetAddress`}>
            {async (value: string, _previous: string) => {
                const re = new RegExp('^0x[a-fA-F0-9]{40}');
                if (re.test(value)) {
                    setIsLoadingData(true);
                    try {
                        const contract = await getERC20ContractWrapper(value.toLowerCase(), {});
                        const tokenName = await contract.name.callAsync();
                        const symbol = (await contract.symbol.callAsync()).toLowerCase();
                        const decimals = await contract.decimals.callAsync();
                        if (tokenName) {
                            try {
                                const tokenData = await getTokenByAddress(value.toLowerCase());
                                const thumbImage = tokenData.image.thumb;
                                fields.update(index, {
                                    mainnetAddress: value.toLowerCase(),
                                    name: tokenName,
                                    symbol,
                                    decimals,
                                    website: tokenData.links.homepage[0],
                                    c_id: tokenData.id,
                                    icon: thumbImage.substring(0, thumbImage.indexOf('?')),
                                });
                            } catch (e) {
                                fields.update(index, {
                                    mainnetAddress: value.toLowerCase(),
                                    name: tokenName,
                                    symbol,
                                    decimals,
                                });
                            }
                        }
                        marketFilters.forEach(m => {
                            const quoteSymbol = m.value;
                            pairsFieldArray.unshift({
                                base: symbol.toLowerCase(),
                                quote: quoteSymbol,
                                config: {
                                    basePrecision: 2,
                                    pricePrecision: 8,
                                    minAmount: 1,
                                },
                            });
                        });
                    } finally {
                        setIsLoadingData(false);
                    }
                }
                // do something
            }}
        </OnChange>
    );

    if (isEdit) {
        const onSetRemoveIsEdit = () => {
            setIsEdit(false);
        };
        const value = fields.value[index];
        return (
            <>
                <StyledActions onClick={onSetRemoveIsEdit} style={{ cursor: 'pointer' }}>
                    ➖
                </StyledActions>
                <LabelContainer>
                    <Label>Contract Address</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field
                        name={`${name}.mainnetAddress`}
                        component={TextInput}
                        pattern={'^0x[a-fA-F0-9]{40}'}
                        patternMismatch={'Not a valid etheureum address'}
                        placeholder={`Address`}
                        disabled={true}
                        required={true}
                    />
                </FieldContainer>
                <LabelContainer>
                    <Label>Symbol</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.symbol`} component={TextInput} placeholder={`Symbol`} disabled={true} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Name</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.name`} component={TextInput} placeholder={`Name`} disabled={true} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Primary Color</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.primaryColor`} component={ColorButtonInput} placeholder={`Primary Color`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Icon</Label>
                </LabelContainer>
                <FieldContainer>
                    <TokenIcon symbol={value.symbol} icon={value.icon || ''} primaryColor={value.primaryColor} />
                    <Field name={`${name}.icon`} type={'hidden'} component={StyledInput} placeholder={`Icon Url`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Decimals</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field
                        name={`${name}.decimals`}
                        type={'number'}
                        min={0}
                        component={StyledInput}
                        placeholder={`Decimals`}
                        disabled={true}
                    />
                </FieldContainer>
                <LabelContainer>
                    <Label>Display Decimals</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field
                        name={`${name}.displayDecimals`}
                        type={'number'}
                        min={0}
                        component={StyledInput}
                        placeholder={`Display Decimals`}
                    />
                </FieldContainer>
                <LabelContainer>
                    <Label>Website</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.website`} type={'url'} component={StyledInput} placeholder={`Website`} />
                </FieldContainer>
                <FieldContainer>
                    <Field name={`${name}.c_id`} type={'hidden'} component={StyledInput} placeholder={`Coingecko id`} />
                </FieldContainer>
            </>
        );
    } else {
        const removeField = () => {
            const tokenValue: Token = fields.value[index];
            // remove pairs and then remove token from list
            for (let i = pairsFieldArray.value.length - 1; i >= 0; i--) {
                const pairValue = pairsFieldArray.value[i];
                if (tokenValue) {
                    if (pairValue.base.toLowerCase() === tokenValue.symbol.toLowerCase()) {
                        pairsFieldArray.remove(i);
                    }
                    if (pairValue.quote.toLowerCase() === tokenValue.symbol.toLowerCase()) {
                        pairsFieldArray.remove(i);
                    }
                }
            }
            fields.remove(index);
        };
        const onSetIsEdit = () => {
            setIsEdit(true);
        };
        const onSwapUp = () => {
            const newIndex = index - 1;
            if (newIndex >= 0) {
                fields.move(index, newIndex);
                const knownTokens = getKnownTokens();
                knownTokens.updateTokens(fields.value);
            }
        };
        const onSwapDown = () => {
            const total = fields.value.length;
            const newIndex = index + 1;
            if (newIndex < total) {
                fields.move(index, newIndex);
                const knownTokens = getKnownTokens();
                knownTokens.updateTokens(fields.value);
            }
        };
        const value = fields.value[index];
        let isTokenQuote = false;
        if (value && value.symbol) {
            isTokenQuote = isQuote(value.symbol, marketFilters);
        }
        const nameField = () => (
            <StyledFieldContainer>
                <LabelContainer>
                    <Label>{value.name}</Label>
                </LabelContainer>
                <div>
                    {!isTokenQuote && (
                        <StyledActions onClick={removeField} style={{ cursor: 'pointer' }}>
                            ❌
                        </StyledActions>
                    )}
                    {!isTokenQuote && (
                        <StyledActions onClick={onSetIsEdit} style={{ cursor: 'pointer' }}>
                            ✎
                        </StyledActions>
                    )}
                    <StyledActions onClick={onSwapDown} style={{ cursor: 'pointer' }}>
                        ▼
                    </StyledActions>
                    <StyledActions onClick={onSwapUp} style={{ cursor: 'pointer' }}>
                        ▲
                    </StyledActions>
                </div>
            </StyledFieldContainer>
        );
        const contractAddressField = () => (
            <>
                <LabelContainer>
                    <Label>Contract Address {isLoadingData ? '(Loading Data... )' : ''} </Label>
                    <StyledActions onClick={removeField} style={{ cursor: 'pointer' }}>
                        ❌
                    </StyledActions>
                </LabelContainer>
                <FieldContainer>
                    <Field
                        name={`${name}.mainnetAddress`}
                        component={TextInput}
                        pattern={'^0x[a-fA-F0-9]{40}'}
                        patternMismatch={'Not a valid etheureum address'}
                        placeholder={`Contract Address`}
                        required={true}
                    />
                    {isLoadingData ? <Label>{'Loading Data... '}</Label> : ''}
                </FieldContainer>
                {onChangeListener}
            </>
        );
        return value && value.name ? nameField() : contractAddressField();
    }
};

const isQuote = (tokenSymbol: string, marketFilters: Array<{ text: string; value: string }>) => {
    try {
        return marketFilters.map(m => m.value.toLowerCase()).includes(tokenSymbol.toLowerCase());
    } catch {
        return false;
    }
};
