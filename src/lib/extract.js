import extractZip from 'extract-zip';


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
