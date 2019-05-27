import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import styled, { css, withTheme } from 'styled-components';

import { getAllCollectibles } from '../../../store/selectors';
import { Theme, themeBreakPoints } from '../../../themes/commons';
import { CollectibleFilterType, filterCollectibleByName } from '../../../util/filterable_collectibles';
import { CollectibleSortType } from '../../../util/sortable_collectibles';
import { Collectible, StoreState } from '../../../util/types';
import { CollectiblesCardList } from '../collectibles/collectibles_card_list';
import { CollectiblesListFilter } from '../collectibles/collectibles_list_filter';
import { CollectiblesListSort } from '../collectibles/collectibles_list_sort';
import { InputSearch } from '../common/input_search';

interface StateProps {
    allCollectibles: { [key: string]: Collectible };
}

interface OwnProps {
    isOpen: boolean;
    onClose: () => void;
    theme: Theme;
}

type Props = OwnProps & StateProps;

interface State {
    searchText: string;
    sortType: CollectibleSortType;
    filterType: CollectibleFilterType;
}

const modalWidth = '80vw';
const modalContentHeight = '70vh';

const ModalContent = styled.div`
    height: ${modalContentHeight};
    overflow: auto;
`;

const ModalTitleWrapper = styled.div`
    padding: 0;
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

const FiltersMenu = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto 22px;
    max-width: ${themeBreakPoints.xxl};
    position: relative;
    padding: 30px 0 20px 0;
    width: 100%;
    z-index: 1;

    @media (min-width: ${themeBreakPoints.md}) {
        align-items: start;
        flex-direction: row;
    }
`;

const CollectiblesFilterDropdown = css`
    margin-bottom: 25px;
    margin-right: auto;
    position: relative;
    font-size: 14px;

    @media (min-width: ${themeBreakPoints.md}) {
        margin-bottom: 0;
        margin-right: 25px;
    }

    &:last-child {
        margin-bottom: 0;

        @media (min-width: ${themeBreakPoints.md}) {
            margin-right: 0;
        }
    }
`;

const CollectiblesListCount = styled.div`
    flex-grow: 1;

    @media (min-width: ${themeBreakPoints.md}) {
        margin-right: 0;
        text-align: left;
        padding-right: ${props => props.theme.modalTheme.content.padding};
    }
`;
const CollectiblesListSortStyled = styled(CollectiblesListSort)`
    ${CollectiblesFilterDropdown}
    z-index: 5;
`;
const CollectiblesListFilterStyled = styled(CollectiblesListFilter)`
    ${CollectiblesFilterDropdown}
    z-index: 1;
`;

const initialState = {
    searchText: '',
    sortType: CollectibleSortType.NewestAdded,
    filterType: CollectibleFilterType.ShowAll,
};

class SearchModal extends React.Component<Props, State> {
    public state = { ...initialState };

    public render = () => {
        const { isOpen, theme, allCollectibles } = this.props;
        const { searchText, sortType, filterType } = this.state;

        const collectibles = Object.keys(allCollectibles).map(key => allCollectibles[key]);
        const searchResult = filterCollectibleByName(collectibles, searchText);

        return (
            <Modal
                isOpen={isOpen}
                style={theme.modalTheme}
                onRequestClose={this._closeModal}
                shouldCloseOnOverlayClick={true}
            >
                <ModalTitleWrapper>
                    <SearchStyled placeholder={'Search'} onChange={this._onChangeSearchText} autoFocus={true} />
                </ModalTitleWrapper>
                {searchText.length > 0 ? (
                    <ModalContent>
                        <FiltersMenu>
                            <CollectiblesListCount>Showing {searchResult.length} results</CollectiblesListCount>
                            <CollectiblesListSortStyled currentValue={sortType} onChange={this._onChangeSortType} />
                            <CollectiblesListFilterStyled
                                currentValue={filterType}
                                onChange={this._onChangeFilterType}
                            />
                        </FiltersMenu>
                        <CollectiblesCardList collectibles={searchResult} filterType={filterType} sortType={sortType} />
                    </ModalContent>
                ) : null}
            </Modal>
        );
    };

    private readonly _onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: event.target.value || '' });
    };

    private readonly _onChangeSortType = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ sortType: evt.target.value as CollectibleSortType });
    };

    private readonly _onChangeFilterType = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ filterType: evt.target.value as CollectibleFilterType });
    };

    private readonly _closeModal = () => {
        this.props.onClose();
        this.setState(initialState);
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        allCollectibles: getAllCollectibles(state),
    };
};

const SearchModalContainer = withTheme(connect(mapStateToProps)(SearchModal));

export { SearchModalContainer };
