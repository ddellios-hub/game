import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app";
import { env } from "./config/env";
import { registerLobbyNamespace, registerRoomNamespace } from "./modules/games/socket";

const port = env.PORT;
const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [/localhost:\d+$/],
    methods: ["GET", "POST"],
    credentials: true
  }
});

registerLobbyNamespace(io.of("/lobby"));
registerRoomNamespace(io);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
