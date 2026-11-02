export const sleep = (ms: number) =>
  // oxlint-disable-next-line no-promise-executor-return promise/avoid-new
  new Promise((resolve) => setTimeout(resolve, ms));
