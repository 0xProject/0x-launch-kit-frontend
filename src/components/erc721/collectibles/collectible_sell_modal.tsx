import { BigNumber } from '0x.js';
import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { selectCollectible } from '../../../store/collectibles/actions';
import { getSelectedCollectible } from '../../../store/selectors';
import { startBuySellCollectibleSteps } from '../../../store/ui/actions';
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
        expirationDate: string,
        startingPrice: BigNumber,
        side: OrderSide,
        endingPrice?: BigNumber,
    ) => Promise<any>;
    updateSelectedCollectible: (collectible: Collectible | null) => any;
}

interface OwnProps {
    theme: Theme;
}

type Props = OwnProps & DispatchProps & StateProps;

interface State {
    startPrice: BigNumber;
    endingPrice: BigNumber;
    includeEndPrice: boolean;
    expirationDate: string;
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
        endingPrice: new BigNumber(0),
        includeEndPrice: false,
        expirationDate: '',
    };

    public render = () => {
        const { theme, currentCollectible } = this.props;
        const { startPrice, endingPrice } = this.state;

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
                    <h3>Placeholder for toggle switch</h3>
                    <h3>Enter ending price</h3>
                    <BigNumberInput
                        decimals={18}
                        min={new BigNumber(0)}
                        onChange={this._updateEndingPrice}
                        value={endingPrice}
                        placeholder={'0.00'}
                    />
                    <h3>Placeholder for expiration date dropdown</h3>
                    <button onClick={this._openStepsModals}>Sell</button>
                </ModalContent>
            </Modal>
        );
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
        const { startPrice, endingPrice } = this.state;
        if (!currentCollectible) {
            return;
        }
        // TODO Get this info from the modal
        const expirationDate = '123';
        this._closeModal();
        await this.props.onSubmitCollectibleOrder(
            currentCollectible,
            expirationDate,
            startPrice,
            OrderSide.Sell,
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
            expirationDate: string,
            startingPrice: BigNumber,
            side: OrderSide,
            endingPrice?: BigNumber,
        ) => dispatch(startBuySellCollectibleSteps(collectible, expirationDate, startingPrice, side, endingPrice)),
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
