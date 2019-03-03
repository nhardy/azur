/* eslint-disable import/prefer-default-export */

import tmp from 'tmp';

/**
 * Returns a Promise which resolves with the path of a newly created tmp dir and a cleanup function
 */
export function dir() {
  return new Promise((resolve, reject) => {
    tmp.dir({ unsafeCleanup: true }, (err, path, cleanup) => {
      if (err) {
        cleanup();
        reject(err);
        return;
      }
      resolve({
        path,
        cleanup,
      });
    });
  });
}
