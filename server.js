const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const players = new Map();
const playgroundBounds = { width: 1600, height: 900 };

function createPlayer(id, nickname, avatar) {
  const startX = Math.floor(Math.random() * (playgroundBounds.width - 200)) + 100;
  const startY = Math.floor(Math.random() * (playgroundBounds.height - 200)) + 100;
  return {
    id,
    nickname,
    avatar,
    x: startX,
    y: startY,
    color: avatar.color,
    facing: 'down',
    mood: 'χαρούμενος'
  };
}

io.on('connection', (socket) => {
  let player;

  socket.on('join-game', ({ nickname, avatar }) => {
    if (player) return;

    const safeNickname = typeof nickname === 'string' && nickname.trim() !== ''
      ? nickname.trim().slice(0, 12)
      : 'Explorer';

    const defaultAvatar = {
      color: '#ff8a65',
      outfit: 'adventurer'
    };

    const chosenAvatar = {
      ...defaultAvatar,
      ...(avatar || {})
    };

    player = createPlayer(socket.id, safeNickname, chosenAvatar);
    players.set(socket.id, player);

    socket.emit('current-players', {
      me: player,
      players: Array.from(players.values())
    });
    socket.broadcast.emit('player-joined', player);
  });

  socket.on('player-move', (movement) => {
    if (!player) return;

    const speed = 5;
    const updatedPlayer = { ...player };

    if (movement.left) {
      updatedPlayer.x -= speed;
      updatedPlayer.facing = 'left';
    }
    if (movement.right) {
      updatedPlayer.x += speed;
      updatedPlayer.facing = 'right';
    }
    if (movement.up) {
      updatedPlayer.y -= speed;
      updatedPlayer.facing = 'up';
    }
    if (movement.down) {
      updatedPlayer.y += speed;
      updatedPlayer.facing = 'down';
    }

    updatedPlayer.x = Math.max(60, Math.min(playgroundBounds.width - 60, updatedPlayer.x));
    updatedPlayer.y = Math.max(120, Math.min(playgroundBounds.height - 120, updatedPlayer.y));

    player = updatedPlayer;
    players.set(socket.id, updatedPlayer);
    io.emit('player-updated', updatedPlayer);
  });

  socket.on('set-mood', (mood) => {
    if (!player) return;
    const safeMood = typeof mood === 'string' && mood.trim() !== '' ? mood.trim().slice(0, 16) : 'χαρούμενος';
    player = { ...player, mood: safeMood };
    players.set(socket.id, player);
    io.emit('player-updated', player);
  });

  socket.on('disconnect', () => {
    if (player) {
      players.delete(socket.id);
      io.emit('player-left', socket.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Storybook Meadow server running on http://localhost:${PORT}`);
});
