import React from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { openFiatOnRampChooseModal, openFiatOnRampModal, setFiatType } from '../../store/actions';
import { getOpenFiatOnRampChooseModalState } from '../../store/selectors';
import { Theme } from '../../themes/commons';
import { ButtonVariant } from '../../util/types';
import { Button } from '../common/button';
import { CloseModalButton } from '../common/icons/close_modal_button';

interface Props {
    theme: Theme;
}

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow: auto;
    width: 310px;
`;

const ModalTitle = styled.h1`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

const ButtonStyled = styled(Button)`
    width: 100%;
    margin: 10px;
`;

const LinkButton = styled.a`
    color: ${props => props.theme.componentsTheme.buttonTextColor};
    text-decoration: none;
`;

const FiatChooseModal: React.FC<Props> = props => {
    const { theme } = props;
    const dispatch = useDispatch();
    const isOpen = useSelector(getOpenFiatOnRampChooseModalState);
    const reset = () => {
        dispatch(openFiatOnRampChooseModal(false));
    };
    const chooseApplePay = () => {
        dispatch(setFiatType('APPLE_PAY'));
        dispatch(openFiatOnRampModal(true));
        reset();
    };
    const chooseCreditCard = () => {
        dispatch(setFiatType('CREDIT_CARD'));
        dispatch(openFiatOnRampModal(true));
        reset();
    };

    const content = (
        <>
            <ModalTitle>Buy With:</ModalTitle>
            {/*<ButtonStyled onClick={chooseApplePay} variant={ButtonVariant.Portis}>
                <LinkButton>{'Apple Pay'}</LinkButton>
            </ButtonStyled>*/}
            <ButtonStyled onClick={chooseCreditCard} variant={ButtonVariant.Fortmatic}>
                <LinkButton>{'Credit Card'}</LinkButton>
            </ButtonStyled>
        </>
    );

    return (
        <Modal isOpen={isOpen} style={theme.modalTheme}>
            <CloseModalButton onClick={reset} />
            <ModalContent>{content}</ModalContent>
        </Modal>
    );
};

export const FiatChooseModalContainer = withTheme(FiatChooseModal);
