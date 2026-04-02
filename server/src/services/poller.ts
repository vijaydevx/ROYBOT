import { Server } from "socket.io";
import { Esp32Service } from "./esp32.service";
import { SensorData, Alert, ConnectionStatus } from "../types";
import { config } from "../config";

export class Poller {
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private tick = 0;
  private lastAlertCount = 0;
  private connected = false;
  private cameraConnected = false;
  private backoffMs: number;

  public lastSensorData: SensorData | null = null;
  public lastAlerts: Alert[] = [];

  constructor(
    private io: Server,
    private esp32: Esp32Service
  ) {
    this.backoffMs = config.pollInterval;
  }

  start() {
    this.stop();
    this.backoffMs = config.pollInterval;
    this.poll();
  }

  stop() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  private async poll() {
    // Don't poll if IPs haven't been set from the dashboard yet
    if (!this.esp32.isConfigured) {
      this.timeout = setTimeout(() => this.poll(), 2000);
      return;
    }

    // Check camera independently (every 5th tick)
    this.tick++;
    if (this.tick % 5 === 0) {
      await this.pollCamera();
    }

    try {
      const data = await this.esp32.getStatus();
      this.lastSensorData = data;
      this.io.emit("sensorData", data);

      if (!this.connected) {
        this.connected = true;
        this.emitConnectionStatus();
      }
      this.backoffMs = config.pollInterval;

      if (this.tick % 5 === 0) {
        await this.pollAlerts();
      }
    } catch {
      if (this.connected) {
        this.connected = false;
        this.emitConnectionStatus();
      }
      this.backoffMs = Math.min(this.backoffMs * 1.5, 5000);
    }

    this.timeout = setTimeout(() => this.poll(), this.backoffMs);
  }

  private async pollAlerts() {
    try {
      const alerts = await this.esp32.getAlerts();
      if (alerts.length !== this.lastAlertCount) {
        this.lastAlerts = alerts;
        this.lastAlertCount = alerts.length;
        this.io.emit("alerts", alerts);
      }
    } catch {
      // non-critical
    }
  }

  private async pollCamera() {
    const wasConnected = this.cameraConnected;
    this.cameraConnected = await this.esp32.checkCameraConnection();
    if (wasConnected !== this.cameraConnected) {
      this.emitConnectionStatus();
    }
  }

  private emitConnectionStatus() {
    const status: ConnectionStatus = {
      esp32: this.connected,
      camera: this.cameraConnected,
    };
    this.io.emit("connectionStatus", status);
  }
}
