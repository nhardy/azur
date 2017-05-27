import tmp from 'tmp';


// eslint-disable-next-line import/prefer-default-export
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
