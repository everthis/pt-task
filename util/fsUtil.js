const fs = require("fs");
const path = require("path");
/**
 * Find all files inside a dir, recursively.
 * @function walk
 * @param  {string} dir Dir path string.
 * @return {string[]} Array with all file names that are inside the directory.
 */
const walk = dir =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...walk(name)] : [...files, name];
  }, []);

function isDir(path) {
  const stat = fs.statSync(path);
  if (stat && stat.isDirectory()) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  isDir,
  walk
};
