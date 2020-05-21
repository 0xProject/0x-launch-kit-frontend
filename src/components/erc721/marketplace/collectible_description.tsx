import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { COLLECTIBLE_NAME } from '../../../common/constants';
import { getCollectibleById, getEthAccount } from '../../../store/selectors';
import { truncateAddress } from '../../../util/number_utils';
import { Collectible, StoreState } from '../../../util/types';
import { Card } from '../../common/card';
import { OutsideUrlIcon } from '../../common/icons/outside_url_icon';

import { DutchAuctionPriceChartCard } from './dutch_auction_price_chart_card';

const CollectibleDescriptionWrapper = styled.div``;

const CollectibleDescriptionTitleWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0 0 20px;
`;

const CollectibleDescriptionTitle = styled.h3`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
    padding: 0 15px 0 0;
`;

const CollectibleDescriptionType = styled.a`
    align-items: center;
    display: flex;
    text-decoration: none;
`;

const CollectibleDescriptionTypeText = styled.span`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0 6px;
`;

const CollectibleDescriptionTypeImage = styled.span<{ backgroundImage: string }>`
    background-image: url('${props => props.backgroundImage}');
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    height: 16px;
    width: 16px;
`;

export const CollectibleDescriptionInnerTitle = styled.h4`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0 0 10px;
`;

const CollectibleDescriptionText = styled.p`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-feature-settings: 'calt' 0;
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 20px;

    &:last-child {
        margin: 0;
    }
`;

const CollectibleOwnerWrapper = styled.div`
    align-items: center;
    display: flex;
`;

const CollectibleOwnerImage = styled.span<{ backgroundImage: string }>`
    background-image: url('${props => props.backgroundImage}');
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    height: 20px;
    margin: 0 8px 0 0;
    width: 20px;
`;

const CollectibleOwnerText = styled.p`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-feature-settings: 'calt' 0;
    font-size: 14px;
    line-height: 1.2;
    margin: 0;
`;

const CollectibleCard = styled(Card)`
    > div {
        min-height: 0;
    }
`;

interface OwnProps {
    collectibleId: string;
}

interface StateProps {
    collectible: Collectible | undefined;
    ethAccount: string;
}

type Props = OwnProps & StateProps;

const CollectibleDescription = (props: Props) => {
    const { collectible, ethAccount, ...restProps } = props;

    if (!collectible) {
        return null;
    }

    const { currentOwner, description, name, assetUrl } = collectible;
    const typeImage = 'https://placeimg.com/32/32/any';
    const ownerImage = 'https://placeimg.com/50/50/any';

    const doesBelongToCurrentUser = currentOwner.toLowerCase() === ethAccount.toLowerCase();

    return (
        <CollectibleDescriptionWrapper {...restProps}>
            <CollectibleCard>
                <CollectibleDescriptionTitleWrapper>
                    <CollectibleDescriptionTitle>{name}</CollectibleDescriptionTitle>
                    <CollectibleDescriptionType href={assetUrl} target="_blank">
                        <CollectibleDescriptionTypeImage backgroundImage={typeImage} />
                        <CollectibleDescriptionTypeText>{COLLECTIBLE_NAME}</CollectibleDescriptionTypeText>
                        {OutsideUrlIcon()}
                    </CollectibleDescriptionType>
                </CollectibleDescriptionTitleWrapper>
                {description ? (
                    <>
                        <CollectibleDescriptionInnerTitle>Description</CollectibleDescriptionInnerTitle>
                        <CollectibleDescriptionText>{description}</CollectibleDescriptionText>
                    </>
                ) : null}
                {currentOwner ? (
                    <>
                        <CollectibleDescriptionInnerTitle>Current owner</CollectibleDescriptionInnerTitle>
                        <CollectibleOwnerWrapper>
                            <CollectibleOwnerImage backgroundImage={ownerImage} />
                            <CollectibleOwnerText>
                                {truncateAddress(currentOwner)}
                                {doesBelongToCurrentUser && ' (you)'}
                            </CollectibleOwnerText>
                        </CollectibleOwnerWrapper>
                    </>
                ) : null}
            </CollectibleCard>
            <DutchAuctionPriceChartCard collectible={collectible} />
        </CollectibleDescriptionWrapper>
    );
};

const mapStateToProps = (state: StoreState, props: OwnProps): StateProps => {
    return {
        collectible: getCollectibleById(state, props),
        ethAccount: getEthAccount(state),
    };
};

const CollectibleDescriptionContainer = connect(mapStateToProps)(CollectibleDescription);

export { CollectibleDescription, CollectibleDescriptionContainer };
