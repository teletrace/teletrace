const nanoSecToMs = (nanoSec: number) => {
  return nanoSec / (10000 * 1000);
};

export const roundNanoToTwoDecimalMs = (nanoSec: number) => {
  const ms = nanoSecToMs(nanoSec);
  return Math.round(ms * 100) / 100;
};
