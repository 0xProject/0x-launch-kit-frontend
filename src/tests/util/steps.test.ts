import { makeGetProgress } from '../../util/steps';

const ONE_MINUTE = 60 * 1000;

describe('makeGetProgress', () => {
    it('returns 0 if the current time is equal to the starting time', async () => {
        // given
        const beginning = new Date(2019, 1, 1, 12, 0, 0).valueOf();
        const now = beginning;
        const getProgress = makeGetProgress(beginning, 1000);

        // when
        const progress = getProgress(now);

        // then
        expect(progress).toEqual(0);
    });

    it('returns 0 if the current time is less than the starting time', async () => {
        // given
        const beginning = new Date(2019, 1, 1, 12, 0, 0).valueOf();
        const now = new Date(2019, 1, 1, 11, 59, 0).valueOf();
        const getProgress = makeGetProgress(beginning, 1000);

        // when
        const progress = getProgress(now);

        // then
        expect(progress).toEqual(0);
    });

    it('returns 50 if half the estimated time was elapsed', async () => {
        // given
        const beginning = new Date(2019, 1, 1, 12, 0, 0).valueOf();
        const now = new Date(2019, 1, 1, 12, 1, 0).valueOf();
        const estimatedTxTimeMs = ONE_MINUTE * 2;
        const getProgress = makeGetProgress(beginning, estimatedTxTimeMs);

        // when
        const progress = getProgress(now);

        // then
        expect(progress).toEqual(50);
    });

    it('returns 95 if the elapsed time is equal to the estimated time', async () => {
        // given
        const beginning = new Date(2019, 1, 1, 12, 0, 0).valueOf();
        const now = new Date(2019, 1, 1, 12, 2, 0).valueOf();
        const estimatedTxTimeMs = ONE_MINUTE * 2;
        const getProgress = makeGetProgress(beginning, estimatedTxTimeMs);

        // when
        const progress = getProgress(now);

        // then
        expect(progress).toEqual(95);
    });

    it('returns 95 if the elapsed time is greater than the estimated time', async () => {
        // given
        const beginning = new Date(2019, 1, 1, 12, 0, 0).valueOf();
        const now = new Date(2019, 1, 1, 12, 3, 0).valueOf();
        const estimatedTxTimeMs = ONE_MINUTE * 2;
        const getProgress = makeGetProgress(beginning, estimatedTxTimeMs);

        // when
        const progress = getProgress(now);

        // then
        expect(progress).toEqual(95);
    });

    it('does not depend on the length of the estimated time', async () => {
        // given
        const beginning = new Date(2019, 1, 1, 12, 0, 0).valueOf();
        const now = new Date(2019, 1, 1, 12, 5, 0).valueOf();
        const estimatedTxTimeMs = ONE_MINUTE * 10;
        const getProgress = makeGetProgress(beginning, estimatedTxTimeMs);

        // when
        const progress = getProgress(now);

        // then
        expect(progress).toEqual(50);
    });
});
