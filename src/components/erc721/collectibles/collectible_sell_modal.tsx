import { BigNumber } from '0x.js';
import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import styled, { css, withTheme } from 'styled-components';

import { selectCollectible } from '../../../store/collectibles/actions';
import { getSelectedCollectible } from '../../../store/selectors';
import { startSellCollectibleSteps } from '../../../store/ui/actions';
import { Theme, themeDimensions } from '../../../themes/commons';
import { todayInSeconds, tomorrow } from '../../../util/time_utils';
import { ButtonVariant, Collectible, OrderSide, StoreState } from '../../../util/types';
import { BigNumberInput } from '../../common/big_number_input';
import { Button } from '../../common/button';
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
    startPrice: BigNumber | null;
    endingPrice: BigNumber | null;
    expirationDate: BigNumber;
    shouldIncludeEndPrice: boolean;
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
    margin: 0 0 20px;
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

const CollectibleLabel = styled.label`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    display: block;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0 0 10px;
`;

const FormRow = styled.div`
    margin: 0 0 20px;
`;

const FieldContainer = styled.div`
    height: ${themeDimensions.fieldHeight};
    margin-bottom: 25px;
    position: relative;
`;

const InputStyle = css`
    background-color: ${props => props.theme.componentsTheme.textInputBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.textInputBorderColor};
    color: ${props => props.theme.componentsTheme.textInputTextColor};
    font-feature-settings: 'tnum' 1;
    font-size: 16px;
    padding-left: 14px;
    width: 100%;
`;

const BigInputNumberStyled = styled<any>(BigNumberInput)`
    ${InputStyle}
    height: 100%;
    padding-right: 60px;
    position: absolute;
    z-index: 1;
`;

const SelectStyled = styled.select`
    ${InputStyle}
    height: ${themeDimensions.fieldHeight};
    padding-right: 14px;
`;

const TokenContainer = styled.div`
    align-items: center;
    display: flex;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 12;

    svg {
        margin: 0 10px 0 0;
    }
`;

const TokenText = styled.span`
    color: ${props => props.theme.componentsTheme.textInputTextColor};
    font-size: 14px;
    font-weight: normal;
    line-height: 21px;
    text-align: right;
`;

const ButtonStyled = styled(Button)`
    margin-top: 6px;
    width: 100%;
`;

const SwitchWrapper = styled.div<{ isActive?: boolean }>`
    background: ${props => (props.isActive ? '#00ae99' : '#ccc')};
    border-radius: 9px;
    cursor: pointer;
    height: 17px;
    overflow: hidden;
    position: relative;
    width: 31px;
`;

const Switch = styled.div`
    background: #fff;
    border-radius: 50%;
    height: 13px;
    left: 2px;
    position: absolute;
    top: 2px;
    transition: all 0.15s linear;
    width: 13px;
    z-index: 1;
`;

const SwitchInput = styled.input`
    border-radius: 50%;
    cursor: pointer;
    display: block;
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 5;

    &:checked + div {
        left: 16px;
    }
`;

const iconETH = () => {
    return (
        <svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.08799 0L5.9585 0.383135V11.3664L6.08799 11.4941L11.2675 8.47155L6.08799 0Z" fill="#38393A" />
            <path d="M6.08874 0L0.90918 8.47155L6.08874 11.4941V6.17274V0Z" fill="#38393A" />
            <path
                d="M6.08877 12.4737L6.00244 12.5163V16.4753L6.08877 16.6456L11.2683 9.45117L6.08877 12.4737Z"
                fill="#38393A"
            />
            <path d="M6.08874 16.6447V12.4728L0.90918 9.45026L6.08874 16.6447Z" fill="#38393A" />
            <path d="M6.08887 11.4932L11.2684 8.47069L6.08887 6.17188V11.4932Z" fill="#38393A" />
            <path d="M0.90918 8.47111L6.08874 11.4936V6.1723L0.90918 8.47111Z" fill="#38393A" />
        </svg>
    );
};

const initialState = {
    startPrice: null,
    endingPrice: null,
    expirationDate: tomorrow(),
    shouldIncludeEndPrice: false,
};

class CollectibleSellModalContainer extends React.Component<Props> {
    public state: State = {
        ...initialState,
    };

    public render = () => {
        const { theme, currentCollectible } = this.props;
        const { startPrice, endingPrice, shouldIncludeEndPrice } = this.state;
        const dayInSeconds = 60 * 60 * 24;
        const today = todayInSeconds();
        const expirationDates = [today + dayInSeconds, today + dayInSeconds * 5, today + dayInSeconds * 7];

        return (
            <Modal isOpen={currentCollectible !== null} style={theme.modalTheme} onRequestClose={this._closeModal}>
                <ModalTitleWrapper>
                    <ModalTitle>Selling Item</ModalTitle>
                    <CloseModalButtonStyle onClick={this._closeModal} />
                </ModalTitleWrapper>
                <ModalContent>
                    <CollectibleMainInfoWrapper>
                        <CollectibleImage
                            imageColor={currentCollectible ? currentCollectible.color : ''}
                            imageUrl={currentCollectible ? currentCollectible.image : ''}
                        />
                        <CollectibleMainInfo>
                            <div>
                                <CollectibleMainInfoTitle>
                                    {currentCollectible ? currentCollectible.name : ''}
                                </CollectibleMainInfoTitle>
                                <CollectibleLink
                                    href={currentCollectible ? currentCollectible.assetUrl : ''}
                                    target="_blank"
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
                    <FormRow>
                        <CollectibleLabel>Enter a starting price</CollectibleLabel>
                        <FieldContainer>
                            <BigInputNumberStyled
                                decimals={18}
                                min={new BigNumber(0)}
                                onChange={this._updateStartingPrice}
                                placeholder={'0.00'}
                                value={startPrice}
                            />
                            <TokenContainer>
                                {iconETH()}
                                <TokenText>ETH</TokenText>
                            </TokenContainer>
                        </FieldContainer>
                    </FormRow>
                    <FormRow>
                        <CollectibleLabel>Include ending price</CollectibleLabel>
                        <SwitchWrapper isActive={this.state.shouldIncludeEndPrice}>
                            <SwitchInput
                                checked={this.state.shouldIncludeEndPrice}
                                onChange={this._updateIncludeEndPrice}
                                type="checkbox"
                            />
                            <Switch />
                        </SwitchWrapper>
                    </FormRow>
                    {shouldIncludeEndPrice ? (
                        <FormRow>
                            <CollectibleLabel>Enter ending price</CollectibleLabel>
                            <FieldContainer>
                                <BigInputNumberStyled
                                    decimals={18}
                                    min={new BigNumber(0)}
                                    onChange={this._updateEndingPrice}
                                    value={endingPrice}
                                    placeholder={'0.00'}
                                />
                                <TokenContainer>
                                    {iconETH()}
                                    <TokenText>ETH</TokenText>
                                </TokenContainer>
                            </FieldContainer>
                        </FormRow>
                    ) : null}
                    <FormRow>
                        <CollectibleLabel>Set Expiration Date</CollectibleLabel>
                        <SelectStyled onChange={this._updateExpDate}>
                            <option value={expirationDates[0]}>1 day</option>
                            <option value={expirationDates[1]}>5 days</option>
                            <option value={expirationDates[2]}>7 days</option>
                        </SelectStyled>
                    </FormRow>
                    <ButtonStyled
                        onClick={this._openStepsModals}
                        disabled={this._isFormInvalid()}
                        variant={ButtonVariant.Error}
                    >
                        Sell
                    </ButtonStyled>
                </ModalContent>
            </Modal>
        );
    };

    private readonly _isFormInvalid = (): boolean => {
        const { shouldIncludeEndPrice, startPrice, endingPrice } = this.state;

        // Start price empty => invalid
        if (startPrice == null || startPrice.isZero()) {
            return true;
        }

        if (shouldIncludeEndPrice) {
            // End price empty => invalid
            if (endingPrice === null || endingPrice.isZero()) {
                return true;
            }
            // End price greater than start price => invalid
            if (endingPrice.isGreaterThan(startPrice) || endingPrice.isEqualTo(startPrice)) {
                return true;
            }
        }

        return false;
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
        this.setState({ ...initialState });
        this.props.updateSelectedCollectible(null);
    };

    private readonly _openStepsModals = async () => {
        const { currentCollectible } = this.props;
        const { startPrice, endingPrice, expirationDate } = this.state;
        if (!currentCollectible || !startPrice) {
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
