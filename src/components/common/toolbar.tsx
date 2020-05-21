import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { getWeb3State } from '../../store/selectors';
import { themeBreakPoints, themeDimensions } from '../../themes/commons';
import { errorsWallet } from '../../util/error_messages';
import { StoreState, Web3State } from '../../util/types';

import { ErrorCard, ErrorIcons, FontSize } from './error_card';

interface OwnProps {
    centerContent?: React.ReactNode;
    endContent: React.ReactNode;
    startContent: React.ReactNode;
}

interface StateProps {
    web3State: Web3State;
}

type Props = OwnProps & StateProps;

export const separatorTopbar = css`
    &:after {
        background-color: ${props => props.theme.componentsTheme.topbarSeparatorColor};
        content: '';
        height: 26px;
        margin-left: 17px;
        margin-right: 17px;
        width: 1px;
    }
    &:last-child:after {
        display: none;
    }
`;

const ToolbarWrapper = styled.div`
    align-items: center;
    background: ${props => props.theme.componentsTheme.topbarBackgroundColor};
    border-bottom: 1px solid ${props => props.theme.componentsTheme.topbarBorderColor};
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    height: ${themeDimensions.toolbarHeight};
    justify-content: space-between;
    padding: 0 ${themeDimensions.horizontalPadding};
    position: sticky;
    top: 0;
    z-index: 123;
`;

const ToolbarStart = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;

    @media (min-width: ${themeBreakPoints.xxl}) {
        min-width: 33.33%;
    }
`;

const ToolbarCenter = styled.div`
    align-items: center;
    display: flex;
    flex-grow: 1;
    justify-content: center;

    @media (min-width: ${themeBreakPoints.xxl}) {
        min-width: 33.33%;
    }
`;

const ToolbarEnd = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;

    @media (min-width: ${themeBreakPoints.xxl}) {
        min-width: 33.33%;
    }
`;

const Toolbar = (props: Props) => {
    const { startContent, endContent, centerContent } = props;

    const getContentFromWeb3State = (web3State: Web3State): React.ReactNode => {
        switch (web3State) {
            case Web3State.Locked:
                return <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmLocked} icon={ErrorIcons.Lock} />;
            case Web3State.NotInstalled:
                return (
                    <ErrorCard
                        fontSize={FontSize.Large}
                        text={errorsWallet.mmNotInstalled}
                        icon={ErrorIcons.Metamask}
                    />
                );
            case Web3State.Loading:
                return <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmLoading} icon={ErrorIcons.Metamask} />;
            case Web3State.Error:
                return (
                    <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmWrongNetwork} icon={ErrorIcons.Warning} />
                );
            case Web3State.Done:
                return (
                    <>
                        <ToolbarCenter>{centerContent}</ToolbarCenter>
                        <ToolbarEnd>{endContent}</ToolbarEnd>
                    </>
                );
            default:
                const _exhaustiveCheck: never = web3State;
                return _exhaustiveCheck;
        }
    };

    return (
        <ToolbarWrapper>
            <ToolbarStart>{startContent}</ToolbarStart>
            {getContentFromWeb3State(props.web3State)}
        </ToolbarWrapper>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
    };
};

const ToolbarContainer = connect(mapStateToProps)(Toolbar);

export { Toolbar, ToolbarContainer };
