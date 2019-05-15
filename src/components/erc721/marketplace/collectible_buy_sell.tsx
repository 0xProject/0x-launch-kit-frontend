import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { selectCollectible } from '../../../store/collectibles/actions';
import { getCollectibleById, getEthAccount } from '../../../store/selectors';
import { getEndDateStringFromTimeInSeconds } from '../../../util/time_utils';
import { Collectible, StoreState } from '../../../util/types';

import { TitleText } from './marketplace_common';
import { TradeButton } from './trade_button';

const BuySellWrapper = styled.div`
    width: 270px;
`;

interface ImageProps {
    imageUrl: string;
    imageColor: string;
}

const Image = styled.div<ImageProps>`
    left: calc(50% - 216px / 2);
    background-size: 100% 100%;
    background-image: url(${props => props.imageUrl});
    background-color: ${props => props.imageColor};
    border-radius: 4px;
    height: 221px;
`;

const CenteredText = styled(TitleText)`
    text-align: center;
`;

const TextWithIcon = styled(CenteredText)`
    :before {
        content: url(''); // TODO add icon url
    }
`;

interface OwnProps {
    collectibleId: string;
}

interface StateProps {
    ethAccount: string;
    collectible: Collectible | undefined;
}

interface DispatchProps {
    updateSelectedCollectible: (collectible: Collectible) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

const CollectibleBuySell = (props: Props) => {
    const { collectible, ethAccount } = props;
    if (!collectible) {
        return null;
    }
    const { color, image, order } = collectible;

    const price = order ? order.takerAssetAmount : null;

    const expDate =
        order && order.expirationTimeSeconds ? getEndDateStringFromTimeInSeconds(order.expirationTimeSeconds) : null;

    const onBuy = () => window.alert('buy');

    const onSell = () => {
        props.updateSelectedCollectible(collectible);
    };
    const onCancel = () => window.alert('cancel');

    return (
        <BuySellWrapper>
            <Image imageUrl={image} imageColor={color} />
            <TradeButton
                ethAccount={ethAccount}
                asset={collectible}
                onBuy={onBuy}
                onSell={onSell}
                onCancel={onCancel}
            />
            {expDate ? <TextWithIcon>{expDate}</TextWithIcon> : null}
            {price && <CenteredText>Last price: Ξ {price.toString()}</CenteredText>}
        </BuySellWrapper>
    );
};

const mapStateToProps = (state: StoreState, props: OwnProps): StateProps => {
    return {
        ethAccount: getEthAccount(state),
        collectible: getCollectibleById(state, props),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        updateSelectedCollectible: (collectible: Collectible) => dispatch(selectCollectible(collectible)),
    };
};

const CollectibleBuySellContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(CollectibleBuySell);

export { CollectibleBuySell, CollectibleBuySellContainer };
