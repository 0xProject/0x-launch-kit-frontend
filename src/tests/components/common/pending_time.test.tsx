import { shallow } from 'enzyme';
import React from 'react';

import { PendingTime } from '../../../components/common/pending_time';

describe('PendingTime', () => {
    it('should show 00:05 when there are 5 seconds left', () => {
        // given
        const startTime = new Date(2019, 1, 1, 12, 29, 55);
        const estimatedTimeMs = 10000;
        const now = new Date(2019, 1, 1, 12, 30, 0);

        // when
        const wrapper = shallow(<PendingTime now={now} estimatedTimeMs={estimatedTimeMs} startTime={startTime} />);

        // then
        expect(wrapper.text()).toEqual('00:05 (Est. 10 seconds)');
    });

    it('should show 00:00 when the estimated time is already over', () => {
        // given
        const startTime = new Date(2019, 1, 1, 12, 29, 55);
        const estimatedTimeMs = 10000;
        const now = new Date(2019, 1, 1, 12, 31, 0);

        // when
        const wrapper = shallow(<PendingTime now={now} estimatedTimeMs={estimatedTimeMs} startTime={startTime} />);

        // then
        expect(wrapper.text()).toEqual('00:00 (Est. 10 seconds)');
    });
});
