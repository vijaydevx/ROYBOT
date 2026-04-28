# ROYBOT 🤖

ROYBOT is a high-performance, self-balancing surveillance robot featuring a real-time tactical dashboard. It combines embedded systems (ESP32), computer vision (ESP32-CAM), and a modern web stack to provide a seamless remote operation experience.

![ROYBOT Dashboard Preview](https://via.placeholder.com/1200x600.png?text=ROYBOT+Tactical+Dashboard+Preview)

## 🚀 Features

- **Self-Balancing Logic**: Real-time PID control loop for stable upright operation.
- **Live Video Streaming**: Low-latency MJPEG stream from ESP32-CAM.
- **Tactical Dashboard**: Modern, industrial dark-themed UI built with React and Tailwind CSS.
- **Real-time Telemetry**: Live sensor data (Angle, Distance, PID Output, Obstacle Detection).
- **Remote Control**: Manual movement commands and real-time PID tuning via WebSockets.
- **Automated Alerts**: Intelligent logging and alert system for obstacle detection and system status.

## 🛠️ Tech Stack

### Software
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, Socket.io (Real-time communication).
- **Firmware**: C++ (Arduino/ESP32) for PID control and sensor integration.

### Hardware
- **Main Controller**: ESP32 (Handling PID, Motors, Sensors).
- **Camera Module**: ESP32-CAM (Video Streaming).
- **Sensors**: MPU6050 (Gyro/Accel), HC-SR04 (Ultrasonic).
- **Motor Driver**: BTS7960 High-Power Driver.

## 📦 Project Structure

```bash
├── client/          # React + Vite Tactical Dashboard
├── server/          # Node.js + Socket.io Backend Proxy
├── firmware/        # ESP32 & ESP32-CAM C++ Code
├── dashboard.html   # Legacy/Stand-alone Dashboard (Optional)
└── .gitignore       # Project-wide ignore rules
```

## 🔧 Getting Started

### 1. Firmware Setup
- Flash the `firmware/ROYBOT_Main.ino` to the main ESP32.
- Flash the `firmware/ROYBOT_Camera.ino` to the ESP32-CAM.
- Ensure the ESP32-CAM connects to the `ROYBOT_AP` created by the main board.

### 2. Backend Installation
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Installation
```bash
cd client
npm install
npm run dev
```

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

---
*Built with ❤️ for the Robotics Community.*
