import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { CustomTD, CustomTDLast, CustomTDTitle } from '../../common/table';

export type StickySpreadState = 'top' | 'bottom' | 'hidden';

interface State {
    stickySpreadState: StickySpreadState;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
    spreadValue?: string;
    stickySpreadWidth?: string;
    scrolled?: any;
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
    display: grid;
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
    };

    public render = () => {
        const { spreadValue, stickySpreadWidth = '' } = this.props;

        return this.state.stickySpreadState === 'hidden' ? null : (
            <GridRowSpreadContainer
                stickySpreadState={this.state.stickySpreadState}
                stickySpreadWidth={stickySpreadWidth}
            >
                <CustomTDTitle as="div" styles={customTDTitleStyles}>
                    Spread
                </CustomTDTitle>
                <CustomTD as="div" styles={customTDStyles}>
                    {}
                </CustomTD>
                <CustomTDLast as="div" styles={customTDLastStyles}>
                    {spreadValue}
                </CustomTDLast>
            </GridRowSpreadContainer>
        );
    };

    public updateStickSpreadState = (stickySpreadState: StickySpreadState) => {
        if (stickySpreadState !== this.state.stickySpreadState) {
            this.setState({ stickySpreadState });
        }
    };
}
