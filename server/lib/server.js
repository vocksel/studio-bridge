const http = require('http');
const chokidar = require('chokidar');

const constructHierarchy = require('./roblox-tree.js');

module.exports = function startServer(dir, port) {
  console.log(`Server started on http://localhost:${port}`)
  console.log(`Using: ${dir}`)

  let objects = constructHierarchy(dir);

  chokidar.watch(dir).on('change', (path) => {
    objects = constructHierarchy(dir);
  });

  http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(objects, null, 1));
  }).listen(port);
}
