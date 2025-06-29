import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import config from "./config";
import connectDB from "./config/mongoose";
import { initializeSocketIO } from "./sockets"; // Import our socket logic handler
import logger from "./utils/logger";

export const PORT = process.env.NODE_ENV === "development" ? config.port : 80;


const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "*", // In production, restrict this to your frontend's URL
    methods: ["GET", "POST"],
  },
});

// --- THIS IS THE FIX ---
// Call the function from sockets/index.ts and pass it the io instance.
// This attaches all our event listeners ('connection', 'new message', etc.) to the server.
initializeSocketIO(io);

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server is listening on http://localhost:${PORT}`);
      logger.info(`📡 Socket.IO is ready and listening.`);
    });
  } catch (error) {
    logger.error("🔥 Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
