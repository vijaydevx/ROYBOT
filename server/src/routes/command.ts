import { Router, Request, Response } from "express";
import { Esp32Service } from "../services/esp32.service";

export function commandRouter(esp32: Esp32Service): Router {
  const router = Router();

  router.get("/command", async (req: Request, res: Response) => {
    const cmd = req.query.cmd as string;
    if (!cmd) {
      res.status(400).json({ error: "Missing cmd parameter" });
      return;
    }
    try {
      await esp32.sendCommand(cmd);
      res.json({ ok: true });
    } catch {
      res.status(503).json({ error: "ESP32 unreachable" });
    }
  });

  return router;
}
