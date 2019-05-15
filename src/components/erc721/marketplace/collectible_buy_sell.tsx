import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { cancelOrderCollectible, selectCollectible } from '../../../store/collectibles/actions';
import { getCollectibleById, getEthAccount } from '../../../store/selectors';
import { startBuyCollectibleSteps } from '../../../store/ui/actions';
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
    assetId: string;
}

interface StateProps {
    ethAccount: string;
    collectible: Collectible | undefined;
}

interface DispatchProps {
    updateSelectedCollectible: (collectible: Collectible) => any;
    onStartBuyCollectibleSteps: (collectible: Collectible, ethAccount: string) => Promise<any>;
    onCancelOrderCollectible: (order: any) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

class CollectibleBuySell extends React.Component<Props> {
    public state = {
        isLoading: false,
    };

    public render = () => {
        const { isLoading } = this.state;
        const { collectible, ethAccount } = this.props;
        if (!collectible) {
            return null;
        }
        const { color, image, order } = collectible;

        const price = order ? order.takerAssetAmount : null;

        return (
            <BuySellWrapper>
                <Image imageUrl={image} imageColor={color} />
                <TradeButton
                    ethAccount={ethAccount}
                    asset={collectible}
                    onBuy={this._onBuy}
                    onSell={this._onSell}
                    onCancel={this._onCancel}
                    isDisabled={isLoading}
                />
                <TextWithIcon>Ends wednesday, February 27, 2019</TextWithIcon>
                {price && <CenteredText>Last price: Ξ {price.toString()}</CenteredText>}
            </BuySellWrapper>
        );
    };

    private readonly _onCancel = async () => {
        this.setState({ isLoading: true });

        try {
            const { collectible, onCancelOrderCollectible } = this.props;
            if (collectible && collectible.order) {
                await onCancelOrderCollectible(collectible.order);
            }
        } catch (err) {
            alert(`Could not cancel the specified order`);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    private readonly _onSell = async () => {
        this.setState({ isLoading: true });

        try {
            const { collectible, updateSelectedCollectible } = this.props;
            if (collectible) {
                updateSelectedCollectible(collectible);
            }
        } catch (err) {
            alert(`Could not sell the specified order`);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    private readonly _onBuy = async () => {
        this.setState({ isLoading: true });

        try {
            const { collectible, ethAccount, onStartBuyCollectibleSteps } = this.props;
            if (collectible) {
                // tslint:disable-next-line:no-floating-promises
                onStartBuyCollectibleSteps(collectible, ethAccount);
            }
        } catch (err) {
            alert(`Could not sell the specified order`);
        } finally {
            this.setState({ isLoading: false });
        }
    };
}

const mapStateToProps = (state: StoreState, props: OwnProps): StateProps => {
    return {
        ethAccount: getEthAccount(state),
        collectible: getCollectibleById(state, props),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        updateSelectedCollectible: (collectible: Collectible) => dispatch(selectCollectible(collectible)),
        onStartBuyCollectibleSteps: (collectible: Collectible, ethAccount: string) =>
            dispatch(startBuyCollectibleSteps(collectible, ethAccount)),
        onCancelOrderCollectible: (order: any) => dispatch(cancelOrderCollectible(order)),
    };
};

const CollectibleBuySellContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(CollectibleBuySell);

export { CollectibleBuySell, CollectibleBuySellContainer };
