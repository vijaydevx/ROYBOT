import { Router, Request, Response } from "express";
import { Esp32Service } from "../services/esp32.service";

export function alertsRouter(esp32: Esp32Service): Router {
  const router = Router();

  router.get("/alerts", async (_req: Request, res: Response) => {
    try {
      const alerts = await esp32.getAlerts();
      res.json(alerts);
    } catch {
      res.status(503).json({ error: "ESP32 unreachable" });
    }
  });

  return router;
}
