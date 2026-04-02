import { Router, Request, Response } from "express";
import { Esp32Service } from "../services/esp32.service";

export function statusRouter(esp32: Esp32Service): Router {
  const router = Router();

  router.get("/status", async (_req: Request, res: Response) => {
    try {
      const data = await esp32.getStatus();
      res.json(data);
    } catch {
      res.status(503).json({ error: "ESP32 unreachable" });
    }
  });

  return router;
}
