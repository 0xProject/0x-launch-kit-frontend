export const sleep = (timeout: number) => new Promise<void>(resolve => setTimeout(resolve, timeout));
