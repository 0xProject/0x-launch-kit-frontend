import React from 'react';
import styled from 'styled-components';

import { FiatOnRampModalContainer } from '../common/fiat_ramp';

const Content = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: #2e4d7b;
    width: 100%;
    height: 100%;
`;

const FiatRampPage = () => (
    <Content>
        <FiatOnRampModalContainer />
    </Content>
);

export { FiatRampPage as default };
