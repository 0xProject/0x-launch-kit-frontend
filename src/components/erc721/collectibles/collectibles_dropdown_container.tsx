import React from 'react';
import styled from 'styled-components';

import { CardBase } from '../../common/card_base';

interface Props {
    children: React.ReactNode;
}

const DropdownItemsContainer = styled(CardBase)`
    box-shadow: ${props => props.theme.componentsTheme.boxShadow};
    min-width: 240px;
`;

export class DropdownContainer extends React.Component<Props> {
    public render = () => {
        const { children } = this.props;

        return <DropdownItemsContainer>{children}</DropdownItemsContainer>;
    };
}
