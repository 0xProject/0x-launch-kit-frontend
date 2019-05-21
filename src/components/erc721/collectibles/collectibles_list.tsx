import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getOtherUsersCollectibles, getUserCollectibles } from '../../../store/selectors';
import { toggleCollectibleListModal } from '../../../store/ui/actions';
import { themeBreakPoints } from '../../../themes/commons';
import { Collectible, StoreState } from '../../../util/types';
import { Button } from '../../common/button';

import { CollectiblesCardList } from './collectibles_card_list';

interface OwnProps {
    title: string;
}

interface StateProps {
    collectibles: { [key: string]: Collectible };
}

interface DispatchProps {
    toggleCollectibleListModal: () => any;
}
type Props = StateProps & DispatchProps & OwnProps;

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    flex-basis: 100%;
`;

const FiltersMenu = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0 auto 22px;
    max-width: ${themeBreakPoints.xxl};
    padding: 24px 0 0;
    width: 100%;
`;

const Title = styled.h1`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
`;

export const CollectiblesList = (props: Props) => {
    const collectibles = Object.keys(props.collectibles).map(key => props.collectibles[key]);
    return (
        <MainContainer>
            <FiltersMenu>
                <Title>{props.title}</Title>
                <Button onClick={props.toggleCollectibleListModal}>Sell collectibles</Button>
            </FiltersMenu>
            <CollectiblesCardList collectibles={collectibles} />
        </MainContainer>
    );
};

const allMapStateToProps = (state: StoreState): StateProps => {
    return {
        collectibles: getOtherUsersCollectibles(state),
    };
};

const allDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        toggleCollectibleListModal: () => dispatch(toggleCollectibleListModal()),
    };
};

export const AllCollectiblesListContainer = connect(
    allMapStateToProps,
    allDispatchToProps,
)(CollectiblesList);

const myMapStateToProps = (state: StoreState): StateProps => {
    return {
        collectibles: getUserCollectibles(state),
    };
};
export const MyCollectiblesListContainer = connect(
    myMapStateToProps,
    allDispatchToProps,
)(CollectiblesList);
