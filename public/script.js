const canvas = document.getElementById('playground');
const ctx = canvas.getContext('2d');
const joinForm = document.getElementById('join-form');
const nicknameInput = document.getElementById('nickname');
const colorInput = document.getElementById('color');
const moodSelector = document.getElementById('mood-selector');
const moodSelect = document.getElementById('mood');
const sendMoodButton = document.getElementById('send-mood');

const socket = io();
const activePlayers = new Map();
let me = null;
let movement = { up: false, down: false, left: false, right: false };

const flowerPatch = Array.from({ length: 140 }, () => ({
  x: Math.random() * canvas.width,
  y: 580 + Math.random() * 260,
  color: randomPastel()
}));

const clouds = [
  { x: 200, y: 160, width: 160 },
  { x: 580, y: 120, width: 220 },
  { x: 980, y: 140, width: 200 }
];

function randomPastel() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue} 80% 80%)`;
}

function resizeCanvas() {
  const ratio = canvas.height / canvas.width;
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width * ratio > height) {
    canvas.style.height = `${height}px`;
    canvas.style.width = `${height / ratio}px`;
  } else {
    canvas.style.width = `${width}px`;
    canvas.style.height = `${width * ratio}px`;
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

joinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nickname = nicknameInput.value.trim();
  const color = colorInput.value;

  socket.emit('join-game', {
    nickname,
    avatar: {
      color
    }
  });
});

sendMoodButton.addEventListener('click', () => {
  const mood = moodSelect.value;
  socket.emit('set-mood', mood);
});

window.addEventListener('keydown', (event) => {
  if (!me) return;
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      movement.up = true;
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      movement.down = true;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      movement.left = true;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      movement.right = true;
      break;
    default:
      return;
  }
});

window.addEventListener('keyup', (event) => {
  if (!me) return;
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      movement.up = false;
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      movement.down = false;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      movement.left = false;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      movement.right = false;
      break;
    default:
      return;
  }
});

window.addEventListener('blur', () => {
  if (!me) return;
  movement = { up: false, down: false, left: false, right: false };
  socket.emit('player-move', movement);
  lastMovementSent = { ...movement };
});

let lastMovementSent = { ...movement };
setInterval(() => {
  if (!me) return;
  const changed =
    movement.up !== lastMovementSent.up ||
    movement.down !== lastMovementSent.down ||
    movement.left !== lastMovementSent.left ||
    movement.right !== lastMovementSent.right;
  if (changed || movement.up || movement.down || movement.left || movement.right) {
    socket.emit('player-move', movement);
    lastMovementSent = { ...movement };
  }
}, 1000 / 24);

socket.on('current-players', ({ me: myPlayer, players: list }) => {
  me = myPlayer;
  activePlayers.clear();
  list.forEach((player) => {
    activePlayers.set(player.id, player);
  });
  joinForm.classList.add('hidden');
  moodSelector.classList.remove('hidden');
});

socket.on('player-joined', (player) => {
  activePlayers.set(player.id, player);
});

socket.on('player-updated', (player) => {
  activePlayers.set(player.id, player);
  if (player.id === me?.id) {
    me = player;
  }
});

socket.on('player-left', (playerId) => {
  activePlayers.delete(playerId);
});

function roundedRectPath(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawBackground(delta) {
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, '#a1d9ff');
  skyGradient.addColorStop(0.6, '#e7f7ff');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sun
  ctx.beginPath();
  ctx.arc(1400, 160, 80, 0, Math.PI * 2);
  ctx.fillStyle = '#ffec80';
  ctx.fill();

  // Soft drifting clouds
  clouds.forEach((cloud) => {
    cloud.x += 0.02 * delta;
    if (cloud.x - cloud.width > canvas.width + 60) {
      cloud.x = -cloud.width;
      cloud.y = 80 + Math.random() * 120;
    }
    drawCloud(cloud.x, cloud.y, cloud.width);
  });

  // Distant mountains
  drawMountain(0, 520, 360, '#ccd5f6');
  drawMountain(300, 540, 420, '#b7c6f2');
  drawMountain(760, 520, 360, '#ccd5f6');
  drawMountain(1100, 560, 460, '#b7c6f2');

  // Rolling hills
  ctx.fillStyle = '#b8e29b';
  ctx.beginPath();
  ctx.moveTo(0, 520);
  ctx.bezierCurveTo(220, 450, 420, 600, 640, 520);
  ctx.bezierCurveTo(820, 460, 1040, 580, 1240, 520);
  ctx.bezierCurveTo(1400, 480, 1600, 580, 1600, 580);
  ctx.lineTo(1600, 900);
  ctx.lineTo(0, 900);
  ctx.closePath();
  ctx.fill();

  // Lake
  ctx.beginPath();
  ctx.moveTo(280, 650);
  ctx.bezierCurveTo(340, 600, 500, 580, 620, 640);
  ctx.bezierCurveTo(760, 700, 620, 780, 480, 760);
  ctx.bezierCurveTo(360, 740, 240, 700, 280, 650);
  ctx.fillStyle = '#7fd0ff';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Path
  ctx.beginPath();
  ctx.moveTo(1200, 620);
  ctx.bezierCurveTo(1260, 640, 1300, 720, 1280, 900);
  ctx.lineWidth = 120;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#f1d7a4';
  ctx.stroke();

  // Trees
  drawTree(220, 600);
  drawTree(300, 580);
  drawTree(900, 610);
  drawTree(1040, 630);
  drawTree(1340, 600);

  // Flowers
  flowerPatch.forEach(({ x, y, color }) => drawFlower(x, y, color));
}

function drawCloud(x, y, width) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(x, y, width * 0.3, 0, Math.PI * 2);
  ctx.arc(x + width * 0.3, y - 20, width * 0.24, 0, Math.PI * 2);
  ctx.arc(x + width * 0.6, y, width * 0.28, 0, Math.PI * 2);
  ctx.arc(x + width * 0.8, y + 10, width * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMountain(offsetX, baseY, height, color) {
  ctx.beginPath();
  ctx.moveTo(offsetX, baseY);
  ctx.lineTo(offsetX + height / 2, baseY - height);
  ctx.lineTo(offsetX + height, baseY);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(offsetX + height / 2, baseY - height);
  ctx.lineTo(offsetX + height * 0.65, baseY - height * 0.3);
  ctx.lineTo(offsetX + height * 0.35, baseY - height * 0.3);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fill();
}

function drawTree(x, y) {
  ctx.fillStyle = '#8c6239';
  ctx.fillRect(x - 8, y, 16, 60);
  ctx.beginPath();
  ctx.arc(x, y, 36, 0, Math.PI * 2);
  ctx.fillStyle = '#4caf50';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 24, y + 18, 24, 0, Math.PI * 2);
  ctx.arc(x + 24, y + 18, 24, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlower(x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i++) {
    ctx.rotate((Math.PI * 2) / 5);
    ctx.beginPath();
    ctx.ellipse(0, 10, 6, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ffca28';
  ctx.fill();
  ctx.restore();
}

function drawPlayers() {
  activePlayers.forEach((player) => {
    drawAvatar(player);
  });
}

function drawAvatar(player) {
  const { x, y, color, nickname, facing, mood } = player;
  const label = nickname || 'Explorer';
  const moodText = mood || 'χαρούμενος';

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.beginPath();
  ctx.ellipse(0, 60, 36, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fill();

  // Body
  ctx.fillStyle = color || '#ff8a65';
  roundedRectPath(-24, -10, 48, 80, 22);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(0, -20, 26, 0, Math.PI * 2);
  ctx.fillStyle = '#ffe0bd';
  ctx.fill();

  // Face features
  ctx.fillStyle = '#333';
  ctx.beginPath();
  if (facing === 'left') {
    ctx.arc(-8, -24, 4, 0, Math.PI * 2);
  } else if (facing === 'right') {
    ctx.arc(8, -24, 4, 0, Math.PI * 2);
  } else {
    ctx.arc(-8, -24, 4, 0, Math.PI * 2);
    ctx.arc(8, -24, 4, 0, Math.PI * 2);
  }
  ctx.fill();

  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.moveTo(-10, -8);
  ctx.quadraticCurveTo(0, facing === 'down' ? 4 : 0, 10, -8);
  ctx.strokeStyle = '#ff8a80';
  ctx.stroke();

  // Mood bubble
  ctx.font = '20px "Baloo 2", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  roundedRectPath(-60, -110, 120, 36, 16);
  ctx.fill();
  roundedRectPath(-60, -110, 120, 36, 16);
  ctx.stroke();
  ctx.fillStyle = '#3f3d56';
  ctx.fillText(moodText, 0, -92);

  // Nickname label
  ctx.font = '24px "Baloo 2", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = 'rgba(63,61,86,0.3)';
  ctx.lineWidth = 4;
  ctx.textBaseline = 'middle';
  ctx.strokeText(label, 0, 92);
  ctx.fillStyle = '#3f3d56';
  ctx.fillText(label, 0, 92);

  ctx.restore();
}

let lastRender = performance.now();
function render(timestamp = performance.now()) {
  const delta = timestamp - lastRender;
  lastRender = timestamp;
  drawBackground(delta);
  drawPlayers();
  requestAnimationFrame(render);
}

render();
