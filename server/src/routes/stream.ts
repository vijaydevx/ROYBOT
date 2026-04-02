import { Router, Request, Response } from "express";
import axios from "axios";
import { Esp32Service } from "../services/esp32.service";

export function streamRouter(esp32: Esp32Service): Router {
  const router = Router();

  // Return camera URLs so frontend can connect directly
  router.get("/camera-info", (_req: Request, res: Response) => {
    if (!esp32.camIp) {
      res.status(503).json({ error: "Camera IP not configured" });
      return;
    }
    res.json({
      streamUrl: `http://${esp32.camIp}:81/stream`,
      captureUrl: `http://${esp32.camIp}/capture`,
      directUrl: `http://${esp32.camIp}`,
    });
  });

  // Proxy MJPEG stream from ESP32-CAM (fallback if direct doesn't work)
  router.get("/stream", async (req: Request, res: Response) => {
    try {
      const response = await axios.get(esp32.getStreamUrl(), {
        responseType: "stream",
        timeout: 10000,
      });
      res.setHeader("Content-Type", response.headers["content-type"] || "multipart/x-mixed-replace;boundary=123456789000000000000987654321");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Access-Control-Allow-Origin", "*");
      response.data.pipe(res);
      req.on("close", () => {
        response.data.destroy();
      });
    } catch {
      res.status(503).json({ error: "Camera stream unavailable" });
    }
  });

  // Single frame capture (proxy)
  router.get("/capture", async (_req: Request, res: Response) => {
    try {
      const response = await axios.get(esp32.getCaptureUrl(), {
        responseType: "arraybuffer",
        timeout: 5000,
      });
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Disposition", "inline; filename=snapshot.jpg");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(Buffer.from(response.data));
    } catch {
      res.status(503).json({ error: "Camera capture unavailable" });
    }
  });

  // Get current camera settings
  router.get("/camera-settings", async (_req: Request, res: Response) => {
    try {
      const response = await axios.get(`http://${esp32.camIp}/status`, { timeout: 3000 });
      res.json(response.data);
    } catch {
      res.status(503).json({ error: "Camera unreachable" });
    }
  });

  // Update a camera setting (proxies to ESP32-CAM /control endpoint)
  router.post("/camera-settings", async (req: Request, res: Response) => {
    const { variable, value } = req.body;
    if (!variable || value === undefined) {
      res.status(400).json({ error: "variable and value required" });
      return;
    }
    try {
      await axios.get(`http://${esp32.camIp}/control`, {
        params: { var: variable, val: value },
        timeout: 3000,
      });
      res.json({ ok: true });
    } catch {
      res.status(503).json({ error: "Failed to set camera parameter" });
    }
  });

  // LED control (on/off) - uses /control?var=led_intensity endpoint
  router.get("/led", async (req: Request, res: Response) => {
    const state = req.query.state as string;
    if (state !== "on" && state !== "off") {
      res.status(400).json({ error: "state must be 'on' or 'off'" });
      return;
    }
    try {
      await axios.get(`http://${esp32.camIp}/control`, {
        params: { var: "led_intensity", val: state === "on" ? 255 : 0 },
        timeout: 3000,
      });
      res.json({ ok: true, state });
    } catch {
      res.status(503).json({ error: "LED control failed" });
    }
  });

  return router;
}
