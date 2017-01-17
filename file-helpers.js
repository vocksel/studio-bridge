// Contains helper functions related to the filesystem.

const fs = require('fs');
const path = require('path');

function isDirectory(filePath) {
  return fs.statSync(filePath).isDirectory();
}

function getFileContents(filePath) {
  return fs.readFileSync(filePath, {
    // UTF-8 encoding so that we get a string instead of bytes.
    encoding: 'utf-8'
  });
}

// Splits the filename into named parts.
//
// We don't have access to the Roblox Studio Properties panel, so we have to add
// on ClassName identifiers to the filenames.
//
// Our files will typically look like 'Filename.class.lua', where 'class' can be
// 'module', 'local' or 'script'. These are used as ClassName identifiers so
// that we can later turn them into Roblox's supported ClassNames.
//
// Example:
//
//  splitBasename('Helpers.module.lua')
//  { name: 'Helpers', classIdentifier: 'module', ext: '.lua' }
function splitBasename(filePath) {
  const parsed = path.parse(filePath);
  const parts = parsed.name.split('.');

  return {
    name: parts[0],
    classIdentifier: parts[1],
    ext: parsed.ext
  };
}

module.exports = {
  isDirectory,
  getFileContents,
  splitBasename
};
