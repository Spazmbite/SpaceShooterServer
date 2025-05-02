const server = require('http').createServer();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', ws => {
  clients.add(ws);

  ws.on('message', data => {
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  });

  ws.on('close', () => clients.delete(ws));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
