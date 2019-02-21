import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { InfoIcon } from './icons/info_icon';
import { InfoIconFull } from './icons/info_icon_full';

interface Props extends HTMLAttributes<HTMLDivElement> {
    type?: string;
}

const TooltipWrapper = styled.div`
    cursor: pointer;
`;

export const Tooltip: React.FC<Props> = props => {
    const { type = 'line' } = props;

    return <TooltipWrapper>{type === 'full' ? <InfoIconFull /> : <InfoIcon />}</TooltipWrapper>;
};
