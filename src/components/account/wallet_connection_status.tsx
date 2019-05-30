import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { Dropdown, DropdownPositions } from '../common/dropdown';
import { ChevronDownIcon } from '../common/icons/chevron_down_icon';

import { WalletConnectionStatusDot } from './wallet_connections_status_dot';

const WalletConnectionStatusWrapper = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
`;

const WalletConnectionStatusDotStyled = styled(WalletConnectionStatusDot)`
    margin-right: 10px;
`;

const WalletConnectionStatusText = styled.span`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-feature-settings: 'calt' 0;
    font-size: 16px;
    font-weight: 500;
    margin-right: 10px;
`;

interface OwnProps extends HTMLAttributes<HTMLSpanElement> {
    walletConnectionContent: React.ReactNode;
    shouldCloseDropdownOnClickOutside?: boolean;
    headerText: string;
    ethAccount: string;
}

type Props = OwnProps;

export class WalletConnectionStatusContainer extends React.PureComponent<Props> {
    public render = () => {
        const {
            headerText,
            walletConnectionContent,
            ethAccount,
            shouldCloseDropdownOnClickOutside,
            ...restProps
        } = this.props;
        const status: string = ethAccount ? 'active' : '';
        const header = (
            <WalletConnectionStatusWrapper>
                <WalletConnectionStatusDotStyled status={status} />
                <WalletConnectionStatusText>{headerText}</WalletConnectionStatusText>
                <ChevronDownIcon />
            </WalletConnectionStatusWrapper>
        );

        const body = <>{walletConnectionContent}</>;
        return (
            <Dropdown
                body={body}
                header={header}
                horizontalPosition={DropdownPositions.Right}
                shouldCloseDropdownOnClickOutside={shouldCloseDropdownOnClickOutside}
                {...restProps}
            />
        );
    };
}
