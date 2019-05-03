import { BigNumber } from '0x.js';
import React from 'react';
import styled from 'styled-components';

import { padRightSplitted } from '../../util/number_utils';

interface ShowNumberWithColorsProps {
    num: BigNumber;
}

class ShowNumberWithColors extends React.Component<ShowNumberWithColorsProps, {}> {

    public render = () => {
        const { num } = this.props;
        const numSplitted = padRightSplitted(num);
        const SpanLeft = styled.span`
            color: ${props => props.theme.componentsTheme.textColorCommon};
        `;
        const SpanRight = styled.span`
            color: ${props => props.theme.componentsTheme.numberDecimalsColor};
        `;
        return (
            <>
                <SpanLeft>{numSplitted.num}</SpanLeft>
                <SpanRight>{numSplitted.diff}</SpanRight>
            </>
        );
    };
}

export { ShowNumberWithColors };
