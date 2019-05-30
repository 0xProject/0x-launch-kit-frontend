import { BigNumber } from '0x.js';
import React, { HTMLAttributes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ETH_DECIMALS } from '../../../common/constants';
import { getEthAccount, getEthBalance } from '../../../store/selectors';
import { themeDimensions } from '../../../themes/commons';
import { tokenAmountInUnits } from '../../../util/tokens';
import { StoreState } from '../../../util/types';
import { WalletWethBalanceContainer } from '../../account';
import { WalletConnectionStatusContainer } from '../../account/wallet_connection_status';
import { WalletConnectionStatusDot } from '../../account/wallet_connections_status_dot';
import { CardBase } from '../../common/card_base';
import { DropdownTextItem } from '../../common/dropdown_text_item';

const truncateAddress = (address: string) => {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
};

const connectToWallet = () => {
    alert('connect to another wallet');
};

const WalletConnectionWrapper = styled(CardBase)`
    border-radius: ${themeDimensions.borderRadius};
    box-shadow: ${props => props.theme.componentsTheme.boxShadow};
    overflow: hidden;
    width: 350px;
`;

const DropdownHeader = styled.div`
    align-items: center;
    background-color: ${props => props.theme.componentsTheme.cardBackgroundColor};
    border-top-left-radius: ${themeDimensions.borderRadius};
    border-top-right-radius: ${themeDimensions.borderRadius};
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    display: flex;
    justify-content: space-between;
    padding: 12px ${themeDimensions.horizontalPadding};
`;

const DropdownHeaderTitle = styled.div`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 16px;
    font-weight: 600;
    line-height: 1.3;
`;

const WalletAddress = styled.div`
    align-items: center;
    color: ${props => props.theme.componentsTheme.textColorCommon};
    display: flex;
    font-feature-settings: 'calt' 0;
    font-size: 16px;
    line-height: 1.3;
`;

const WalletConnectionStatusDotStyled = styled(WalletConnectionStatusDot)`
    margin-right: 8px;
`;

const WalletWethBalanceContainerStyled = styled(WalletWethBalanceContainer)`
    background: #fbfbfb;
    border-left: none;
    border-radius: 0;
    border-right: none;
    margin: 0;
`;

const DropdownTextItemStyled = styled(DropdownTextItem)`
    border: none;
`;

interface OwnProps extends HTMLAttributes<HTMLSpanElement> {}

interface StateProps {
    ethAccount: string;
    ethBalance: BigNumber;
}

type Props = StateProps & OwnProps;

interface State {
    isEthModalOpen: boolean;
}

class WalletConnectionContent extends React.Component<Props, State> {
    public readonly state: State = {
        isEthModalOpen: false,
    };
    public render = () => {
        const { ethAccount, ethBalance, ...restProps } = this.props;
        const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';
        const status: string = ethAccount ? 'active' : '';
        const ethBalanceText = ethBalance ? `${tokenAmountInUnits(ethBalance, ETH_DECIMALS)} ETH` : 'No connected';
        const content = (
            <WalletConnectionWrapper>
                <DropdownHeader>
                    <DropdownHeaderTitle>Balances</DropdownHeaderTitle>
                    <WalletAddress>
                        <WalletConnectionStatusDotStyled status={status} />
                        {ethAccountText}
                    </WalletAddress>
                </DropdownHeader>
                <WalletWethBalanceContainerStyled
                    inDropdown={true}
                    onWethModalOpen={this._ethModalOpen}
                    onWethModalClose={this._ethModalClose}
                />
                <CopyToClipboard text={ethAccount ? ethAccount : ''}>
                    <DropdownTextItemStyled text="Copy Address" />
                </CopyToClipboard>
                <DropdownTextItemStyled onClick={connectToWallet} text="Connect a different address" />
            </WalletConnectionWrapper>
        );

        return (
            <WalletConnectionStatusContainer
                walletConnectionContent={content}
                shouldCloseDropdownOnClickOutside={!this.state.isEthModalOpen}
                headerText={ethBalanceText}
                ethAccount={ethAccount}
                {...restProps}
            />
        );
    };

    private readonly _ethModalOpen = () => {
        this.setState({ isEthModalOpen: true });
    };

    private readonly _ethModalClose = () => {
        this.setState({ isEthModalOpen: false });
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
        ethBalance: getEthBalance(state),
    };
};

const WalletConnectionContentContainer = connect(
    mapStateToProps,
    {},
)(WalletConnectionContent);

export { WalletConnectionContent, WalletConnectionContentContainer };
