const fs = require('fs');
const path = require('path');

const fileHelpers = require('./file-helpers');
const isDirectory = fileHelpers.isDirectory;
const getFileContents = fileHelpers.getFileContents;
const splitBasename = fileHelpers.splitBasename;

// Allows you to use short words for Roblox Script classes.
//
// This allows you to add '.module' or '.local' between a file's name and
// extension to define it as a certain Roblox Script.
//
// word : str
//  This can either be 'module' for ModuleScript, 'local' for LocalScript, or
//  nothing for a plain Script.
//
//  For consistency, you can add '.script.lua' to your filenames to clarify
//  which ones are regular Scripts.
function getScriptClassFromWord(word) {
  if (word === 'module') {
    return 'ModuleScript';
  } else if (word === 'local') {
    return 'LocalScript';
  } else {
    return 'Script';
  }
}

function luaFileToRobloxObject(filePath) {
  const parts = splitBasename(filePath);

  return {
    name: parts.name,
    className: getScriptClassFromWord(parts.classIdentifier),
    source: getFileContents(filePath)
  };
}

function addChildrenToObjectTree(item, parentNode=[]) {
  const children = fs.readdirSync(item);

  for (let child of children) {
    const fullPath = path.join(item, child);
    pathToRobloxObjectTree(fullPath, parentNode);
  };

  return parentNode;
}

function pathToRobloxObjectTree(item, parentNode=[]) {
  var object = {};

  if (isDirectory(item)) {
    Object.assign(object, { name: path.basename(item), children: [] });
    addChildrenToObjectTree(item, object.children);
  } else {
    if (path.extname(item) === '.lua') {
      Object.assign(object, luaFileToRobloxObject(item));
    };
  }

  if (object) parentNode.push(object);

  return parentNode;
}

function dirToRobloxObjectTree(dir) {
  return addChildrenToObjectTree(dir)
}

module.exports = { dirToRobloxObjectTree }
