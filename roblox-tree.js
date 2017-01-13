const fs = require('fs');
const path = require('path');

function getFileContents(filePath) {
  return fs.readFileSync(filePath, { encoding: 'utf-8' });
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
  const baseName = path.basename(filePath);
  const parts = baseName.split('.');

  return {
    className: getScriptClassFromWord(parts[1]),
    source: getFileContents(filePath)
  };
}

function handleFile(filePath) {
  if (path.extname(filePath) === '.lua') {
    return luaFileToRobloxObject(filePath);
  };
}

function addChildrenToObjectTree(item, parentNode) {
  const children = fs.readdirSync(item);

  for (let child of children) {
    const fullPath = path.join(item, child);
    pathToRobloxObjectTree(fullPath, parentNode);
  };
}

function pathToRobloxObjectTree(item, parentNode=[]) {
  const stats = fs.statSync(item);
  const filename = path.basename(item);
  const nameParts = filename.split('.');

  var object = { name: nameParts[0] };

  if (stats.isDirectory()) {
    Object.assign(object, { children: [] });
    addChildrenToObjectTree(item, object.children);
  } else {
    Object.assign(object, handleFile(item));
  }

  if (object) parentNode.push(object);

  return parentNode;
}

function dirToRobloxObjectTree(dir) {
  const hierarchy = []

  addChildrenToObjectTree(dir, hierarchy)

  return hierarchy
}

module.exports = { dirToRobloxObjectTree }
