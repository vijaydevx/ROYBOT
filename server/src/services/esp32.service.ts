import axios, { AxiosInstance } from "axios";
import { SensorData, Alert } from "../types";

export class Esp32Service {
  private client: AxiosInstance;
  private camClient: AxiosInstance;
  private _esp32Ip: string = "";
  private _camIp: string = "";

  constructor() {
    this.client = axios.create({ timeout: 3000 });
    this.camClient = axios.create({ timeout: 3000 });
  }

  get esp32Ip() { return this._esp32Ip; }
  get camIp() { return this._camIp; }
  get isConfigured() { return this._esp32Ip !== ""; }

  setIps(esp32Ip: string, camIp: string) {
    this._esp32Ip = esp32Ip;
    this._camIp = camIp;
    this.client.defaults.baseURL = `http://${esp32Ip}`;
    this.camClient.defaults.baseURL = `http://${camIp}`;
    console.log(`IPs updated: ESP32=${esp32Ip}, CAM=${camIp}`);
  }

  async getStatus(): Promise<SensorData> {
    const { data } = await this.client.get("/api/status");
    return data;
  }

  async sendCommand(cmd: string): Promise<void> {
    await this.client.get("/api/command", { params: { cmd } });
  }

  async setPid(kp: number, ki: number, kd: number): Promise<void> {
    await this.client.get("/api/pid", { params: { kp, ki, kd } });
  }

  async getAlerts(): Promise<Alert[]> {
    const { data } = await this.client.get<string[]>("/api/alerts");
    return data.map((msg) => {
      let level: Alert["level"] = "info";
      if (msg.toLowerCase().includes("obstacle") || msg.toLowerCase().includes("fallen")) {
        level = "danger";
      } else if (msg.toLowerCase().includes("calibrat") || msg.toLowerCase().includes("warning")) {
        level = "warning";
      }
      const timeMatch = msg.match(/^([\d.]+)s:\s*/);
      const timestamp = timeMatch ? timeMatch[1] + "s" : new Date().toLocaleTimeString();
      const message = timeMatch ? msg.replace(timeMatch[0], "") : msg;
      return { level, message, timestamp };
    });
  }

  getStreamUrl(): string {
    return `http://${this._camIp}:81/stream`;
  }

  getCaptureUrl(): string {
    return `http://${this._camIp}/capture`;
  }

  async checkConnection(): Promise<boolean> {
    if (!this.isConfigured) return false;
    try {
      await this.client.get("/api/status", { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async checkCameraConnection(): Promise<boolean> {
    if (!this._camIp) return false;
    try {
      // Try /status (works with both default and custom ESP32-CAM firmware)
      await this.camClient.get("/status", { timeout: 2000 });
      return true;
    } catch {
      try {
        // Fallback: try a capture to verify camera is alive
        await axios.get(`http://${this._camIp}/capture`, { timeout: 2000, responseType: "arraybuffer" });
        return true;
      } catch {
        return false;
      }
    }
  }
}
