import React from 'react';
import styled from 'styled-components';

import { ChevronDownIcon } from '../../common/icons/chevron_down_icon';

interface Props {
    text: string;
    extraIcon: any;
}

const DropdownButtonContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    user-select: none;
`;

const Text = styled.span`
    margin: 0 10px;
`;

export class DropdownButton extends React.Component<Props> {
    public render = () => {
        const { text, extraIcon } = this.props;

        return (
            <DropdownButtonContainer>
                {extraIcon}
                <Text>{text}</Text>
                <ChevronDownIcon />
            </DropdownButtonContainer>
        );
    };
}
