import { BigNumber } from '0x.js';
import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { TOMORROW } from '../../../common/constants';
import { selectCollectible } from '../../../store/collectibles/actions';
import { getSelectedCollectible } from '../../../store/selectors';
import { startSellCollectibleSteps } from '../../../store/ui/actions';
import { Theme } from '../../../themes/commons';
import { Collectible, OrderSide, StoreState } from '../../../util/types';
import { BigNumberInput } from '../../common/big_number_input';
import { CloseModalButton } from '../../common/icons/close_modal_button';

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
    startPrice: BigNumber;
    shouldIncludeEndPrice: boolean;
    endingPrice: BigNumber | null;
    expirationDate: BigNumber;
}

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 310px;
`;

class CollectibleSellModalContainer extends React.Component<Props> {
    public state: State = {
        startPrice: new BigNumber(0),
        endingPrice: null,
        shouldIncludeEndPrice: false,
        expirationDate: TOMORROW,
    };

    public render = () => {
        const { theme, currentCollectible } = this.props;
        const { startPrice, endingPrice, shouldIncludeEndPrice } = this.state;

        const dayInSeconds = 60 * 60 * 24;
        const expirationDates = [dayInSeconds, dayInSeconds * 5, dayInSeconds * 7];
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
                <CloseModalButton onClick={this._closeModal} />
                <ModalContent>
                    <h3>Enter a starting price</h3>
                    <BigNumberInput
                        decimals={18}
                        min={new BigNumber(0)}
                        onChange={this._updateStartingPrice}
                        value={startPrice}
                        placeholder={'0.00'}
                    />
                    <h3>Include ending price</h3>
                    <input type="checkbox" onChange={this._updateIncludeEndPrice} />
                    {endPriceContent}
                    <select defaultValue={'0'} onChange={this._updateExpDate}>
                        <option value="0" disabled={true}>
                            Please select a value
                        </option>
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
        this.setState({ includeEndPrice: event.target.checked });
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
