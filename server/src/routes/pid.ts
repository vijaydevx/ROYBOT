import { Router, Request, Response } from "express";
import { Esp32Service } from "../services/esp32.service";

export function pidRouter(esp32: Esp32Service): Router {
  const router = Router();

  router.get("/pid", async (req: Request, res: Response) => {
    try {
      const kp = parseFloat(req.query.kp as string);
      const ki = parseFloat(req.query.ki as string);
      const kd = parseFloat(req.query.kd as string);
      if (isNaN(kp) || isNaN(ki) || isNaN(kd)) {
        res.status(400).json({ error: "Invalid PID parameters" });
        return;
      }
      await esp32.setPid(kp, ki, kd);
      res.json({ ok: true });
    } catch {
      res.status(503).json({ error: "ESP32 unreachable" });
    }
  });

  return router;
}
