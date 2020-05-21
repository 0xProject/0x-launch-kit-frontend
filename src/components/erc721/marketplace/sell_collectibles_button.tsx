import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../../themes/commons';
import { ButtonVariant } from '../../../util/types';
import { Button } from '../../common/button';
import { CollectibleListModal } from '../collectibles/collectible_list_modal';

const ButtonStyled = styled(Button)`
    min-width: 195px;
    @media (min-width: ${themeBreakPoints.md}) {
        margin-left: auto;
    }
`;

export class SellCollectiblesButton extends React.Component {
    public state = {
        isModalOpen: false,
    };
    public render = () => {
        return (
            <>
                <CollectibleListModal isOpen={this.state.isModalOpen} onModalCloseRequest={this._handleModalToggle} />
                <ButtonStyled variant={ButtonVariant.Quaternary} onClick={this._handleModalToggle}>
                    Sell collectibles
                </ButtonStyled>
            </>
        );
    };

    private readonly _handleModalToggle = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
        });
    };
}
