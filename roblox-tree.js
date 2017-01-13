const fs = require('fs');
const path = require('path');

function getFileContents(filePath) {
  return fs.readFileSync(filePath, { encoding: 'utf-8' });
}

function isDirectory(filePath) {
  return fs.statSync(filePath).isDirectory();
}

function getBaseNameParts(filePath) {
  const base = path.basename(filePath);
  const parts =  base.split('.');

  return {
    name: parts[0],
    className: parts[1],
    extension: parts[2]
  };
}

// Allows you to use short words for Roblox Script classes.
//
// This allows us to use short words to represent Roblox's Script classes. These
// words are commonly used in filenames to identify which file should be created
// as which class in-game.
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
  const parts = getBaseNameParts(filePath);

  return {
    name: parts.name,
    className: getScriptClassFromWord(parts.className),
    source: getFileContents(filePath)
  };
}

function handleFile(filePath) {
  if (path.extname(filePath) === '.lua') {
    return luaFileToRobloxObject(filePath);
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
    Object.assign(object, handleFile(item));
  }

  if (object) parentNode.push(object);

  return parentNode;
}

function dirToRobloxObjectTree(dir) {
  return addChildrenToObjectTree(dir)
}

module.exports = { dirToRobloxObjectTree }
