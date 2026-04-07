import { createServer } from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { setIO } from "./src/lib/socketServer";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);

  const io = new SocketIOServer(httpServer, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: {
      origin: dev ? "*" : undefined,
    },
  });

  // Store io globally so API routes can emit events
  setIO(io);

  io.on("connection", (socket) => {
    console.log(`[socket.io] Client connected: ${socket.id}`);

    // Clients join a recipe room to receive realtime updates
    socket.on("join-recipe", (slug: string) => {
      if (typeof slug === "string" && slug.length > 0) {
        socket.join(`recipe:${slug}`);
        console.log(`[socket.io] ${socket.id} joined recipe:${slug}`);
      }
    });

    socket.on("leave-recipe", (slug: string) => {
      if (typeof slug === "string" && slug.length > 0) {
        socket.leave(`recipe:${slug}`);
        console.log(`[socket.io] ${socket.id} left recipe:${slug}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[socket.io] Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
