import styled from 'styled-components';

import { themeBreakPoints } from '../../../themes/commons';

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: ${props => props.theme.dimensions.mainPadding};

    @media (min-width: ${themeBreakPoints.xl}) {
        flex-direction: row;
        height: calc(100% - ${props => props.theme.dimensions.footerHeight});
    }
`;
