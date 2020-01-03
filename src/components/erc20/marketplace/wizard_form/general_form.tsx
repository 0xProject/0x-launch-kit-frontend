import React from 'react';
import { Field } from 'react-final-form-html5-validation';
import { OnChange } from 'react-final-form-listeners';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { setGeneralConfig } from '../../../../store/actions';
import { themeDimensions } from '../../../../themes/commons';
import { GeneralConfig } from '../../../../util/types';
import { AccordionCollapse } from '../../../common/accordion_collapse';
import { StyledInput } from '../../../common/final_form/styled_input';
import { TextInput } from '../../../common/final_form/text_input';
import { IconType, Tooltip } from '../../../common/tooltip';

import { FieldContainer, Label, LabelContainer } from './styles';

const SocialForm = ({ name }: { name: string }) => (
    <>
        <LabelContainer>
            <Label>Telegram Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.telegram_url`} type={'url'} component={StyledInput} placeholder={`Telegram Url`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Twitter Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.twitter_url`} type={'url'} component={StyledInput} placeholder={`Twitter Url`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Facebook Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.facebook_url`} type={'url'} component={StyledInput} placeholder={`Facebook Url`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Discord Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.discord_url`} type={'url'} component={StyledInput} placeholder={`Discord Url`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Reddit Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.reddit_url`} type={'url'} component={StyledInput} placeholder={`Reddit Url`} />
        </FieldContainer>
        <LabelContainer>
            <Label>BitcoinTalk Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field
                name={`${name}.bitcointalk_url`}
                type={'url'}
                component={StyledInput}
                placeholder={`BitcoinTalk Url`}
            />
        </FieldContainer>
        <LabelContainer>
            <Label>State of Dapps Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field
                name={`${name}.statedapps_url`}
                type={'url'}
                component={StyledInput}
                placeholder={`State of Dapps Url`}
            />
        </FieldContainer>
    </>
);

const StyledSocialForm = styled(AccordionCollapse)`
    padding: 20px;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

const TooltipStyled = styled(Tooltip)``;

export const GeneralWizardForm = ({
    name,
    selector,
    isOpen = true,
}: {
    name: string;
    selector?: string;
    isOpen?: boolean;
}) => {
    const dispatch = useDispatch();

    return (
        <>
            <AccordionCollapse title={'1-General Config'} isOpen={isOpen} className={selector}>
                <LabelContainer>
                    <Label>Title</Label>
                    <TooltipStyled
                        description="Add a title to your DEX. This will be your DEX ID"
                        iconType={IconType.Fill}
                    />
                </LabelContainer>
                <FieldContainer>
                    <Field required={true} name={`${name}.title`} component={TextInput} placeholder={`Title`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Domain</Label>
                    <TooltipStyled
                        description="Domain where your DEX will be showed. Ex: https://dex.verisafe.io/"
                        iconType={IconType.Fill}
                    />
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.domain`} type={'url'} component={StyledInput} placeholder={`Domain`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Fee Recipient Address</Label>
                    <TooltipStyled
                        description="Address to collect fees from your DEX trades. This will be used in future!"
                        iconType={IconType.Fill}
                    />
                </LabelContainer>
                <FieldContainer>
                    <Field
                        name={`${name}.feeRecipient`}
                        component={TextInput}
                        placeholder={`Fee Recipient`}
                        pattern={'^0x[a-fA-F0-9]{40}'}
                        patternMismatch={'Not a valid etheureum address'}
                    />
                </FieldContainer>

                <LabelContainer>
                    <Label>Affiliate Percentage</Label>
                    <TooltipStyled
                        description="Percentage to collect on instant buys and market buys with ETH!"
                        iconType={IconType.Fill}
                    />
                </LabelContainer>
                <FieldContainer>
                    <Field
                        name={`${name}.feePercentage`}
                        type={'number'}
                        component={StyledInput}
                        placeholder={`Affiliate fee Percentage`}
                        min={0}
                        step={0.001}
                        max={0.05}
                    />
                </FieldContainer>
                <LabelContainer>
                    <Label>Icon URL (SVG Or PNG)</Label>
                    <TooltipStyled
                        description="DEX logo. It is recommended a public url with 28x28 px."
                        iconType={IconType.Fill}
                    />
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.icon`} type={'url'} component={StyledInput} placeholder={`Icon Url`} />
                </FieldContainer>
                <StyledSocialForm title={'Social Urls'}>
                    <SocialForm name={`${name}.social`} />{' '}
                </StyledSocialForm>
                <OnChange name={`${name}`}>
                    {(value: GeneralConfig, _previous: GeneralConfig) => {
                        dispatch(setGeneralConfig(value));
                        // do something
                    }}
                </OnChange>
            </AccordionCollapse>
        </>
    );
};
