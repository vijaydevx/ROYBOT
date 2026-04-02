"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface Detection {
  class: string;
  score: number;
  bbox: [number, number, number, number];
}

const CLASS_COLORS: Record<string, string> = {
  person: "#EF4444",
  car: "#3B82F6", truck: "#3B82F6", bus: "#3B82F6", motorcycle: "#3B82F6", bicycle: "#3B82F6",
  cat: "#F59E0B", dog: "#F59E0B", bird: "#F59E0B", horse: "#F59E0B",
  default: "#8B5CF6",
};

function getColor(cls: string): string {
  return CLASS_COLORS[cls] || CLASS_COLORS.default;
}

interface UseObjectDetectionOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  captureUrl: string; // URL to fetch individual JPEG frames (e.g. /api/capture)
  enabled: boolean;
  interval?: number;
  confidenceThreshold?: number;
  onHumanDetected?: (imageDataUrl: string, detections: Detection[]) => void;
}

export function useObjectDetection({
  canvasRef,
  captureUrl,
  enabled,
  interval = 800,
  confidenceThreshold = 0.45,
  onHumanDetected,
}: UseObjectDetectionOptions) {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fps, setFps] = useState(0);

  const modelRef = useRef<any>(null);
  const runningRef = useRef(false);
  const enabledRef = useRef(enabled);
  const humanCooldownRef = useRef(0);

  enabledRef.current = enabled;

  // Load model
  const loadModel = useCallback(async () => {
    if (modelRef.current) return;
    setLoading(true);
    try {
      const tf = await import("@tensorflow/tfjs");
      await tf.ready();
      console.log("TF.js backend:", tf.getBackend());
      const cocoSsd = await import("@tensorflow-models/coco-ssd");
      const model = await cocoSsd.load({ base: "lite_mobilenet_v2" });
      modelRef.current = model;
      setModelLoaded(true);
      console.log("COCO-SSD model loaded");
    } catch (err) {
      console.error("Failed to load model:", err);
    }
    setLoading(false);
  }, []);

  // Draw boxes on overlay canvas
  const drawDetections = useCallback((dets: Detection[], width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    for (const det of dets) {
      const [x, y, w, h] = det.bbox;
      const color = getColor(det.class);
      const isPerson = det.class === "person";

      // Glow for person
      if (isPerson) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = color + "40";
        ctx.lineWidth = 6;
        ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
        ctx.restore();
      }

      // Box
      ctx.strokeStyle = color;
      ctx.lineWidth = isPerson ? 3 : 2;
      ctx.setLineDash(isPerson ? [] : [4, 4]);
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);

      // Corner accents for person
      if (isPerson) {
        const cl = Math.min(w, h) * 0.2;
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y + cl); ctx.lineTo(x, y); ctx.lineTo(x + cl, y);
        ctx.moveTo(x + w - cl, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + cl);
        ctx.moveTo(x, y + h - cl); ctx.lineTo(x, y + h); ctx.lineTo(x + cl, y + h);
        ctx.moveTo(x + w - cl, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - cl);
        ctx.stroke();
      }

      // Label
      const label = `${det.class} ${(det.score * 100).toFixed(0)}%`;
      ctx.font = `bold ${isPerson ? 13 : 11}px Inter, sans-serif`;
      const tw = ctx.measureText(label).width;
      const lh = isPerson ? 22 : 18;
      const ly = y > lh + 4 ? y - lh - 2 : y + 2;

      // Label bg with rounded rect
      ctx.fillStyle = color;
      ctx.beginPath();
      const r = 4;
      ctx.moveTo(x + r, ly);
      ctx.lineTo(x + tw + 10 - r, ly);
      ctx.quadraticCurveTo(x + tw + 10, ly, x + tw + 10, ly + r);
      ctx.lineTo(x + tw + 10, ly + lh - r);
      ctx.quadraticCurveTo(x + tw + 10, ly + lh, x + tw + 10 - r, ly + lh);
      ctx.lineTo(x + r, ly + lh);
      ctx.quadraticCurveTo(x, ly + lh, x, ly + lh - r);
      ctx.lineTo(x, ly + r);
      ctx.quadraticCurveTo(x, ly, x + r, ly);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(label, x + 5, ly + lh - (isPerson ? 6 : 5));
    }
  }, [canvasRef]);

  // Detection loop — fetches a JPEG frame, draws to canvas, runs model
  const detectLoop = useCallback(async () => {
    if (runningRef.current || !enabledRef.current || !modelRef.current) return;
    runningRef.current = true;

    try {
      const start = performance.now();

      // Fetch a single JPEG frame from the server proxy
      const res = await fetch(captureUrl);
      if (!res.ok) throw new Error("capture failed");
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);

      const w = bitmap.width;
      const h = bitmap.height;

      // Draw to offscreen canvas for model input
      const offscreen = new OffscreenCanvas(w, h);
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) { runningRef.current = false; return; }
      offCtx.drawImage(bitmap, 0, 0);

      // Need a regular canvas for TF.js (OffscreenCanvas not always supported)
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = w;
      tempCanvas.height = h;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) { runningRef.current = false; return; }
      tempCtx.drawImage(bitmap, 0, 0);

      // Run detection
      const predictions = await modelRef.current.detect(tempCanvas);
      const elapsed = performance.now() - start;
      setFps(Math.round(1000 / Math.max(elapsed, 1)));

      const dets: Detection[] = predictions
        .filter((p: any) => p.score >= confidenceThreshold)
        .map((p: any) => ({
          class: p.class,
          score: p.score,
          bbox: p.bbox as [number, number, number, number],
        }));

      setDetections(dets);
      drawDetections(dets, w, h);

      // Human auto-capture
      const humans = dets.filter(d => d.class === "person" && d.score >= 0.55);
      if (humans.length > 0 && Date.now() - humanCooldownRef.current > 8000) {
        humanCooldownRef.current = Date.now();
        // Draw boxes on capture
        const capCtx = tempCanvas.getContext("2d");
        if (capCtx) {
          for (const det of dets) {
            const [bx, by, bw, bh] = det.bbox;
            capCtx.strokeStyle = getColor(det.class);
            capCtx.lineWidth = det.class === "person" ? 3 : 2;
            capCtx.strokeRect(bx, by, bw, bh);
            capCtx.fillStyle = getColor(det.class);
            capCtx.font = "bold 12px Inter, sans-serif";
            capCtx.fillText(`${det.class} ${(det.score * 100).toFixed(0)}%`, bx + 4, by > 20 ? by - 6 : by + 14);
          }
          const dataUrl = tempCanvas.toDataURL("image/jpeg", 0.85);
          onHumanDetected?.(dataUrl, humans);
        }
      }

      bitmap.close();
    } catch (err) {
      // Frame capture failed, skip this tick
    }

    runningRef.current = false;
  }, [captureUrl, confidenceThreshold, drawDetections, onHumanDetected]);

  // Start/stop loop
  useEffect(() => {
    let iv: ReturnType<typeof setInterval> | null = null;
    if (enabled && modelLoaded) {
      iv = setInterval(detectLoop, interval);
    } else {
      // Clear overlay
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      setDetections([]);
      setFps(0);
    }
    return () => { if (iv) clearInterval(iv); };
  }, [enabled, modelLoaded, interval, detectLoop, canvasRef]);

  // Load model when enabled
  useEffect(() => {
    if (enabled && !modelRef.current && !loading) {
      loadModel();
    }
  }, [enabled, loading, loadModel]);

  return { detections, modelLoaded, loading, fps };
}
