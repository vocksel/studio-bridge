const path = require('path');
const process = require('process');

const server = require('./server.js');

const projectDir = process.argv[2] && path.resolve(__dirname, process.argv[2]) || __dirname;
const port = process.argv[3] || 8080;

server(projectDir, port)
