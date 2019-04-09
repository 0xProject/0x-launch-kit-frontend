import React, { HTMLAttributes } from 'react';
import styled, { keyframes } from 'styled-components';

import { SpinnerSizes } from '../../util/theme';

import { ProcessingIcon } from './icons/processing_icon';

interface Props extends HTMLAttributes<HTMLDivElement> {
    alignAbsoluteCenter?: boolean;
    size: SpinnerSizes;
}

class Spinner extends React.Component<Props, {}> {
    public static defaultProps = {
        size: SpinnerSizes.Medium,
    };

    public render = () => {
        const { alignAbsoluteCenter, size } = this.props;
        return (
            <>
                <IconContainer alignAbsoluteCenter={alignAbsoluteCenter} size={size}>
                    <IconSpin>
                        <ProcessingIcon />
                    </IconSpin>
                </IconContainer>
            </>
        );
    };
}

const iconMarginBottom = '30px';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const IconContainer = styled.div<Props>`
    align-items: center;
    display: flex;
    height: 62px;
    justify-content: center;
    margin-bottom: ${iconMarginBottom};

    ${props =>
        props.alignAbsoluteCenter
            ? `
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100%;
            width: 100%;
            position: absolute;
            margin-bottom: 0;
        `
            : ''}
    svg {
        ${props =>
            props.size === SpinnerSizes.Small
                ? `
                height: 26px;
                width: 26px;
            `
                : `
                height: 52px;
                width: 52px;
            `}
    }
`;

const IconSpin = styled.div`
    animation: ${rotate} 1.5s linear infinite;
`;

export { Spinner };
