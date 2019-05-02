import React from 'react';
import styled, { keyframes } from 'styled-components';

import { SpinnerSize } from '../../themes/commons';

import { ProcessingIcon } from './icons/processing_icon';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const IconSpin = styled.div<Props>`
    animation: ${rotate} 1.5s linear infinite;
    svg {
        ${props => `
          height: ${props.size ? props.size : SpinnerSize.Small};
          width: ${props.size ? props.size : SpinnerSize.Small};
      `}
    }
`;

interface Props {
    size?: SpinnerSize;
}

const Spinner = (props: Props) => (
    <IconSpin size={props.size}>
        <ProcessingIcon />
    </IconSpin>
);

export { Spinner };
