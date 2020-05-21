import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { selectCollectible } from '../../../store/collectibles/actions';
import { getUserCollectiblesAvailableToSell } from '../../../store/selectors';
import { Theme } from '../../../themes/commons';
import { filterCollectibleByName } from '../../../util/filterable_collectibles';
import { Collectible, StoreState } from '../../../util/types';
import { EmptyContent } from '../../common/empty_content';
import { CloseModalButton } from '../../common/icons/close_modal_button';
import { InputSearch } from '../common/input_search';

import { CollectibleOnListContainer } from './collectible_details_list';

interface StateProps {
    userCollectibles: { [key: string]: Collectible };
}

interface DispatchProps {
    updateSelectedCollectible: (collectible: Collectible | null) => any;
}

interface OwnProps {
    theme: Theme;
    isOpen: boolean;
    onModalCloseRequest: () => any;
}

type Props = OwnProps & DispatchProps & StateProps;

interface State {
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

const SearchStyled = styled(InputSearch)`
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
    filterText: '',
};

class CollectibleListModalContainer extends React.PureComponent<Props, State> {
    public state = {
        ...initialState,
    };

    public render = () => {
        const { theme, isOpen, userCollectibles } = this.props;
        const collectibles = Object.keys(userCollectibles).map(key => userCollectibles[key]);
        const { filterText } = this.state;
        const filteredCollectibles = filterCollectibleByName(collectibles, filterText);
        return (
            <Modal isOpen={isOpen} style={theme.modalTheme} onRequestClose={this._closeModal}>
                <ModalTitleWrapper>
                    <ModalTitleTop>
                        <ModalTitle>Select an item to sell</ModalTitle>
                        <CloseModalButtonStyle onClick={this._closeModal} />
                    </ModalTitleTop>
                    <SearchStyled placeholder={'Search Wallet'} onChange={this._handleSearchInputChanged} />
                </ModalTitleWrapper>
                <ModalContent>
                    {filteredCollectibles.length > 0 ? (
                        filteredCollectibles.map((item, index) => (
                            <CollectibleOnListContainer
                                collectible={item}
                                isListItem={true}
                                key={index}
                                onClick={this._closeModal}
                            />
                        ))
                    ) : (
                        <EmptyContent text={'No results found'} />
                    )}
                </ModalContent>
            </Modal>
        );
    };

    private readonly _closeModal = () => {
        this.props.onModalCloseRequest();
        this.setState(initialState);
    };

    private readonly _handleSearchInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ filterText: event.target.value || '' });
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        userCollectibles: getUserCollectiblesAvailableToSell(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        updateSelectedCollectible: (collectible: Collectible | null) => dispatch(selectCollectible(collectible)),
    };
};

const CollectibleListModal = withTheme(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(CollectibleListModalContainer),
);

export { CollectibleListModal };
