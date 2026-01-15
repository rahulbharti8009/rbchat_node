import dotenv from "dotenv";
dotenv.config()
import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketServer } from "socket.io";
import bodyParser from "body-parser";
import path from "path";
import cookieParser from "cookie-parser";
import logReqRes from "./src/middlewares/middleware.js";
import { connectMongoDb, connectSocketIO } from "./src/connection/connection.js";
import { router } from "./src/routes/V1/route.js";
import { HttpStatusCode } from "axios";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 9001;
// MongoDB connection
connectMongoDb(process.env.MONGO_URL);
  // Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
const io = new SocketServer(server, {
  cors: {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
  },
  });
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logReqRes("log.txt"));

// access
const __dist = path.resolve();
app.use("/", express.static(path.join(__dist, "dist")));

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", router);

// Socket.IO
connectSocketIO(io);

  server.listen(PORT, () => {
  console.log(`Server is ruuning on port ${PORT}`);

});