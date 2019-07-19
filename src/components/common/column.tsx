import styled, { css } from 'styled-components';

import { themeBreakPoints, themeDimensions } from '../../themes/commons';

interface StyledColumnInterface {
    isWide?: boolean;
}

export const Column = styled.div<StyledColumnInterface>`
    max-width: 100%;
    overflow: scroll;

    ${({ isWide }) =>
        isWide
            ? css`
                  flex-grow: 0;
                  flex-shrink: 1;
                  min-width: 0;

                  @media (min-width: ${themeBreakPoints.xl}) {
                      flex-grow: 1;
                  }
              `
            : css`
                  display: flex;
                  flex-direction: column;
                  flex-shrink: 0;
                  width: 100%;

                  @media (min-width: ${themeBreakPoints.xl}) {
                      min-width: ${themeDimensions.sidebarWidth};
                      width: ${themeDimensions.sidebarWidth};
                  }
              `}
`;

export const ColumnsWrapper = styled.div`
    display: flex;
    width: 100%;

    @media (min-width: ${themeBreakPoints.xl}) {
        margin-left: -5px;
        margin-right: -5px;
        ${Column} {
            margin-left: 5px;
            margin-right: 5px;
        }
    }
`;
