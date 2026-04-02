import { Server, Socket } from "socket.io";
import { Esp32Service } from "../services/esp32.service";
import { Poller } from "../services/poller";

export function setupSocketHandlers(io: Server, esp32: Esp32Service, poller: Poller) {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send cached state immediately
    if (poller.lastSensorData) {
      socket.emit("sensorData", poller.lastSensorData);
    }
    if (poller.lastAlerts.length > 0) {
      socket.emit("alerts", poller.lastAlerts);
    }

    socket.on("command", async (cmd: string) => {
      try {
        await esp32.sendCommand(cmd);
        console.log(`Command sent: ${cmd}`);
      } catch (err) {
        socket.emit("error", { message: "Failed to send command" });
      }
    });

    socket.on("pid", async (params: { kp: number; ki: number; kd: number }) => {
      try {
        await esp32.setPid(params.kp, params.ki, params.kd);
        console.log(`PID updated: Kp=${params.kp} Ki=${params.ki} Kd=${params.kd}`);
      } catch (err) {
        socket.emit("error", { message: "Failed to update PID" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}
