import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path"; // Import the 'path' module from Node.js
import authRoutes from "./api/routes/auth.routes";
import chatRoutes from "./api/routes/chat.routes";
import userRoutes from "./api/routes/user.routes";
import errorHandler from "./middleware/error.handler";
import logger from "./utils/logger";

const app: Express = express();

// --- Core Middleware ---
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
// It's important that API routes are registered before the frontend serving logic.
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/users", userRoutes);

// --- Production Frontend Serving Logic ---

// Determine the correct path to the frontend's 'dist' folder.
// This path navigates from the current directory (backend/dist/src) up to the 'app' root,
// and then into 'frontend/dist'.
const frontendDistPath = path.resolve(
  __dirname,
  "..",
  "..",
  "frontend",
  "dist"
);
logger.info(`Serving frontend static files from: ${frontendDistPath}`);

// 1. Serve static files (like CSS, JS, images) from the React app's build directory.
app.use(express.static(frontendDistPath));

// 2. The "catch-all" handler: for any request that doesn't match an API route,
//    send back React's index.html file. This allows React Router to handle the routing.
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(frontendDistPath, "index.html"));
});

// --- Error Handling Middleware ---
// This must always be the last piece of middleware added.
app.use(errorHandler);

export default app;
