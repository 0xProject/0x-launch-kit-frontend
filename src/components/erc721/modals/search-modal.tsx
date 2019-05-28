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

const ModalContent = styled.div`
    overflow: auto;

    @media (min-width: ${themeBreakPoints.md}) {
        height: 500px;
    }
`;

const SearchStyled = styled(InputSearch)`
    background-color: ${props => props.theme.componentsTheme.modalSearchFieldBackgroundColor};
    border-color: ${props => props.theme.componentsTheme.modalSearchFieldBackgroundColor};
    color: ${props => props.theme.componentsTheme.modalSearchFieldTextColor};
    font-size: 16px;
    font-weight: 600;
    outline: none;
    width: 100%;

    ::placeholder {
        color: ${props => props.theme.componentsTheme.modalSearchFieldPlaceholderColor};
        font-weight: 400;
        text-align: left;
    }
`;

const FiltersMenu = styled.div`
    border-top: 1px solid ${props => props.theme.componentsTheme.borderColor};
    display: flex;
    flex-direction: column;
    margin: 0 auto 40px;
    max-width: ${themeBreakPoints.xxl};
    padding: 30px 0 0 0;
    position: relative;
    width: 100%;
    z-index: 1;

    @media (min-width: ${themeBreakPoints.md}) {
        align-items: start;
        flex-direction: row;
    }
`;

const CollectiblesListCount = styled.p`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    flex-grow: 1;
    font-size: 16px;
    line-height: 1.2;
    margin: 0 0 25px;
    padding: 0;
    text-align: left;

    @media (min-width: ${themeBreakPoints.md}) {
        margin-bottom: 0;
    }
`;

const CollectiblesFilterDropdown = css`
    font-size: 14px;
    margin-bottom: 25px;
    margin-right: auto;
    position: relative;

    @media (max-width: ${themeBreakPoints.sm}) {
        > div:nth-child(2) {
            left: 0;
            right: auto;
        }
    }

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

const CollectiblesListSortStyled = styled(CollectiblesListSort)`
    ${CollectiblesFilterDropdown}
    z-index: 5;
`;
const CollectiblesListFilterStyled = styled(CollectiblesListFilter)`
    ${CollectiblesFilterDropdown}
    z-index: 1;
`;

const initialState = {
    filterType: CollectibleFilterType.ShowAll,
    searchText: '',
    sortType: CollectibleSortType.NewestAdded,
};

class SearchModal extends React.Component<Props, State> {
    public state = { ...initialState };

    public render = () => {
        const { isOpen, theme, allCollectibles } = this.props;
        const { searchText, sortType, filterType } = this.state;

        const collectibles = Object.keys(allCollectibles).map(key => allCollectibles[key]);
        const searchResult = filterCollectibleByName(collectibles, searchText);
        const shouldShowResults = searchText.length > 0;

        const modalTheme = {
            ...theme.modalTheme,
            content: {
                ...theme.modalTheme.content,
                alignSelf: 'flex-start',
                marginLeft: '15px',
                marginRight: '15px',
                marginTop: '80px',
                maxWidth: '100%',
                width: '1196px',
            },
        };

        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={this._closeModal}
                shouldCloseOnOverlayClick={true}
                style={modalTheme}
            >
                <SearchStyled placeholder={'Search'} onChange={this._onChangeSearchText} autoFocus={true} />
                {shouldShowResults ? (
                    <>
                        <FiltersMenu>
                            <CollectiblesListCount>Showing {searchResult.length} results</CollectiblesListCount>
                            <CollectiblesListSortStyled currentValue={sortType} onChange={this._onChangeSortType} />
                            <CollectiblesListFilterStyled
                                currentValue={filterType}
                                onChange={this._onChangeFilterType}
                            />
                        </FiltersMenu>
                        <ModalContent>
                            <CollectiblesCardList
                                collectibles={searchResult}
                                filterType={filterType}
                                sortType={sortType}
                                onClick={this._closeModal}
                            />
                        </ModalContent>
                    </>
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
