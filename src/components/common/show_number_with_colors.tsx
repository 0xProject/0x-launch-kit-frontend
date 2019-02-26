import { BigNumber } from '0x.js';
import React from 'react';
import styled from 'styled-components';

import { padRightSplitted } from '../../util/number_utils';

interface ShowNumberWithColorsProps {
    num: BigNumber;
    leftColor?: string;
    rightColor?: string;
}

class ShowNumberWithColors extends React.Component<ShowNumberWithColorsProps, {}> {
    public static defaultProps = {
        leftColor: '#000',
        rightColor: '#DEDEDE',
    };

    public render = () => {
        const { num, leftColor, rightColor } = this.props;
        const numSplitted = padRightSplitted(num);
        const SpanLeft = styled.span`
            color: ${leftColor};
        `;
        const SpanRight = styled.span`
            color: ${rightColor};
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
