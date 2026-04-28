"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Maximize2, Minimize2, RefreshCw, WifiOff, ExternalLink, Settings, X, Scan, ScanEye, Download, Zap } from "lucide-react";
import { useObjectDetection, Detection } from "@/hooks/useObjectDetection";
import { getSocket } from "@/lib/socket";

/* ── Camera Settings Overlay ── */
function CamOverlay({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState<Record<string, number> | null>(null);
  const [tab, setTab] = useState<"image" | "exposure" | "features">("image");

  useEffect(() => {
    fetch("/api/camera-settings").then(r => r.ok ? r.json() : null).then(setSettings).catch(() => {});
  }, []);

  const set = useCallback(async (v: string, val: number) => {
    setSettings(p => p ? { ...p, [v]: val } : p);
    await fetch("/api/camera-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variable: v, value: val }) }).catch(() => {});
  }, []);

  const RES: Record<number, string> = { 5: "QVGA", 6: "CIF", 7: "HVGA", 8: "VGA", 9: "SVGA", 10: "XGA", 11: "HD", 12: "SXGA", 13: "UXGA" };
  const Toggle = ({ label, k }: { label: string; k: string }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-[11px] text-s-text-secondary">{label}</span>
      <button onClick={() => set(k, settings![k] ? 0 : 1)}
        className={`w-8 h-4 rounded-full relative transition-all ${settings![k] ? "bg-s-blue" : "bg-slate-200"}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${settings![k] ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </div>
  );
  const Sld = ({ label, k, mn, mx }: { label: string; k: string; mn: number; mx: number }) => (
    <div className="flex items-center gap-2 py-1">
      <span className="text-[11px] text-s-text-secondary w-20 shrink-0">{label}</span>
      <input type="range" min={mn} max={mx} value={settings![k] ?? 0} onChange={e => set(k, +e.target.value)} className="slider-compact flex-1" />
      <span className="text-[10px] font-mono font-bold text-s-text w-6 text-right">{settings![k] ?? 0}</span>
    </div>
  );

  if (!settings) return null;

  return (
    <div className="absolute top-2 right-2 bottom-2 w-[260px] glass-overlay p-3 z-20 animate-slide-right overflow-hidden flex flex-col"
      onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-s-text">Camera Settings</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-s-bg-alt text-s-text-muted"><X size={14} /></button>
      </div>
      <div className="flex gap-0.5 p-0.5 bg-s-bg-alt rounded-lg mb-2">
        {(["image", "exposure", "features"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1 rounded-md text-[10px] font-semibold transition-all ${tab === t ? "bg-white text-s-text shadow-sm" : "text-s-text-muted"}`}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
        {tab === "image" && <>
          <div className="flex items-center justify-between py-1">
            <span className="text-[11px] text-s-text-secondary">Resolution</span>
            <select value={settings.framesize} onChange={e => set("framesize", +e.target.value)}
              className="text-[10px] bg-s-bg-alt border border-s-border rounded-lg px-2 py-0.5 outline-none">
              {Object.entries(RES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <Sld label="Quality" k="quality" mn={4} mx={63} />
          <Sld label="Brightness" k="brightness" mn={-2} mx={2} />
          <Sld label="Contrast" k="contrast" mn={-2} mx={2} />
          <Sld label="Saturation" k="saturation" mn={-2} mx={2} />
          <Sld label="Sharpness" k="sharpness" mn={-2} mx={2} />
          <Toggle label="H-Mirror" k="hmirror" />
          <Toggle label="V-Flip" k="vflip" />
        </>}
        {tab === "exposure" && <>
          <Toggle label="AWB" k="awb" />
          <Toggle label="AWB Gain" k="awb_gain" />
          <Toggle label="AEC" k="aec" />
          <Toggle label="AEC2" k="aec2" />
          <Sld label="AE Level" k="ae_level" mn={-2} mx={2} />
          <Sld label="AEC Value" k="aec_value" mn={0} mx={1200} />
          <Toggle label="AGC" k="agc" />
          <Sld label="AGC Gain" k="agc_gain" mn={0} mx={30} />
          <Sld label="Gain Ceil" k="gainceiling" mn={0} mx={511} />
        </>}
        {tab === "features" && <>
          <Toggle label="BPC" k="bpc" />
          <Toggle label="WPC" k="wpc" />
          <Toggle label="Raw GMA" k="raw_gma" />
          <Toggle label="Lens Corr" k="lenc" />
          <Toggle label="DCW" k="dcw" />
          <Sld label="LED" k="led_intensity" mn={0} mx={255} />
        </>}
      </div>
    </div>
  );
}

/* ── Detection HUD ── */
function DetectionHUD({ detections, fps }: { detections: Detection[]; fps: number }) {
  const humans = detections.filter(d => d.class === "person");
  const others = detections.filter(d => d.class !== "person");

  return (
    <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10 pointer-events-none">
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
        <ScanEye size={10} className="text-green-400" />
        <span className="text-[9px] font-mono text-white">{fps} FPS</span>
        <span className="text-[9px] text-white/50">|</span>
        <span className="text-[9px] font-mono text-white">{detections.length} obj</span>
      </div>
      {humans.length > 0 && (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/80 backdrop-blur-sm animate-pulse">
          <span className="text-[10px] font-bold text-white">
            {humans.length} HUMAN{humans.length > 1 ? "S" : ""} DETECTED
          </span>
        </div>
      )}
      {others.length > 0 && (
        <div className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
          <span className="text-[9px] text-white/80">
            {others.map(d => `${d.class} ${(d.score * 100).toFixed(0)}%`).join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Human Capture Gallery ── */
function CaptureGallery({ captures, onView, onDownload }: {
  captures: { url: string; time: string; count: number }[];
  onView: (url: string) => void;
  onDownload: (url: string) => void;
}) {
  if (captures.length === 0) return null;
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-s-red flex items-center gap-1">
          <Scan size={10} /> Human Detections ({captures.length})
        </span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {captures.map((c, i) => (
          <div key={i} className="shrink-0 relative group">
            <button onClick={() => onView(c.url)}
              className="rounded-lg overflow-hidden border-2 border-s-red/30 hover:border-s-red transition-all hover:scale-105">
              <img src={c.url} alt="" className="h-12 w-auto" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[7px] text-white text-center py-0.5 rounded-b-lg">
              {c.count} person{c.count > 1 ? "s" : ""} · {c.time}
            </div>
            <button onClick={() => onDownload(c.url)}
              className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Download size={8} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main VideoFeed ── */
export function VideoFeed() {
  const [fullscreen, setFullscreen] = useState(false);
  const [streamLoaded, setStreamLoaded] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [retryKey, setRetryKey] = useState(0);
  const [cameraInfo, setCameraInfo] = useState<{ streamUrl: string; captureUrl: string; directUrl: string } | null>(null);
  const [streamSrc, setStreamSrc] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [resolution, setResolution] = useState("");
  const [detectEnabled, setDetectEnabled] = useState(false);
  const [humanCaptures, setHumanCaptures] = useState<{ url: string; time: string; count: number }[]>([]);
  const [flashOn, setFlashOn] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  // Human detection callback
  const onHumanDetected = useCallback((dataUrl: string, humans: Detection[]) => {
    const time = new Date().toLocaleTimeString();
    setHumanCaptures(prev => [{ url: dataUrl, time, count: humans.length }, ...prev.slice(0, 19)]);

    // Auto-download
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `roybot-human-${Date.now()}.jpg`;
    a.click();

    // Push alert via socket
    const socket = getSocket();
    // We emit a local event the alert system can pick up
    // For now, we use a custom event on window
    window.dispatchEvent(new CustomEvent("roybot-alert", {
      detail: {
        level: "danger",
        message: `Human detected! (${humans.length} person${humans.length > 1 ? "s" : ""}, confidence ${(humans[0].score * 100).toFixed(0)}%)`,
        timestamp: time,
      }
    }));
  }, []);

  const { detections, modelLoaded, loading, fps } = useObjectDetection({
    canvasRef: overlayCanvasRef,
    captureUrl: "/api/capture",
    enabled: detectEnabled && streamLoaded,
    interval: 800,
    confidenceThreshold: 0.45,
    onHumanDetected,
  });

  const toggleFlash = useCallback(async () => {
    try {
      const newState = !flashOn;
      // Use the proxied backend endpoint /api/led
      const res = await fetch(`/api/led?state=${newState ? "on" : "off"}`);
      if (res.ok) setFlashOn(newState);
    } catch {}
  }, [flashOn]);

  useEffect(() => {
    const f = async () => {
      try {
        const r = await fetch("/api/camera-info");
        if (r.ok) {
          const i = await r.json();
          setCameraInfo(i);
          // Connect directly to the camera for zero-latency direct streaming
          setStreamSrc(`${i.directUrl}/stream?t=${Date.now()}`);
        }
      } catch {}
    };
    f();
    const iv = setInterval(f, 15000);
    return () => clearInterval(iv);
  }, []);

  const onLoad = useCallback(() => {
    setStreamLoaded(true);
    if (imgRef.current) { const { naturalWidth: w, naturalHeight: h } = imgRef.current; if (w && h) setResolution(`${w}x${h}`); }
  }, []);

  const toggleFs = useCallback(() => {
    if (!containerRef.current) return;
    if (!fullscreen) containerRef.current.requestFullscreen?.(); else document.exitFullscreen?.();
    setFullscreen(!fullscreen);
  }, [fullscreen]);

  const snap = useCallback(async () => {
    try {
      const r = await fetch("/api/capture"); 
      if (!r.ok) return;
      const b = await r.blob(); const u = URL.createObjectURL(b);
      setScreenshots(p => [u, ...p.slice(0, 9)]);
      const a = document.createElement("a"); a.href = u; a.download = `roybot-${Date.now()}.jpg`; a.click();
    } catch {}
  }, []);

  const retry = useCallback(() => {
    setStreamError(false); 
    setStreamLoaded(false); 
    setResolution(""); 
    setRetryKey(k => k + 1);
    if (cameraInfo) setStreamSrc(`${cameraInfo.directUrl}/stream?t=${Date.now()}`);
  }, []);

  const downloadCapture = useCallback((url: string) => {
    const a = document.createElement("a"); a.href = url; a.download = `roybot-human-${Date.now()}.jpg`; a.click();
  }, []);

  return (
    <>
      <div className="glass-card p-4 h-full flex flex-col overflow-hidden bg-s-card border-s-border relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-s-highlight font-mono">Camera Feed</h3>
            {resolution && <span className="text-[9px] font-mono font-semibold text-s-highlight bg-s-highlight/10 px-1.5 py-0.5 rounded-full border border-s-highlight/20">{resolution}</span>}
            {detectEnabled && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                modelLoaded ? "bg-s-accent/10 text-s-accent" : "bg-s-highlight/10 text-s-highlight"
              }`}>
                <ScanEye size={9} />
                {loading ? "Loading AI..." : modelLoaded ? "AI Active" : "AI Off"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {streamLoaded && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-s-highlight/10 text-s-highlight text-[10px] font-semibold border border-s-highlight/20">
                <span className="w-1.5 h-1.5 rounded-full bg-s-highlight animate-pulse" /> Live
              </span>
            )}
            {cameraInfo && (
              <button onClick={() => window.open(cameraInfo.directUrl, "_blank")}
                className="p-1.5 rounded-lg hover:bg-s-bg-alt text-s-text-muted transition-all" title="Camera UI">
                <ExternalLink size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Stream container */}
        <div ref={containerRef} className="relative rounded-xl overflow-hidden bg-gradient-to-br from-s-sidebar to-s-bg flex-1 min-h-0 border border-white/5">
          {/* Video stream */}
          {streamSrc && !streamError && (
            <img ref={imgRef} key={`${retryKey}-${streamSrc}`} src={streamSrc} alt="Live"
              className={`w-full h-full object-contain transition-opacity duration-300 ${streamLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={onLoad} onError={() => { setStreamError(true); setStreamLoaded(false); }}
              crossOrigin="anonymous" />
          )}

          {/* Detection overlay canvas - positioned exactly over the image */}
          <canvas
            ref={overlayCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ objectFit: "contain" }}
          />

          {/* Disconnected state */}
          {(!streamLoaded || streamError || !streamSrc) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <WifiOff size={28} className="text-s-text-muted/40 mb-3" />
              <div className="text-xs font-medium text-s-text-secondary">{streamError ? "Stream unavailable" : "Connecting..."}</div>
              <div className="flex gap-2 mt-3">
                <button onClick={retry} className="btn-outline px-3 py-1.5 text-[10px] flex items-center gap-1"><RefreshCw size={10} /> Retry</button>
                {cameraInfo && <button onClick={() => window.open(cameraInfo.directUrl, "_blank")} className="btn-primary px-3 py-1.5 text-[10px] flex items-center gap-1"><ExternalLink size={10} /> Camera UI</button>}
              </div>
            </div>
          )}

          {/* Stream overlays */}
          {streamLoaded && (
            <>
              {/* LIVE badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-s-sidebar/60 backdrop-blur-sm z-10 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-s-accent animate-pulse" />
                <span className="text-[9px] font-bold text-white tracking-wider">LIVE</span>
              </div>

              {/* Detection HUD */}
              {detectEnabled && modelLoaded && <DetectionHUD detections={detections} fps={fps} />}

              {/* Bottom controls */}
              <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                {/* AI Detection toggle */}
                <button onClick={() => setDetectEnabled(!detectEnabled)}
                  className={`p-1.5 rounded-lg backdrop-blur-md shadow-lg transition-all border ${
                    detectEnabled
                      ? "bg-s-accent text-white border-s-accent shadow-[0_0_15px_rgba(220,112,73,0.4)]"
                      : "bg-s-sidebar/80 text-s-text-muted border-white/10 hover:text-white"
                  }`} title={detectEnabled ? "Disable AI Detection" : "Enable AI Detection"}>
                  <Scan size={14} />
                </button>
                <button onClick={toggleFlash}
                  className={`p-1.5 rounded-lg backdrop-blur-md shadow-lg transition-all border ${flashOn ? "bg-s-highlight text-s-sidebar border-s-highlight shadow-[0_0_15px_rgba(235,184,101,0.4)]" : "bg-s-sidebar/80 border-white/10 text-s-text-muted"}`} title="Flash">
                  <Zap size={14} fill={flashOn ? "currentColor" : "none"} />
                </button>
                <button onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 rounded-lg backdrop-blur-md shadow-lg transition-all border ${showSettings ? "bg-s-muted text-white border-white/20" : "bg-s-sidebar/80 border-white/10 text-s-text-muted"}`} title="Settings">
                  <Settings size={14} />
                </button>
                <button onClick={snap} className="p-1.5 rounded-lg bg-s-sidebar/80 border border-white/10 backdrop-blur-md shadow-lg text-s-text-muted hover:text-white transition-all" title="Screenshot">
                  <Camera size={14} />
                </button>
                <button onClick={toggleFs} className="p-1.5 rounded-lg bg-s-sidebar/80 border border-white/10 backdrop-blur-md shadow-lg text-s-text-muted hover:text-white transition-all" title="Fullscreen">
                  {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
              </div>
            </>
          )}

          {/* Camera settings overlay */}
          {showSettings && <CamOverlay onClose={() => setShowSettings(false)} />}

          {/* AI Loading overlay */}
          {detectEnabled && loading && (
            <div className="absolute inset-0 bg-s-bg/40 backdrop-blur-sm flex items-center justify-center z-30 animate-fade-in">
              <div className="bg-s-sidebar rounded-2xl px-6 py-4 shadow-2xl border border-white/10 flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-3 border-s-highlight border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold text-white">Loading AI Model...</span>
                <span className="text-[10px] text-s-text-muted">COCO-SSD (~6MB)</span>
              </div>
            </div>
          )}
        </div>

        {/* Human detection captures */}
        <CaptureGallery
          captures={humanCaptures}
          onView={(url) => setLightbox(url)}
          onDownload={downloadCapture}
        />

        {/* Manual screenshots */}
        {screenshots.length > 0 && (
          <div className="flex gap-1.5 mt-2 overflow-x-auto">
            {screenshots.map((url, i) => (
              <button key={i} onClick={() => setLightbox(url)}
                className="shrink-0 rounded-lg overflow-hidden border border-s-border hover:border-s-blue/30 transition-all hover:scale-105">
                <img src={url} alt="" className="h-10 w-auto" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fade-in" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-2xl shadow-2xl" />
        </div>
      )}
    </>
  );
}
