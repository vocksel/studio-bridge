const http = require('http');

const tree = require('./roblox-tree.js');

function startServer(dir, port) {
  console.log(`Server started on http://localhost:${port}`)
  console.log(`Using: ${dir}`)

  http.createServer((req, res) => {
    const objects = tree.dirToRobloxObjectTree(dir);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(objects, null, 1));
  }).listen(port);
}

module.exports = startServer
