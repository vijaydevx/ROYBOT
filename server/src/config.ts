import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  port: parseInt(process.env.SERVER_PORT || "3001", 10),
  pollInterval: parseInt(process.env.POLL_INTERVAL_MS || "200", 10),
};
