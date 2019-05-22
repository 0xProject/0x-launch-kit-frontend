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
import { CardLoading } from '../../common/loading';
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
    filterText: string;
}

const modalWidth = '328px';
const modalContentHeight = '400px';

const ModalContent = styled.div`
    height: ${modalContentHeight};
    margin-left: -${props => props.theme.modalTheme.content.padding};
    margin-right: -${props => props.theme.modalTheme.content.padding};
    margin-top: -${props => props.theme.modalTheme.content.padding};
    overflow: auto;
    width: 360px;
`;

const ModalTitleWrapper = styled.div`
    border-bottom: 1px solid ${props => props.theme.componentsTheme.borderColor};
    margin: -3px -${props => props.theme.modalTheme.content.padding} 15px;
    padding: 0 ${props => props.theme.modalTheme.content.padding} 13px;
`;

const ModalTitleTop = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
`;

const ModalTitle = styled.h2`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    padding: 0 15px 0 0;
`;

const SearchStyled = styled(Search)`
    background-color: ${props => props.theme.componentsTheme.marketsSearchFieldBackgroundColor};
    border-color: ${props => props.theme.componentsTheme.marketsSearchFieldBackgroundColor};
    color: ${props => props.theme.componentsTheme.marketsSearchFieldTextColor};
    max-width: 100%;
    width: ${modalWidth};

    ::placeholder {
        text-align: left;
    }
`;

const CloseModalButtonStyle = styled(CloseModalButton)`
    margin: 0;
`;

const initialState = {
    currentCollectible: null,
    filterText: '',
};

// PureComponents only rerender if at least one state or prop value changes.
class CollectibleListModalContainer extends React.PureComponent<Props, State> {
    public state: State = {
        ...initialState,
    };

    // The render method on this PureComponent is called only if props or state.filterText has changed.
    public render = () => {
        const { theme, userCollectibles, isCollectibleModalOpen } = this.props;
        const { filterText } = this.state;
        const collectibles = Object.keys(userCollectibles).map(key => userCollectibles[key]);
        const filteredCollectibles = this._filterCollectiblesByName(collectibles, filterText);

        let content: any;
        if (filteredCollectibles) {
            content = filteredCollectibles.map((item, index) => {
                return (
                    <CollectibleOnListContainer
                        collectible={item}
                        isListItem={true}
                        key={index}
                        onClick={this._closeModal}
                    />
                );
            });
        }

        return (
            <Modal isOpen={isCollectibleModalOpen} style={theme.modalTheme} onRequestClose={this._closeModal}>
                <ModalTitleWrapper>
                    <ModalTitleTop>
                        <ModalTitle>Select an item to sell</ModalTitle>
                        <CloseModalButtonStyle onClick={this._closeModal} />
                    </ModalTitleTop>
                    <SearchStyled placeHolder={'Search Wallet'} onChange={this._handleSearchInputChanged} />
                </ModalTitleWrapper>
                <ModalContent>
                    {content && content.length > 0 ? content : <CardLoading minHeight={modalContentHeight} />}
                </ModalContent>
            </Modal>
        );
    };

    private readonly _closeModal = () => {
        this.props.toggleCollectibleListModal();
        this.setState(initialState);
    };

    private readonly _handleSearchInputChanged = (event: any) => {
        const newInputValue = event && event.target ? event.target.value : '';

        this.setState({
            filterText: newInputValue,
        });
    };

    private readonly _filterCollectiblesByName = (collectibles: Collectible[], name: string): Collectible[] => {
        return collectibles.filter((collectible: Collectible) => this._filterCollectibleByNameFn(collectible, name));
    };

    private readonly _filterCollectibleByNameFn = (collectible: Collectible, name: string): boolean => {
        const collectibleName = collectible.name.toLowerCase();
        const filterName = name.toLowerCase();
        return collectibleName.startsWith(filterName);
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
