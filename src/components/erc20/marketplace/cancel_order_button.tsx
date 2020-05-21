import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { cancelOrder } from '../../../store/actions';
import { UIOrder } from '../../../util/types';
import { CloseIcon } from '../../common/icons/close_icon';

interface OwnProps {
    order: UIOrder;
}

interface DispatchProps {
    onCancelOrder: (order: UIOrder) => Promise<any>;
}

type Props = OwnProps & DispatchProps;

interface State {
    isLoading: boolean;
}

const Button = styled.button`
    align-items: center;
    background: none;
    border: none;
    display: flex;
    height: 17px;
    justify-content: flex-end;
    margin-left: auto;
    outline: 0;
    padding: 0;
    width: 25px;

    &:hover {
        cursor: pointer;
    }

    &[disabled] {
        cursor: default;
    }
`;

class CancelOrderButton extends React.Component<Props, State> {
    public state = {
        isLoading: false,
    };

    public render = () => {
        const { isLoading } = this.state;
        return (
            <Button title="Cancel order" type="button" disabled={isLoading} onClick={this._cancelOrder}>
                <CloseIcon />
            </Button>
        );
    };

    private readonly _cancelOrder = async () => {
        this.setState({ isLoading: true });
        try {
            const { order, onCancelOrder } = this.props;
            await onCancelOrder(order);
        } catch (err) {
            alert(`Could not cancel the specified order`);
        } finally {
            this.setState({ isLoading: false });
        }
    };
}

const mapDispatchToProps = {
    onCancelOrder: cancelOrder,
};

const CancelOrderButtonContainer = connect(
    null,
    mapDispatchToProps,
)(CancelOrderButton);

export { CancelOrderButton, CancelOrderButtonContainer };
