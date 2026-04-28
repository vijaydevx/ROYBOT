import { useCallback } from "react";
import { StatusCards } from "./StatusCards";
import { VideoFeed } from "./VideoFeed";
import { ControlPanel } from "./ControlPanel";
import { SensorGauges } from "./SensorGauges";
import { PidTuner } from "./PidTuner";
import { AlertLog } from "./AlertLog";
import { IpConfig } from "./IpConfig";
import { PageLayout } from "./PageLayout";
import { useConnection } from "@/lib/ConnectionContext";

export function Dashboard() {
  const { configured, setConfigured } = useConnection();
  const onConnected = useCallback(() => { setConfigured(true); }, [setConfigured]);

  if (!configured) return <IpConfig onConnected={onConnected} />;

  return (
    <PageLayout title="Operations" subtitle="Tactical Surveillance Interface">
      <div className="h-full flex flex-col gap-3">
        {/* Status cards */}
        <div className="shrink-0">
          <StatusCards />
        </div>

        {/* Middle: Video (8col) + Control (4col) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
          <div className="xl:col-span-8 overflow-hidden">
            <VideoFeed />
          </div>
          <div className="xl:col-span-4 overflow-hidden">
            <ControlPanel />
          </div>
        </div>

        {/* Bottom panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0" style={{ height: "clamp(200px, 30vh, 280px)" }}>
          <PidTuner />
          <SensorGauges />
          <AlertLog />
        </div>
      </div>
    </PageLayout>
  );
}
