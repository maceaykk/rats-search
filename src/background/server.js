const appConfig = require('./config')
const spiderCall = require('./spider')
const dbPatcher = require('./dbPatcher')
const startSphinx = require('./sphinx')

const http = require('http')
const express = require('express');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path')

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

server.listen(appConfig.httpPort);
console.log('Listening web server on', appConfig.httpPort, 'port')

app.use(express.static('web'));

const socketMessages = {}

io.on('connection', (socket) =>
{
  for(const message in socketMessages)
  {
    socket.on(message, socketMessages[message])
  }
})

sphinx = startSphinx(() => {
  dbPatcher(() => {
    spider = spiderCall((...data) => io.sockets.emit(...data), (message, callback) => {
      socketMessages[message] = callback
    }, path.resolve(packageJson.serverDataDirectory), packageJson.version, 'production')
  }, null, sphinx)
}, path.resolve(packageJson.serverDataDirectory), () => {})