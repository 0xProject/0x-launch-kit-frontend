import { SignedOrder } from '@0x/connect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { cancelOrder } from '../../store/actions';
import { UIOrder } from '../../util/types';

interface OwnProps {
    order: UIOrder;
}

interface DispatchProps {
    onCancelOrder: (order: SignedOrder) => Promise<any>;
}

type Props = OwnProps & DispatchProps;

interface State {
    isLoading: boolean;
}

const Button = styled.button`
    background: none;
    border: none;
    color: #c4c4c4;
    display: inline-block;
    height: 1em;
    outline: 0;

    &:hover {
        cursor: pointer;
    }
`;

class CancelOrderButton extends React.Component<Props, State> {
    public state = {
        isLoading: false,
    };

    public render = () => {
        const { isLoading } = this.state;
        return (
            <Button type="button" disabled={isLoading} onClick={this._cancelOrder}>
                <FontAwesomeIcon icon="times" />
            </Button>
        );
    };

    private readonly _cancelOrder = async () => {
        this.setState({ isLoading: true });
        try {
            const { order, onCancelOrder } = this.props;
            await onCancelOrder(order.rawOrder);
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
