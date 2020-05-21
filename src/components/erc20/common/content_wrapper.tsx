import styled from 'styled-components';

import { themeBreakPoints, themeDimensions } from '../../../themes/commons';

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: ${themeDimensions.mainPadding};

    @media (min-width: ${themeBreakPoints.xl}) {
        flex-direction: row;
        height: calc(100% - ${themeDimensions.footerHeight});
    }
`;
