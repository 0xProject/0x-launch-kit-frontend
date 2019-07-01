import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { startWrapEtherSteps } from '../../store/actions';
import {
    getConvertBalanceState,
    getEthBalance,
    getEthInUsd,
    getWeb3State,
    getWethBalance,
} from '../../store/selectors';
import { Theme, themeDimensions } from '../../themes/commons';
import { getKnownTokens } from '../../util/known_tokens';
import { tokenAmountInUnits } from '../../util/tokens';
import { ConvertBalanceState, StoreState, Web3State } from '../../util/types';
import { Card } from '../common/card';
import { ArrowUpDownIcon } from '../common/icons/arrow_up_down_icon';
import { LoadingWrapper } from '../common/loading';
import { IconType, Tooltip } from '../common/tooltip';

import { WethModal } from './wallet_weth_modal';

interface StateProps {
    ethBalance: BigNumber;
    ethInUsd: BigNumber | null;
    web3State: Web3State;
    wethBalance: BigNumber;
    convertBalanceState: ConvertBalanceState;
}

interface DispatchProps {
    onStartWrapEtherSteps: (newBalance: BigNumber) => Promise<any>;
}

interface OwnProps {
    className?: string;
    inDropdown?: boolean;
    theme: Theme;
    onWethModalOpen?: () => any;
    onWethModalClose?: () => any;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
    isSubmitting: boolean;
    modalIsOpen: boolean;
    selectedWeth: string;
}

const Content = styled.div`
    margin: 0 -${themeDimensions.horizontalPadding};
    position: relative;
`;

const Row = styled.div`
    align-items: center;
    border-bottom: solid 1px ${props => props.theme.componentsTheme.tableBorderColor};
    display: flex;
    justify-content: space-between;
    padding: 15px ${themeDimensions.horizontalPadding};
    position: relative;

    &:first-child {
        padding-top: 5px;
    }

    &:last-child {
        border-bottom: none;
        padding-bottom: 5px;
    }
`;

const LabelWrapper = styled.span`
    align-items: center;
    display: flex;
    flex-shrink: 0;
    margin-right: 15px;
`;

const Label = styled.span`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    flex-shrink: 0;
    font-size: 16px;
    line-height: 1.2;
    margin-right: 15px;
`;

const Value = styled.div`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    flex-shrink: 0;
    font-feature-settings: 'tnum' 1;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    white-space: nowrap;
`;

const Button = styled.button`
    align-items: center;
    background-color: ${props => props.theme.componentsTheme.buttonConvertBackgroundColor};
    border-radius: 4px;
    border: 1px solid ${props => props.theme.componentsTheme.buttonConvertBorderColor};
    color: ${props => props.theme.componentsTheme.buttonConvertTextColor};
    cursor: pointer;
    display: flex;
    height: 40px;
    left: 50%;
    padding: 0 10px;
    position: absolute;
    transform: translate(-50%, -50%);
    transition: border 0.15s ease-out;
    z-index: 2;

    &:hover {
        border-color: #666;
    }

    &:active {
        opacity: 0.8;
    }

    &:focus {
        outline: none;
    }

    &:disabled {
        cursor: default;
        opacity: 0.5;
    }

    path {
        fill: ${props => props.theme.componentsTheme.buttonConvertTextColor};
    }
`;

const ButtonLabel = styled.span`
    color: ${props => props.theme.componentsTheme.buttonConvertTextColor};
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    margin-right: 10px;
    user-select: none;
`;

const Note = styled.p`
    color: #ababab;
    font-size: 16px;
    font-weight: normal;
    line-height: 24px;
    margin: -10px 0 30px;
    padding: 20px 40px 0;
    text-align: center;
`;

class WalletWethBalance extends React.PureComponent<Props, State> {
    public readonly state: State = {
        modalIsOpen: false,
        selectedWeth: '0',
        isSubmitting: false,
    };

    public render = () => {
        const {
            ethBalance,
            web3State,
            wethBalance,
            ethInUsd,
            theme,
            inDropdown,
            className,
            convertBalanceState,
        } = this.props;
        const { isSubmitting } = this.state;
        const totalEth = ethBalance.plus(wethBalance);
        const wethToken = getKnownTokens().getWethToken();
        const formattedEth = tokenAmountInUnits(ethBalance, wethToken.decimals, wethToken.displayDecimals);
        const formattedWeth = tokenAmountInUnits(wethBalance, wethToken.decimals, wethToken.displayDecimals);
        const formattedTotalEth = tokenAmountInUnits(totalEth, wethToken.decimals, wethToken.displayDecimals);

        let content: React.ReactNode;

        const isButtonConvertDisable = convertBalanceState !== ConvertBalanceState.Success;

        if (web3State === Web3State.Loading) {
            content = <LoadingWrapper />;
        } else if (ethBalance && wethBalance) {
            content = (
                <>
                    <Row>
                        <Label>ETH</Label>
                        <Value>{formattedEth}</Value>
                    </Row>
                    <Button disabled={isButtonConvertDisable} onClick={this.openModal}>
                        <ButtonLabel>Convert</ButtonLabel>
                        <ArrowUpDownIcon />
                    </Button>
                    <Row>
                        <LabelWrapper>
                            <Label>wETH</Label>{' '}
                            <Tooltip
                                description="ETH cannot be traded with other tokens directly.<br />You need to convert it to WETH first.<br />WETH can be converted back to ETH at any time."
                                iconType={IconType.Fill}
                            />
                        </LabelWrapper>
                        <Value>{formattedWeth}</Value>
                    </Row>
                    <Row>
                        <Label>Total Value</Label>
                        <Value>{formattedTotalEth} ETH</Value>
                    </Row>
                    <WethModal
                        ethInUsd={ethInUsd}
                        isOpen={this.state.modalIsOpen}
                        isSubmitting={isSubmitting}
                        onRequestClose={this.closeModal}
                        onSubmit={this.handleSubmit}
                        style={theme.modalTheme}
                        totalEth={totalEth}
                        wethBalance={wethBalance}
                    />
                </>
            );
        }

        return (
            <>
                <Card title={inDropdown ? '' : 'ETH / wETH Balances'} className={className}>
                    <Content>{content}</Content>
                </Card>
                {inDropdown ? null : (
                    <Note>
                        wETH is used for trades on 0x
                        <br />1 wETH = 1 ETH
                    </Note>
                )}
            </>
        );
    };

    public handleSubmit = async (newWeth: BigNumber) => {
        this.setState({
            isSubmitting: true,
        });

        try {
            await this.props.onStartWrapEtherSteps(newWeth);
        } finally {
            this.setState({
                isSubmitting: false,
            });
            this.closeModal();
        }
    };

    public openModal = (e: any) => {
        e.stopPropagation(); // avoids dropdown closing when used inside one
        const { onWethModalOpen } = this.props;
        this.setState({
            modalIsOpen: true,
        });
        if (onWethModalOpen) {
            onWethModalOpen();
        }
    };

    public closeModal = () => {
        const { onWethModalClose } = this.props;
        this.setState({
            modalIsOpen: false,
        });
        if (onWethModalClose) {
            onWethModalClose();
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethBalance: getEthBalance(state),
        wethBalance: getWethBalance(state),
        web3State: getWeb3State(state),
        ethInUsd: getEthInUsd(state),
        convertBalanceState: getConvertBalanceState(state),
    };
};

const mapDispatchToProps = {
    onStartWrapEtherSteps: startWrapEtherSteps,
};

const WalletWethBalanceContainer = withTheme(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WalletWethBalance),
);

export { WalletWethBalance, WalletWethBalanceContainer };
