const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

let players = {}; // tu trzymamy dane o użytkownikach
let bullets = {};

app.use(express.static('public')); // frontend w folderze 'public'

io.on('connection', (socket) => {
  console.log('Użytkownik połączony:', socket.id);

  // Kiedy klient wyśle swoje koordynaty
  socket.on('sendCoords', (coords) => {
    players[socket.id] = coords;
    io.emit('updateCoords', players); // wysyłamy do wszystkich
  });

  // Kiedy klient wyśle swoje koordynaty
  socket.on('sendBullets', (bullet) => {
    bullets[socket.id] = bullet;
    io.emit('updateBullets', bullets); // wysyłamy do wszystkich
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('updateCoords', players);
  });
});

http.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});

setInterval(() => {
  fetch("https://spaceshooterserver.onrender.com")
    .then(() => console.log("Ping!"))
    .catch(err => console.error("Błąd pingu:", err));
}, 10 * 60 * 1000); // co 10 minut
