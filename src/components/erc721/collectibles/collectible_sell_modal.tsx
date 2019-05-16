import { BigNumber } from '0x.js';
import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { selectCollectible } from '../../../store/collectibles/actions';
import { getSelectedCollectible } from '../../../store/selectors';
import { startSellCollectibleSteps } from '../../../store/ui/actions';
import { Theme, themeDimensions } from '../../../themes/commons';
import { todayInSeconds, tomorrow } from '../../../util/time_utils';
import { Collectible, OrderSide, StoreState } from '../../../util/types';
import { BigNumberInput } from '../../common/big_number_input';
import { CloseModalButton } from '../../common/icons/close_modal_button';
import { OutsideUrlIcon } from '../../common/icons/outside_url_icon';

interface StateProps {
    currentCollectible: Collectible | null;
}

interface DispatchProps {
    onSubmitCollectibleOrder: (
        collectible: Collectible,
        startingPrice: BigNumber,
        side: OrderSide,
        expirationDate: BigNumber,
        endingPrice: BigNumber | null,
    ) => Promise<any>;
    updateSelectedCollectible: (collectible: Collectible | null) => any;
}

interface OwnProps {
    theme: Theme;
}

type Props = OwnProps & DispatchProps & StateProps;

interface State {
    endingPrice: BigNumber | null;
    expirationDate: BigNumber;
    shouldIncludeEndPrice: boolean;
    startPrice: BigNumber;
}

interface ImageProps {
    imageUrl: string;
    imageColor: string;
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

const CollectibleMainInfoWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const CollectibleImage = styled.div<ImageProps>`
    background-color: ${props => props.imageColor};
    background-image: url('${props => props.imageUrl}');
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.borderColor};
    flex-grow: 0;
    flex-shrink: 0;
    height: 120px;
    margin: 0 16px 0 0;
    width: 120px;
`;

const CollectibleMainInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 1;
    justify-content: space-between;
    padding: 4px 0;
`;

const CollectibleMainInfoTitle = styled.h3`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 8px;
`;

const CollectibleLink = styled.a`
    align-items: center;
    display: flex;
    margin: 0 0 15px;
    text-decoration: none;
`;

const CollectibleLinkText = styled.span`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0 6px 0 0;
`;

const CollectibleMainInfoSubtitle = styled.h4`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0 0 10px;
`;

const CollectibleMainInfoValue = styled.p`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
    margin: 0;
`;

class CollectibleSellModalContainer extends React.Component<Props> {
    public state: State = {
        endingPrice: null,
        expirationDate: tomorrow(),
        shouldIncludeEndPrice: false,
        startPrice: new BigNumber(0),
    };

    public render = () => {
        const { theme, currentCollectible } = this.props;
        const { startPrice, endingPrice, shouldIncludeEndPrice } = this.state;
        const dayInSeconds = 60 * 60 * 24;
        const today = todayInSeconds();
        const expirationDates = [today + dayInSeconds, today + dayInSeconds * 5, today + dayInSeconds * 7];
        const endPriceContent = shouldIncludeEndPrice ? (
            <>
                <h3>Enter ending price</h3>
                <BigNumberInput
                    decimals={18}
                    min={new BigNumber(0)}
                    onChange={this._updateEndingPrice}
                    value={endingPrice}
                    placeholder={'0.00'}
                />
            </>
        ) : null;

        return (
            <Modal isOpen={currentCollectible ? true : false} style={theme.modalTheme}>
                <ModalTitleWrapper>
                    <ModalTitle>Selling Item</ModalTitle>
                    <CloseModalButtonStyle onClick={this._closeModal} />
                </ModalTitleWrapper>
                <ModalContent>
                    <CollectibleMainInfoWrapper>
                        <CollectibleImage
                            imageUrl={currentCollectible ? currentCollectible.image : ''}
                            imageColor={currentCollectible ? currentCollectible.color : ''}
                        />
                        <CollectibleMainInfo>
                            <div>
                                <CollectibleMainInfoTitle>
                                    {currentCollectible ? currentCollectible.name : ''}
                                </CollectibleMainInfoTitle>
                                <CollectibleLink
                                    href={currentCollectible ? currentCollectible.assetUrl : ''}
                                    target="_blakn"
                                >
                                    <CollectibleLinkText>CryptoKitties</CollectibleLinkText>
                                    {OutsideUrlIcon()}
                                </CollectibleLink>
                            </div>
                            <div>
                                <CollectibleMainInfoSubtitle>Last Sale Price</CollectibleMainInfoSubtitle>
                                <CollectibleMainInfoValue>2.0624 ETH</CollectibleMainInfoValue>
                            </div>
                        </CollectibleMainInfo>
                    </CollectibleMainInfoWrapper>
                    <h3>Enter a starting price</h3>
                    <BigNumberInput
                        decimals={18}
                        min={new BigNumber(0)}
                        onChange={this._updateStartingPrice}
                        placeholder={'0.00'}
                        value={startPrice}
                    />
                    <h3>Include ending price</h3>
                    <input type="checkbox" onChange={this._updateIncludeEndPrice} />
                    {endPriceContent}
                    <select onChange={this._updateExpDate}>
                        <option value={expirationDates[0]}>1 day</option>
                        <option value={expirationDates[1]}>5 days</option>
                        <option value={expirationDates[2]}>7 days</option>
                    </select>
                    <button onClick={this._openStepsModals}>Sell</button>
                </ModalContent>
            </Modal>
        );
    };

    private readonly _updateIncludeEndPrice = (event: any) => {
        this.setState({ shouldIncludeEndPrice: event.target.checked });
    };

    private readonly _updateExpDate = (event: any) => {
        const expirationDate = new BigNumber(event.target.value);
        this.setState({ expirationDate });
    };

    private readonly _updateStartingPrice = (startPrice: BigNumber) => {
        this.setState({
            startPrice,
        });
    };

    private readonly _updateEndingPrice = (endingPrice: BigNumber) => {
        this.setState({ endingPrice });
    };

    private readonly _closeModal = () => {
        this.props.updateSelectedCollectible(null);
    };

    private readonly _openStepsModals = async () => {
        const { currentCollectible } = this.props;
        const { startPrice, endingPrice, expirationDate } = this.state;
        if (!currentCollectible) {
            return;
        }
        this._closeModal();
        await this.props.onSubmitCollectibleOrder(
            currentCollectible,
            startPrice,
            OrderSide.Sell,
            expirationDate,
            endingPrice,
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        currentCollectible: getSelectedCollectible(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onSubmitCollectibleOrder: (
            collectible: Collectible,
            startingPrice: BigNumber,
            side: OrderSide,
            expirationDate: BigNumber,
            endingPrice: BigNumber | null,
        ) => dispatch(startSellCollectibleSteps(collectible, startingPrice, side, expirationDate, endingPrice)),
        updateSelectedCollectible: (collectible: Collectible | null) => dispatch(selectCollectible(collectible)),
    };
};

const CollectibleSellModal = withTheme(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(CollectibleSellModalContainer),
);

export { CollectibleSellModal };
