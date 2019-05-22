import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { CustomTD, CustomTDLast, CustomTDTitle } from '../../common/table';

export type StickySpreadState = 'top' | 'bottom' | 'hidden';

interface State {
    stickySpreadState: StickySpreadState;
    stickySpreadWidth: string;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
    spreadAbsValue?: string;
    spreadPercentValue?: string;
}

interface GridRowSpreadProps {
    stickySpreadState?: StickySpreadState;
    stickySpreadWidth?: string;
}

const GridRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`;

export const GridRowSpreadContainer = styled(GridRow)<GridRowSpreadProps>`
    ${props => (props.stickySpreadState === 'top' ? 'top: 29px;' : '')}
    ${props => (props.stickySpreadState === 'bottom' ? 'bottom: 0;' : '')}

    background-color: ${props => props.theme.componentsTheme.cardBackgroundColor};
    flex-grow: 0;
    flex-shrink: 0;
    position: ${props => (props.stickySpreadState === 'hidden' ? 'relative' : 'absolute')};
    width: ${props => props.stickySpreadWidth};
    z-index: 12;
`;

GridRowSpreadContainer.defaultProps = {
    stickySpreadWidth: 'auto',
    stickySpreadState: 'hidden',
};

export const customTDTitleStyles = { textAlign: 'right', borderBottom: true, borderTop: true };
export const customTDStyles = { textAlign: 'right', borderBottom: true, borderTop: true };
export const customTDLastStyles = {
    borderBottom: true,
    borderTop: true,
    tabular: true,
    textAlign: 'right',
};

export class GridRowSpread extends React.Component<Props> {
    public state: State = {
        stickySpreadState: 'hidden',
        stickySpreadWidth: 'auto',
    };

    public render = () => {
        const { spreadAbsValue, spreadPercentValue } = this.props;

        return this.state.stickySpreadState === 'hidden' ? null : (
            <GridRowSpreadContainer
                stickySpreadState={this.state.stickySpreadState}
                stickySpreadWidth={this.state.stickySpreadWidth}
            >
                <CustomTDTitle as="div" styles={customTDTitleStyles}>
                    Spread
                </CustomTDTitle>
                <CustomTD as="div" styles={customTDStyles}>
                    {spreadAbsValue}
                </CustomTD>
                <CustomTDLast as="div" styles={customTDLastStyles}>
                    {spreadPercentValue}%
                </CustomTDLast>
            </GridRowSpreadContainer>
        );
    };

    public updateStickSpreadState = (stickySpreadState: StickySpreadState, stickySpreadWidth: string) => {
        this.setState({ stickySpreadState });
        this.setState({ stickySpreadWidth });
    };
}
