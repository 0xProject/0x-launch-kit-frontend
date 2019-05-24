// import { BigNumber } from '0x.js';
import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
// 
// import { selectCollectible } from '../../../store/collectibles/actions';
// import { getSelectedCollectible } from '../../../store/selectors';
// import { startSellCollectibleSteps } from '../../../store/ui/actions';
import { Theme } from '../../../themes/commons';
// import { todayInSeconds, tomorrow } from '../../../util/time_utils';
import { StoreState } from '../../../util/types';
// import { BigNumberInput } from '../../common/big_number_input';
// import { Button } from '../../common/button';
// import { CloseModalButton } from '../../common/icons/close_modal_button';
// import { OutsideUrlIcon } from '../../common/icons/outside_url_icon';

interface StateProps {
}

interface DispatchProps {
}

interface OwnProps {
    isOpen: boolean;
    onClose: () => void;
    theme: Theme;
}

type Props = OwnProps & DispatchProps & StateProps;

interface State {
}

class SearchModal extends React.Component<Props, State> {
    public state: State = {};

    public render = () => {
        const { isOpen, theme, onClose } = this.props;

        return (
            <Modal isOpen={isOpen} style={theme.modalTheme} onRequestClose={onClose} shouldCloseOnOverlayClick={true}>
                 Search
                 <button onClick={onClose}>Close</button>
            </Modal>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {};
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {};
};

const SearchModalContainer = withTheme(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(SearchModal),
);

export { SearchModalContainer };
