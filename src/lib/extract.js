import extractZip from 'extract-zip';

/**
 * Returns a Promise which resolves on the extraction of a zip
 * @param {string} fromPath
 * @param {string} toPath
 */
export default function extract(fromPath, toPath) {
  return new Promise((resolve, reject) => {
    extractZip(fromPath, { dir: toPath }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
