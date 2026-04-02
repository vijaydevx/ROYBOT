/*
 * SentinelBot - Self-Balancing Surveillance Robot
 * Main ESP32 Firmware
 *
 * Pins:
 *   MPU6050:  SDA=GPIO21, SCL=GPIO22
 *   HC-SR04P: TRIG=GPIO5, ECHO=GPIO18
 *   BTS7960:  RPWM=GPIO25, LPWM=GPIO26, R_EN=GPIO32, L_EN=GPIO33
 *   Buzzer:   GPIO19
 *   LED:      R=GPIO13, Y=GPIO14, G=GPIO27
 *
 * API Endpoints:
 *   GET /api/status   - JSON: angle, distance, pidOutput, obstacle, fallen, mode, command, uptime, kp, ki, kd
 *   GET /api/command   - Params: cmd=forward|backward|left|right|stop|auto|manual
 *   GET /api/pid       - Params: kp, ki, kd (floats)
 *   GET /api/alerts    - JSON array of alert strings
 *   GET /               - Embedded HTML dashboard
 *
 * WiFi AP: SentinelBot / robot1234
 * IP: 192.168.4.1
 */

// See SentinelBot_Main.txt for full source code
// Upload this to the main ESP32 board using Arduino IDE
// Board: "ESP32 Dev Module"
