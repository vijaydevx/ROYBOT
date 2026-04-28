import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { config } from "./config";
import { Esp32Service } from "./services/esp32.service";
import { Poller } from "./services/poller";
import { setupSocketHandlers } from "./socket/handler";
import { statusRouter } from "./routes/status";
import { commandRouter } from "./routes/command";
import { pidRouter } from "./routes/pid";
import { alertsRouter } from "./routes/alerts";
import { streamRouter } from "./routes/stream";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
  },
});

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
}));
app.use(express.json());

const esp32 = new Esp32Service();
const poller = new Poller(io, esp32);
setupSocketHandlers(io, esp32, poller);

// REST API routes (proxy to ESP32)
app.use("/api", statusRouter(esp32));
app.use("/api", commandRouter(esp32));
app.use("/api", pidRouter(esp32));
app.use("/api", alertsRouter(esp32));
app.use("/api", streamRouter(esp32));

// Get current IP config
app.get("/api/config", (_req, res) => {
  res.json({ esp32Ip: esp32.esp32Ip, camIp: esp32.camIp, configured: esp32.isConfigured });
});

// Set ESP32 IPs from dashboard
app.post("/api/config", (req, res) => {
  let { esp32Ip, camIp } = req.body;
  if (!esp32Ip || typeof esp32Ip !== "string") {
    res.status(400).json({ error: "esp32Ip is required" });
    return;
  }
  // Strip http:// prefix if user included it
  const cleanIp = (ip: string) => ip.trim().replace(/^https?:\/\//, "").split('/')[0];
  esp32.setIps(cleanIp(esp32Ip), cleanIp(camIp || esp32Ip));
  poller.stop();
  poller.start();
  res.json({ ok: true, esp32Ip: esp32.esp32Ip, camIp: esp32.camIp });
});

app.delete("/api/config", (_req, res) => {
  esp32.setIps("192.168.4.1", "192.168.4.2");
  poller.stop();
  res.json({ ok: true });
});

server.listen(config.port, () => {
  console.log(`ROYBOT server running on port ${config.port}`);
  console.log("Waiting for ESP32 IP configuration from dashboard...");
});
