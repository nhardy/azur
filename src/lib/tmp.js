import tmp from 'tmp';


export function dir() { // eslint-disable-line import/prefer-default-export
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
