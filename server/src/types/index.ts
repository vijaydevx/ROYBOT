export interface SensorData {
  angle: number;
  distance: number;
  pidOutput: number;
  obstacle: boolean;
  fallen: boolean;
  mode: "manual" | "auto";
  command: string;
  uptime: number;
  kp: number;
  ki: number;
  kd: number;
}

export interface Alert {
  level: "info" | "warning" | "danger";
  message: string;
  timestamp: string;
}

export interface ConnectionStatus {
  esp32: boolean;
  camera: boolean;
}
