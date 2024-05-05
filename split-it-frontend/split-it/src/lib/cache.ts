/* eslint-disable @typescript-eslint/no-explicit-any */
import { getGroup } from '@/services/Service';

function logAndCache<P extends any[], R>(fn: (...args: P) => R) {
  const cached: { [key: string]: R } = {};

  return (...args: P) => {
    const key = JSON.stringify(args);
    if (cached[key]) {
      // console.log(`Calling cached ${fn.name}…`);
      return cached[key];
    } else {
      const result = fn(...args);
      cached[key] = result;
      // console.log(`Not cached: ${fn.name}…`);
      return result;
    }
  };
}

const cached = {
  getGroup: logAndCache(getGroup),
};



export default cached;
