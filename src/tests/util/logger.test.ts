import { LOGGER_ID } from '../../common/constants';
import { getLogger } from '../../util/logger';

describe('Logger', () => {
    it('should check some prefix', async () => {
        // Given
        const logs = [
            {
                logger: getLogger('test'),
                expected: `${LOGGER_ID}::test`,
            },
            {
                logger: getLogger('test1'),
                expected: `${LOGGER_ID}::test1`,
            },
            {
                logger: getLogger('great'),
                expected: `${LOGGER_ID}::great`,
            },
            {
                logger: getLogger('max'),
                expected: `${LOGGER_ID}::max`,
            },
        ];

        for (const log of logs) {
            const { logger, expected } = log;

            // When
            // @ts-ignore
            const prefix = logger.opts.prefix;

            // Then
            expect(prefix).toEqual(expected);
        }
    });
});
