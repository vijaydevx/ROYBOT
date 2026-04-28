#include "esp_camera.h"
#include <WiFi.h>
#include <WebServer.h>

// ================= WIFI =================
const char* ssid = "UNKNOWN";
const char* password = "123456789";

// ================= CAMERA MODEL =================
#define CAMERA_MODEL_AI_THINKER
#include "camera_pins.h"

// ================= LED =================
#define FLASH_LED_PIN 4

WebServer server(80);

// ================= STREAM =================
void handleStream() {
  WiFiClient client = server.client();

  String response = "HTTP/1.1 200 OK\r\n";
  response += "Content-Type: multipart/x-mixed-replace; boundary=frame\r\n\r\n";
  server.sendContent(response);

  while (client.connected()) {
    camera_fb_t * fb = esp_camera_fb_get();
    if (!fb) continue;

    server.sendContent("--frame\r\n");
    server.sendContent("Content-Type: image/jpeg\r\n\r\n");
    client.write(fb->buf, fb->len);
    server.sendContent("\r\n");

    esp_camera_fb_return(fb);
  }
}

// ================= LED CONTROL =================
void handleLED() {
  if (server.hasArg("state")) {
    String state = server.arg("state");

    if (state == "on") {
      digitalWrite(FLASH_LED_PIN, HIGH);
      server.send(200, "text/plain", "LED ON");
    } else {
      digitalWrite(FLASH_LED_PIN, LOW);
      server.send(200, "text/plain", "LED OFF");
    }
  }
}

// ================= LOGOUT / TERMINATE =================
void handleTerminate() {
  server.send(200, "text/plain", "Terminating & Rebooting ESP32-CAM...");
  delay(1000); // Give the browser time to receive the response
  ESP.restart(); // Will reboot the microcontroller
}

void handleLogout() {
  // If you add basic authentication later, returning 401 will prompt a logout.
  // For now, it will simply serve a "Logged Out" page.
  String html = "<h2>Logged Out</h2><p>You have been safely disconnected. You may close this tab.</p><a href='/'>Go back</a>";
  server.send(401, "text/html", html);
}

// ================= UI DASHBOARD =================
void handleRoot() {
  String html = R"rawliteral(
  <!DOCTYPE html>
  <html>
  <head>
    <title>ESP32 CAM Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        background:#0f172a;
        color:white;
        text-align:center;
        font-family:Arial;
      }
      h2 { margin-top:20px; }
      img {
        width:90%;
        max-width:480px;
        border-radius:12px;
        margin-top:10px;
      }
      button {
        padding:12px 20px;
        margin:10px;
        border:none;
        border-radius:8px;
        font-size:16px;
        background:#22c55e;
        color:white;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      button:hover { opacity: 0.8; }
      .off { background:#ef4444; }
      .warn { background:#f59e0b; }
      .danger { background:#7f1d1d; }
    </style>
  </head>
  <body>

    <h2>🤖 ESP32-CAM Surveillance</h2>

    <img src="/stream">

    <br>

    <button onclick="fetch('/led?state=on')">💡 LED ON</button>
    <button class="off" onclick="fetch('/led?state=off')">💡 LED OFF</button>
    
    <br><br>
    <hr style="border-color:#334155; max-width:400px; margin: 20px auto;">
    
    <!-- Logout / Terminate Options -->
    <button class="warn" onclick="window.location.href='/logout'">🚪 Logout</button>
    <button class="danger" onclick="if(confirm('Are you sure you want to terminate/reboot the camera?')) { fetch('/terminate'); alert('Camera is rebooting...'); }">🛑 Terminate (Restart)</button>

  </body>
  </html>
  )rawliteral";

  server.send(200, "text/html", html);
}

// ================= SETUP =================
void setup() {
  Serial.begin(115200);

  pinMode(FLASH_LED_PIN, OUTPUT);
  digitalWrite(FLASH_LED_PIN, LOW);

  // ================= CAMERA CONFIG =================
  camera_config_t config;

  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;

  config.pin_d0 = 5;
  config.pin_d1 = 18;
  config.pin_d2 = 19;
  config.pin_d3 = 21;
  config.pin_d4 = 36;
  config.pin_d5 = 39;
  config.pin_d6 = 34;
  config.pin_d7 = 35;

  config.pin_xclk = 0;
  config.pin_pclk = 22;
  config.pin_vsync = 25;
  config.pin_href = 23;

  config.pin_sccb_sda = 26;
  config.pin_sccb_scl = 27;

  config.pin_pwdn = 32;
  config.pin_reset = -1;

  config.xclk_freq_hz = 10000000;
  config.pixel_format = PIXFORMAT_JPEG;

  config.frame_size = FRAMESIZE_QVGA;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  // ================= INIT CAMERA =================
  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("Camera init failed");
    return;
  }

  // ================= WIFI =================
  WiFi.begin(ssid, password);
  WiFi.setSleep(false);

  Serial.print("Connecting WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ Connected!");
  Serial.print("👉 IP: http://");
  Serial.println(WiFi.localIP());

  // ================= ROUTES =================
  server.on("/", handleRoot);
  server.on("/stream", HTTP_GET, handleStream);
  server.on("/led", handleLED);
  
  // NEW: Logout and Terminate Routes
  server.on("/logout", handleLogout);
  server.on("/terminate", handleTerminate);

  server.begin();
}

// ================= LOOP =================
void loop() {
  server.handleClient();
}
