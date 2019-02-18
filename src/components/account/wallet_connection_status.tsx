import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { StoreState } from '../../util/types';
import { connect } from 'react-redux';
import { getEthAccount } from '../../store/selectors';

interface WrapperProps {
    status?: string;
}

const WalletConnectionStatusWrapper = styled.div`
    align-items: center;
    color: #333;
    display: flex;
    font-size: 16px;
    font-weight: 500;
`;

const WalletConnectionStatusDot = styled.div<WrapperProps>`
    background-color: ${props => props.status ? '#55BC65' : "#ccc"};
    border-radius: 50%;
    height: 10px;
    margin-right: 10px;
    width: 10px;
`;

interface OwnProps extends HTMLAttributes<HTMLSpanElement> {}

interface StateProps {
    ethAccount: string;
}

type Props = StateProps & OwnProps;

const truncateAddress = (address: string) => {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
};

class WalletConnectionStatus extends React.PureComponent<Props> {
    public render = () => {
        const { ethAccount, ...restProps } = this.props;
        const status: string = ethAccount ? 'active' : '';

        return (
            <WalletConnectionStatusWrapper {...restProps}>
                <WalletConnectionStatusDot status={status} />
                {ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected'}
            </WalletConnectionStatusWrapper>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const WalletConnectionStatusContainer = connect(mapStateToProps, {})(WalletConnectionStatus);

export { WalletConnectionStatus, WalletConnectionStatusContainer };
