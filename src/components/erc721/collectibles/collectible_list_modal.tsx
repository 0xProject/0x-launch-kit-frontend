import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { selectCollectible } from '../../../store/collectibles/actions';
import { getIsCollectibleListModalOpen, getUserCollectibles } from '../../../store/selectors';
import { toggleCollectibleListModal } from '../../../store/ui/actions';
import { Theme } from '../../../themes/commons';
import { Collectible, StoreState } from '../../../util/types';
import { CloseModalButton } from '../../common/icons/close_modal_button';
import { Search } from '../common/inputSearch';

import { CollectibleOnListContainer } from './collectible_details_list';

interface StateProps {
    userCollectibles: { [key: string]: Collectible };
    isCollectibleModalOpen: boolean;
}

interface DispatchProps {
    updateSelectedCollectible: (collectible: Collectible | null) => any;
    toggleCollectibleListModal: () => any;
}

interface OwnProps {
    theme: Theme;
}

type Props = OwnProps & DispatchProps & StateProps;

interface State {
    currentCollectible: Collectible | null;
}

const ModalContent = styled.div`
    width: 350px;
`;

const ModalTitleWrapper = styled.div`
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.componentsTheme.borderColor};
    display: flex;
    justify-content: space-between;
    margin: -3px -16px 15px;
    padding: 0 16px 13px;
`;

const ModalTitle = styled.h2`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    padding: 0 15px 0 0;
`;

const CloseModalButtonStyle = styled(CloseModalButton)`
    margin: 0;
`;

const initialState = {
    currentCollectible: null,
};

class CollectibleListModalContainer extends React.Component<Props> {
    public state: State = {
        ...initialState,
    };

    public render = () => {
        const { theme, userCollectibles, isCollectibleModalOpen } = this.props;
        const collectibles = Object.keys(userCollectibles).map(key => userCollectibles[key]);

        let content = null;
        const collectible = userCollectibles[0];
        if (collectible) {
            content = collectibles.map((item, index) => {
                return <CollectibleOnListContainer collectible={item} onClick={this._closeModal} key={index} />;
            });
        }

        return (
            <Modal isOpen={isCollectibleModalOpen} style={theme.modalTheme}>
                <ModalTitleWrapper>
                    <ModalTitle>Selling Item</ModalTitle>
                    <CloseModalButtonStyle onClick={this._closeModal} />
                </ModalTitleWrapper>
                <ModalContent>
                    <Search placeHolder={'Search Wallet'} />
                    {content}
                </ModalContent>
            </Modal>
        );
    };

    private readonly _closeModal = () => {
        this.props.toggleCollectibleListModal();
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        userCollectibles: getUserCollectibles(state),
        isCollectibleModalOpen: getIsCollectibleListModalOpen(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        updateSelectedCollectible: (collectible: Collectible | null) => dispatch(selectCollectible(collectible)),
        toggleCollectibleListModal: () => dispatch(toggleCollectibleListModal()),
    };
};

const CollectibleListModal = withTheme(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(CollectibleListModalContainer),
);

export { CollectibleListModal };
