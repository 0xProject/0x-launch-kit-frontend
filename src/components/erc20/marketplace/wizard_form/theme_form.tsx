import React, { useState } from 'react';
import { Field, useForm } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import styled from 'styled-components';

import { setERC20Theme, setThemeName } from '../../../../store/actions';
import { getThemeName } from '../../../../store/selectors';
import { Theme, themeDimensions } from '../../../../themes/commons';
import { getThemeByName } from '../../../../themes/theme_meta_data_utils';
import { AccordionCollapse } from '../../../common/accordion_collapse';
import { ColorButtonInput } from '../../../common/final_form/color_button_input';
import { IconType, Tooltip } from '../../../common/tooltip';

import { FieldContainer, Label, LabelContainer } from './styles';

const StyledComponentsTheme = styled.div`
    padding-left: 20px;
    padding-top: 10px;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

const TooltipStyled = styled(Tooltip)``;

export const ThemeForm = ({ isOpen = false, selector }: { name: string; isOpen?: boolean; selector?: string }) => {
    const dispatch = useDispatch();

    const options = [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }];
    const themeName = useSelector(getThemeName);
    const themeNameForm = themeName === 'DARK_THEME' ? 'theme_dark' : 'theme_light';
    const [selectedOption, setSelectedOption] = useState(themeName === 'DARK_THEME' ? options[0] : options[1]);
    const form = useForm();
    const onChange = (option: any) => {
        setSelectedOption(option);
        let theme;
        switch (option.value) {
            case 'dark':
                theme = getThemeByName('DARK_THEME');
                dispatch(setThemeName('DARK_THEME'));
                dispatch(setERC20Theme(theme));
                form.change('theme', theme);
                form.change('theme_dark', theme);
                break;
            case 'light':
                theme = getThemeByName('LIGHT_THEME');
                dispatch(setThemeName('LIGHT_THEME'));
                dispatch(setERC20Theme(theme));
                form.change('theme', theme);
                form.change('theme_light', theme);
                break;
            default:
                break;
        }
    };
    return (
        <>
            <AccordionCollapse title={'2-Theme'} setIsOpen={isOpen} className={selector}>
                <LabelContainer>
                    <Label>Themes:</Label>
                    <TooltipStyled
                        description="Choose a theme and costumize it. Currently support for Dark and Ligh Themes. The active selected theme will be the defaulted one."
                        iconType={IconType.Fill}
                    />
                </LabelContainer>
                <FieldContainer>
                    <Select value={selectedOption} onChange={onChange} options={options} />
                </FieldContainer>
                <StyledComponentsTheme>
                    <ComponentsTheme
                        name={`${themeNameForm}.componentsTheme`}
                        themeName={themeName === 'DARK_THEME' ? 'DARK' : 'LIGHT'}
                    />
                </StyledComponentsTheme>
                <OnChange name={`${themeNameForm}`}>
                    {(value: Theme, _previous: Theme) => {
                        dispatch(setERC20Theme(value));
                        // do something
                    }}
                </OnChange>
            </AccordionCollapse>
        </>
    );
};

const ComponentsTheme = ({ name, themeName }: { name: string; themeName: string }) => (
    <>
        <Label>Costumize Dex {themeName} Theme colors:</Label>
        <LabelContainer>
            <Label>Background</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.background`} component={ColorButtonInput} placeholder={`Title`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Card Background</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.cardBackgroundColor`} component={ColorButtonInput} placeholder={`Title`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Top Bar Background</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.topbarBackgroundColor`} component={ColorButtonInput} placeholder={`Title`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Inactive Tab Background</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.inactiveTabBackgroundColor`} component={ColorButtonInput} placeholder={`Title`} />
        </FieldContainer>
    </>
);
