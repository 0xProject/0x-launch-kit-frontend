import { BigNumber } from '0x.js';
import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { getIsModalSellCollectibleOpen, getSelectedCollectible } from '../../../store/selectors';
import { startBuySellCollectibleSteps, toggleModalSellCollectible } from '../../../store/ui/actions';
import { Theme } from '../../../themes/commons';
import { Collectible, StoreState } from '../../../util/types';
import { CloseModalButton } from '../../common/icons/close_modal_button';

interface StateProps {
    currentCollectible: Collectible | null;
    shouldOpenModal: boolean;
}

interface DispatchProps {
    onSubmitCollectibleOrder: (
        collectible: Collectible,
        expirationDate: string,
        startingPrice: BigNumber,
        endingPrice?: BigNumber,
    ) => Promise<any>;
    toggleModalSellCollectible: () => any;
}

interface OwnProps {
    theme: Theme;
}

type Props = OwnProps & DispatchProps & StateProps;

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 310px;
`;

class CollectibleSellModalContainer extends React.Component<Props> {
    public render = () => {
        const { theme, shouldOpenModal } = this.props;
        return (
            <Modal isOpen={shouldOpenModal} style={theme.modalTheme}>
                <CloseModalButton onClick={this._closeModal} />
                <ModalContent>
                    <h1>This is a modal</h1>
                    <button onClick={this._openStepsModals}>Open steps modals</button>
                </ModalContent>
            </Modal>
        );
    };

    private readonly _closeModal = () => {
        this.props.toggleModalSellCollectible();
    };

    private readonly _openStepsModals = async () => {
        const { currentCollectible } = this.props;
        if (!currentCollectible) {
            return;
        }
        // TODO Get this info from the modal
        const expirationDate = '123';
        const startPrice = new BigNumber('100');
        const endingPrice = new BigNumber('500');
        this._closeModal();
        await this.props.onSubmitCollectibleOrder(currentCollectible, expirationDate, startPrice, endingPrice);
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        currentCollectible: getSelectedCollectible(state),
        shouldOpenModal: getIsModalSellCollectibleOpen(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        toggleModalSellCollectible: () => dispatch(toggleModalSellCollectible()),
        onSubmitCollectibleOrder: (
            collectible: Collectible,
            expirationDate: string,
            startingPrice: BigNumber,
            endingPrice?: BigNumber,
        ) => dispatch(startBuySellCollectibleSteps(collectible, expirationDate, startingPrice, endingPrice)),
    };
};

const CollectibleSellModal = withTheme(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(CollectibleSellModalContainer),
);

export { CollectibleSellModal };
