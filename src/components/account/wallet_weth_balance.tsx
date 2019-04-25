import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { startWrapEtherSteps } from '../../store/actions';
import { getEthBalance, getEthInUsd, getWeb3State, getWethBalance } from '../../store/selectors';
import { themeColors, themeDimensions, themeModalStyle } from '../../util/theme';
import { tokenAmountInUnits } from '../../util/tokens';
import { StoreState, Web3State } from '../../util/types';
import { Card } from '../common/card';
import { ArrowUpDownIcon } from '../common/icons/arrow_up_down_icon';
import { CardLoading } from '../common/loading';
import { IconType, Tooltip } from '../common/tooltip';

import { WethModal } from './wallet_weth_modal';

interface StateProps {
    ethBalance: BigNumber;
    wethBalance: BigNumber;
    web3State: Web3State;
    ethInUsd: BigNumber | null;
}
interface DispatchProps {
    onStartWrapEtherSteps: (newBalance: BigNumber) => Promise<any>;
}

type Props = StateProps & DispatchProps;

interface State {
    modalIsOpen: boolean;
    selectedWeth: string;
    isSubmitting: boolean;
}

const Content = styled.div`
    margin: 0 -${themeDimensions.horizontalPadding};
    position: relative;
`;

const Row = styled.div`
    align-items: center;
    border-bottom: solid 1px ${themeColors.borderColor};
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
    color: #000;
    flex-shrink: 0;
    font-size: 16px;
    line-height: 1.2;
    margin-right: 15px;
`;

const Value = styled.div`
    color: #000;
    flex-shrink: 0;
    font-feature-settings: 'tnum' 1;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    white-space: nowrap;
`;

const Button = styled.button`
    align-items: center;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid ${themeColors.borderColor};
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
`;

const ButtonLabel = styled.span`
    color: #474747;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    margin-right: 10px;
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
        const { ethBalance, web3State, wethBalance, ethInUsd } = this.props;
        const { isSubmitting } = this.state;
        const totalEth = ethBalance.add(wethBalance);

        const formattedEth = tokenAmountInUnits(ethBalance, 18);
        const formattedWeth = tokenAmountInUnits(wethBalance, 18);
        const formattedTotalEth = tokenAmountInUnits(totalEth, 18);

        let content: React.ReactNode;

        if (web3State === Web3State.Loading) {
            content = <CardLoading />;
        } else if (ethBalance && wethBalance) {
            content = (
                <>
                    <Row>
                        <Label>ETH</Label>
                        <Value>{formattedEth}</Value>
                    </Row>
                    <Button onClick={this.openModal}>
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
                        isOpen={this.state.modalIsOpen}
                        isSubmitting={isSubmitting}
                        onRequestClose={this.closeModal}
                        onSubmit={this.handleSubmit}
                        style={themeModalStyle}
                        totalEth={totalEth}
                        wethBalance={wethBalance}
                        ethInUsd={ethInUsd}
                    />
                </>
            );
        }

        return (
            <>
                <Card title="ETH / wETH Balances">
                    <Content>{content}</Content>
                </Card>
                <Note>
                    wETH is used for trades on 0x
                    <br />1 wETH = 1 ETH
                </Note>
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

    public openModal = () => {
        this.setState({
            modalIsOpen: true,
        });
    };

    public closeModal = () => {
        this.setState({
            modalIsOpen: false,
        });
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethBalance: getEthBalance(state),
        wethBalance: getWethBalance(state),
        web3State: getWeb3State(state),
        ethInUsd: getEthInUsd(state),
    };
};
const mapDispatchToProps = {
    onStartWrapEtherSteps: startWrapEtherSteps,
};

const WalletWethBalanceContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WalletWethBalance);

export { WalletWethBalance, WalletWethBalanceContainer };
