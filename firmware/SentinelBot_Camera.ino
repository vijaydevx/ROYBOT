/*
 * SentinelBot - ESP32-CAM Video Streamer
 * Runs on ESP32-CAM module (separate from main ESP32)
 * Board: "AI Thinker ESP32-CAM" in Arduino IDE
 * Flash using FTDI adapter (GPIO0 to GND for flash mode)
 *
 * Endpoints:
 *   GET :81/stream  - MJPEG video stream
 *   GET /capture    - Single JPEG frame
 *   GET /status     - JSON: streaming, resolution, fps, ip
 *   GET /flash      - Params: state=on|off
 *
 * WiFi: Connects to SentinelBot AP (SentinelBot / robot1234)
 */

// See SentinelBot_Camera.txt for full source code
// Upload this to the ESP32-CAM board using Arduino IDE + FTDI
// Board: "AI Thinker ESP32-CAM"
