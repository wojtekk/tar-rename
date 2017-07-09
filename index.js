const tar = require('tar-stream');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function isGzipped(fileName) {
  return ['tgz', 'gz', 'gzip'].includes(fileName.split('.').pop());
}

module.exports = (opts) => {
  const {
    oldPrefix,
    newPrefix,
    sourceFile,
    outputFile,
    replace,
  } = opts;

  function escapeRegExp(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  const oldPrefixRe = new RegExp(`^${escapeRegExp(oldPrefix)}`)

  return new Promise((resolve, reject) => {
    function error(message, code) {
      const err = new Error(message);
      err.code = code;
      return reject(err);
    }

    fs.access(outputFile, (err) => {
      if (!err && !replace) {
        return error('File already exists', 5);
      }

      const extract = tar.extract();
      const pack = tar.pack();

      const package = fs.createReadStream(sourceFile);
      package.on('error', (err) => {
        return error(err, 6);
      });

      const distPackage = fs.createWriteStream(outputFile);
      distPackage.on('error', (err) => {
        return error(err, 7);
      });

      extract.on('entry', (header, stream, callback) => {
        header.name = header.name.replace(oldPrefixRe, newPrefix);
        stream.pipe(pack.entry(header, callback));
      });

      extract.on('finish', () => {
        pack.finalize();
      });

      extract.on('error', (err) => {
        return error(err, 8);
      });

      pack.on('error', (err) => {
        return error(err, 9);
      });

      pack.on('close', (err) => {
        return resolve();
      });

      package
        .pipe(isGzipped(sourceFile) ? zlib.createGunzip() : new stream.PassThrough())
        .pipe(extract);

      pack
        .pipe(isGzipped(outputFile) ? zlib.createGzip() : new stream.PassThrough())
        .pipe(distPackage);
    });
  });
}
