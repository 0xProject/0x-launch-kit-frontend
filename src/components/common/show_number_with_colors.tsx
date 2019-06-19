import { BigNumber } from '0x.js';
import React from 'react';
import styled from 'styled-components';

import { padRightSplitted } from '../../util/number_utils';

interface ShowNumberWithColorsProps {
    num: BigNumber;
    isHover?: boolean;
}

interface SpanRightProps {
    isHover?: boolean;
}

class ShowNumberWithColors extends React.Component<ShowNumberWithColorsProps, {}> {
    public render = () => {
        const { num, isHover } = this.props;
        const numSplitted = padRightSplitted(num);
        const SpanLeft = styled.span`
            color: ${props => props.theme.componentsTheme.textColorCommon};
        `;
        const SpanRight = styled.span<SpanRightProps>`
            color: ${props =>
                props.isHover
                    ? props.theme.componentsTheme.textColorCommon
                    : props.theme.componentsTheme.numberDecimalsColor};
        `;

        return (
            <>
                <SpanLeft>{numSplitted.num}</SpanLeft>
                <SpanRight isHover={isHover}>{numSplitted.diff}</SpanRight>
            </>
        );
    };
}

export { ShowNumberWithColors };
