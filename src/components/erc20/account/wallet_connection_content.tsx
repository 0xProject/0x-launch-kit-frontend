import React, { HTMLAttributes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getEthAccount } from '../../../store/selectors';
import { truncateAddress } from '../../../util/number_utils';
import { StoreState } from '../../../util/types';
import { WalletConnectionStatusContainer } from '../../account/wallet_connection_status';
import { CardBase } from '../../common/card_base';
import { DropdownTextItem } from '../../common/dropdown_text_item';

interface OwnProps extends HTMLAttributes<HTMLSpanElement> {}

interface StateProps {
    ethAccount: string;
}

type Props = StateProps & OwnProps;

const connectToExplorer = () => {
   window.open('https://0xtracker.com/search?q=0x5265bde27f57e738be6c1f6ab3544e82cdc92a8f')
};



const DropdownItems = styled(CardBase)`
    box-shadow: ${props => props.theme.componentsTheme.boxShadow};
    min-width: 240px;
`;

class WalletConnectionContent extends React.PureComponent<Props> {
    public render = () => {
        const { ethAccount, ...restProps } = this.props;
        const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';
        
        const viewOnEtherscan = () => {
            window.open(`https://etherscan.io/address/${ethAccount}`);
        };
        
        const content = (
            <DropdownItems>
                <CopyToClipboard text={ethAccount ? ethAccount : ''}>
                    <DropdownTextItem text="Copy Address to Clipboard" />
                </CopyToClipboard>
                <DropdownTextItem onClick={viewOnEtherscan} text="View Address on Etherscan" />
                <DropdownTextItem onClick={connectToExplorer} text="Track DEX volume" />             
            </DropdownItems>
        );

        return (
            <WalletConnectionStatusContainer
                walletConnectionContent={content}
                headerText={ethAccountText}
                ethAccount={ethAccount}
                {...restProps}
            />
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const WalletConnectionContentContainer = connect(
    mapStateToProps,
    {},
)(WalletConnectionContent);

export { WalletConnectionContent, WalletConnectionContentContainer };
