import logdown from 'logdown';

import { LOGGER_ID } from '../common/constants';

export const getLogger = (title: string) => logdown(`${LOGGER_ID}::${title}`);
