#! /usr/bin/env node

const path = require('path');
const fs = require('fs');

const program = require('commander');

const pkg = require('../package.json');
const server = require('../lib/server.js');

function failWithHelp(msg) {
  console.log(msg);
  program.help();
  process.exit(1);
}

program
  .version(pkg.version)
  .arguments('<dir>')
  .option('-p, --port <port>', 'the port to run the server off of. defaults ' +
    'to 8080. you also need to change the port that the plugin uses.', 8080)
  .action(dir => {
    const fullPath = path.resolve(dir);

    if (fs.existsSync(fullPath)) {
      server(fullPath, program.port);
    } else {
      failWithHelp(`Could not find a directory at ${fullPath}`)
    }
  });

program.parse(process.argv);

if (!program.args[0])
  failWithHelp('The directory argument is required.');
