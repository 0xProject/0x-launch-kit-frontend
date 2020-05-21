import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ETH_DECIMALS } from '../../../common/constants';
import { cancelOrderCollectible, selectCollectible } from '../../../store/collectibles/actions';
import { getCollectibleById, getEthAccount } from '../../../store/selectors';
import { startBuyCollectibleSteps } from '../../../store/ui/actions';
import { themeDimensions } from '../../../themes/commons';
import { getCollectiblePrice } from '../../../util/collectibles';
import { getEndDateStringFromTimeInSeconds } from '../../../util/time_utils';
import { tokenAmountInUnits } from '../../../util/tokens';
import { Collectible, StoreState } from '../../../util/types';

import { TradeButton } from './trade_button';

const buySellWrapperWidth = '270px';

interface ImageProps {
    imageUrl: string;
    imageColor: string;
}

const BuySellWrapper = styled.div`
    margin-bottom: ${themeDimensions.verticalSeparationSm};
    width: ${buySellWrapperWidth};
`;

const Image = styled.div<ImageProps>`
    background-color: ${props => props.imageColor};
    background-image: url('${props => props.imageUrl}');
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;
    border-radius: ${themeDimensions.borderRadius};
    height: ${buySellWrapperWidth};
    margin-bottom: ${themeDimensions.verticalSeparationSm};
    width: ${buySellWrapperWidth};
`;

const CollectibleText = styled.p<{ textAlign?: string }>`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.6;
    margin: 0;
    text-align: ${props => props.textAlign};

    svg {
        margin: 0 6px 0 0;
    }
`;

CollectibleText.defaultProps = {
    textAlign: 'left',
};

const CollectibleTradeButton = styled(TradeButton)`
    margin-bottom: 15px;
`;

const timeSVG = () => {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M13.8923 5.79744C13.8385 5.47436 13.5154 5.24103 13.1923 5.29487C12.8692 5.34872 12.6359 5.6718 12.6897 5.99487C12.7436 6.31795 12.7795 6.65897 12.7795 7C12.7795 10.1949 10.1949 12.7795 7 12.7795C3.80513 12.7795 1.22051 10.1949 1.22051 7C1.22051 3.80513 3.80513 1.22051 7 1.22051C7.82564 1.22051 8.65128 1.4 9.40513 1.74103L9.11795 2.15385C8.93846 2.38718 9.08205 2.72821 9.38718 2.7641L11.8103 3.10513C12.1154 3.14103 12.3487 2.8359 12.2051 2.54872L11.1282 0.341026C11.0026 0.0717948 10.6436 0.0538462 10.4641 0.28718L10.1231 0.753846C9.17179 0.251282 8.09487 0 7 0C5.13333 0 3.37436 0.735897 2.04615 2.04615C0.735897 3.37436 0 5.13333 0 7C0 8.86667 0.735897 10.6256 2.04615 11.9538C3.37436 13.2641 5.13333 14 7 14C8.86667 14 10.6256 13.2641 11.9538 11.9538C13.2641 10.6256 14 8.86667 14 7C14 6.58718 13.9641 6.19231 13.8923 5.79744Z"
                fill="#FF6534"
            />
            <path
                d="M7.01761 3.35547C6.67658 3.35547 6.40735 3.6247 6.40735 3.96572L6.3894 7.26829C6.3894 7.26829 6.3894 7.26829 6.3894 7.28624V7.30419V7.32214V7.34008V7.35803C6.3894 7.35803 6.3894 7.35803 6.3894 7.37598V7.39393C6.3894 7.39393 6.3894 7.39393 6.3894 7.41188V7.42983C6.3894 7.42983 6.3894 7.42983 6.3894 7.44778V7.46572C6.3894 7.46572 6.3894 7.46573 6.3894 7.48367V7.50162C6.3894 7.50162 6.3894 7.50162 6.3894 7.51957V7.53752C6.3894 7.53752 6.3894 7.53752 6.3894 7.55547V7.57342V7.59137C6.3894 7.59137 6.3894 7.59137 6.3894 7.60931V7.62726C6.3894 7.62726 6.3894 7.62726 6.3894 7.64521C6.3894 7.64521 6.3894 7.66316 6.40735 7.66316C6.40735 7.66316 6.40735 7.68111 6.4253 7.68111C6.4253 7.68111 6.4253 7.69906 6.44325 7.69906C6.44325 7.69906 6.44325 7.71701 6.4612 7.71701C6.4612 7.71701 6.4612 7.73496 6.47915 7.73496C6.47915 7.73496 6.47915 7.73496 6.4971 7.7529C6.4971 7.7529 6.4971 7.7529 6.51505 7.77085C6.51505 7.77085 6.51505 7.77085 6.53299 7.7888L9.45864 10.4991C9.58428 10.6068 9.72787 10.6606 9.87146 10.6606C10.033 10.6606 10.1945 10.5888 10.3202 10.4632C10.5535 10.2119 10.5356 9.83496 10.2843 9.60162L7.60992 6.99906L7.62787 3.96572C7.62787 3.64265 7.35864 3.35547 7.01761 3.35547Z"
                fill="#FF6534"
            />
        </svg>
    );
};

interface OwnProps {
    collectibleId: string;
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
        const {
            collectible,
            ethAccount,
            onCancelOrderCollectible,
            onStartBuyCollectibleSteps,
            ...restProps
        } = this.props;
        if (!collectible) {
            return null;
        }
        const { color, image, order } = collectible;
        const price = getCollectiblePrice(collectible);
        const expDate =
            order && order.expirationTimeSeconds
                ? getEndDateStringFromTimeInSeconds(order.expirationTimeSeconds)
                : null;

        return (
            <BuySellWrapper {...restProps}>
                <Image imageUrl={image} imageColor={color} />
                <CollectibleTradeButton
                    asset={collectible}
                    ethAccount={ethAccount}
                    onBuy={this._onBuy}
                    onCancel={this._onCancel}
                    onSell={this._onSell}
                    isDisabled={isLoading}
                />
                {expDate ? (
                    <CollectibleText>
                        {timeSVG()} Ends {expDate}
                    </CollectibleText>
                ) : null}
                {price && (
                    <CollectibleText textAlign="center">
                        Last price: Ξ {tokenAmountInUnits(price, ETH_DECIMALS)}
                    </CollectibleText>
                )}
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
            window.alert(`Could not cancel the specified order`);
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
            window.alert(`Could not sell the specified order`);
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
            window.alert(`Could not sell the specified order`);
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
