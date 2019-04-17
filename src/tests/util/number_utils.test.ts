import { BigNumber } from '0x.js';

import { padRightSplitted } from '../../util/number_utils';

describe('padRightSplitted', () => {
    it('should test some numbers', async () => {
        // Given
        const numbers = [
            {
                num: new BigNumber(0.1),
                decimals: 4,
                expectedDiff: '000',
                expectedNum: '0.1',
            },
            {
                num: new BigNumber(0.02),
                decimals: 4,
                expectedDiff: '00',
                expectedNum: '0.02',
            },
            {
                num: new BigNumber(4),
                decimals: 4,
                expectedDiff: '.0000',
                expectedNum: '4',
            },
            {
                num: new BigNumber(2478),
                decimals: 4,
                expectedDiff: '.0000',
                expectedNum: '2478',
            },
            {
                num: new BigNumber(10.1234),
                decimals: 4,
                expectedDiff: '',
                expectedNum: '10.1234',
            },
            {
                num: new BigNumber(0),
                decimals: 4,
                expectedDiff: '',
                expectedNum: '0.0000',
            },
            {
                num: new BigNumber(100.676767),
                decimals: 4,
                expectedDiff: '',
                expectedNum: '100.6768',
            },
            {
                num: new BigNumber(0),
                decimals: 4,
                expectedDiff: '',
                expectedNum: '0.0000',
            },
        ];

        for (const numberObject of numbers) {
            const { num, decimals } = numberObject;

            // When
            const result = padRightSplitted(num, decimals);

            // Then
            expect(result.num).toEqual(numberObject.expectedNum);
            expect(result.diff).toEqual(numberObject.expectedDiff);
        }
    });
});
