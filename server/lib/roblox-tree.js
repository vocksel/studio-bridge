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

// Creates an Object representing a Roblox Script instance.
//
// The `className` property varies based on the class identifier (the part after
// the filename). You can see how this works below.
//
// Usage:
//
//   newScript('Server.lua');
//   { name: 'Server', className: 'Script', source: '...'}
//
//   newScript('Client.local.lua');
//   { name: 'Client', className: 'LocalScript', source: '...'}
//
//   newScript('Helper.module.lua');
//   { name: 'Helper', className: 'ModuleScript', source: '...'}
function newScript(filePath) {
  const parts = splitBasename(filePath);

  return {
    name: parts.name,
    className: getScriptClassFromWord(parts.classIdentifier),
    source: getFileContents(filePath)
  };
}

// Creates an Object representing a Roblox Folder instance.
function newFolder(filePath) {
  return {
    name: path.basename(filePath),
    className: 'Folder',

    // Recursively get children in this folder and all descending folders.
    children: constructHierarchy(filePath)
  };
}

// Creates a new Object representing a Roblox instance.
//
// Depending on whether you pass in a file or folder, you'll be given a
// different result. Folders are passed through newFolder() and files with a
// 'lua' extension are passed through newScript().
//
// Usage:
//
//   getObjectFromFile('./path/to/folder/');
//   { name: 'folder', className: 'Folder', children: [ [Object]... ] }
//
//   getObjectFromFile('./path/to/file.local.lua');
//   { name: 'file', className: 'LocalScript', source: '...'}
//
// Returns an Object, or null if `filePath` is not a directory or one of the
// supported filetypes.
function getObjectFromFile(filePath) {
  if (isDirectory(filePath)) {
    return newFolder(filePath);
  } else {
    if (path.extname(filePath) === '.lua') {
      return newScript(filePath);
    };
  };

  return null;
}

// Gets children and converts them to their appropriate Object.
//
// This is the primary interface to constructing the Object hierarchy. When
// supplied with a folder, it will recursively gather all of that folder's
// children, converting them to their appropriate Object.
//
// When supplied with a file, this just works like getObjectFromFile() or
// newScript().
function constructHierarchy(filePath) {
  const children = [];

  for (const child of fs.readdirSync(filePath)) {
    const childPath = path.join(filePath, child);
    const object = getObjectFromFile(childPath);

    if (object) {
      children.push(object);
    };
  };

  return children;
}

module.exports = constructHierarchy
