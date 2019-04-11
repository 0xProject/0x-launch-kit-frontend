import { LOGGER_ID } from '../common/constants';

import { getLogDown } from './logdown';

describe('Logdown', () => {
    it('should check some prefix', async () => {
        // Given
        const logs = [
            {
                logger: getLogDown('test'),
                expected: `${LOGGER_ID}::test`,
            },
            {
                logger: getLogDown('test1'),
                expected: `${LOGGER_ID}::test1`,
            },
            {
                logger: getLogDown('great'),
                expected: `${LOGGER_ID}::great`,
            },
            {
                logger: getLogDown('max'),
                expected: `${LOGGER_ID}::max`,
            },
        ];

        for (const log of logs) {
            const { logger, expected } = log;

            // When
            const prefix = logger.opts.prefix;

            // Then
            expect(prefix).toEqual(expected);
        }
    });
});
