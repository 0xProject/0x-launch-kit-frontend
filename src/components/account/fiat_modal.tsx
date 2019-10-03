import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import { COINDIRECT_MERCHANT_ID } from '../../common/constants';
import { Theme } from '../../themes/commons';
import { CloseModalButton } from '../common/icons/close_modal_button';
import { IconType, Tooltip } from '../common/tooltip';

interface Props {
    theme: Theme;
    isOpen: boolean;
    ethAccount: string;
    reset: () => void;
}

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    max-height: 100%;
    min-height: 300px;
    overflow: auto;
    width: 400px;
    height: 610px;
`;

const Title = styled.h1`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    display: flex;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

const TooltipStyled = styled(Tooltip)`
    margin-left: 5px;
`;

export const FiatOnRampModal: React.FC<Props> = props => {
    const { reset, isOpen, theme, ethAccount } = props;
    const fiat_link = `https://business.coindirect.com/buy?merchantId=${COINDIRECT_MERCHANT_ID}&to=eth&address=${ethAccount}`;
    const description = `Disclaimer  <br />
    Veridex now enables easy purchase of Ether using credit & debit cards, through Coindirect! <br />
    Once payment is completed, you can check your payment status on Coindirect and deposit history in your ethereum wallet.<br />
    If you have any questions, please contact: support@coindirect.com`;

    const toolTip = <TooltipStyled description={description} iconType={IconType.Fill} />;
    return (
        <Modal isOpen={isOpen} style={theme.modalTheme}>
            <CloseModalButton onClick={reset} />
            <ModalContent>
                <Title>BUY ETH {toolTip}</Title>
                <iframe title="fiat_on_ramp" src={fiat_link} width="400" height="610" />
            </ModalContent>
        </Modal>
    );
};
