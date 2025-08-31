// src/components/BarcodeScanner.js
import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Safe barcode scanner using lazy-loaded Quagga.
 * Props:
 *   onDetected(code: string)  // called on each detection
 *   once?: boolean            // stop after first hit (default: true)
 */
export default function BarcodeScanner({ onDetected, once = true }) {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const quaggaRef = useRef(null);    // module instance after lazy import
  const targetRef = useRef(null);    // DOM node for camera
  const runningRef = useRef(false);  // avoid double starts

  const handleDetectedSafe = useCallback((res) => {
    const code = res?.codeResult?.code;
    if (!code) return;
    onDetected && onDetected(code);
    if (once) stopScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDetected, once]);

  const stopScanner = useCallback(() => {
    try {
      const Q = quaggaRef.current;
      if (Q) {
        Q.offDetected(handleDetectedSafe);
        if (Q.running) Q.stop();
      }
    } catch {/* ignore */}
    runningRef.current = false;
    setActive(false);
    setLoading(false);
  }, [handleDetectedSafe]);

  const startScanner = useCallback(async () => {
    if (runningRef.current || active || loading) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Camera not supported on this device/browser.");
      return;
    }
    if (!targetRef.current) return;

    setLoading(true);
    try {
      const mod = await import("quagga");      // lazy-load
      const Q = mod.default || mod;
      quaggaRef.current = Q;

      await new Promise((resolve, reject) => {
        Q.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: targetRef.current,
              constraints: { facingMode: "environment" },
            },
            decoder: {
              readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "upc_reader",
                "upc_e_reader",
              ],
            },
            locate: true,
          },
          (err) => (err ? reject(err) : resolve())
        );
      });

      Q.start();
      Q.onDetected(handleDetectedSafe);
      runningRef.current = true;
      setActive(true);
    } catch (e) {
      console.error("Scanner start failed:", e);
      stopScanner();
      alert("Could not start camera. Check permissions or try a different browser.");
    } finally {
      setLoading(false);
    }
  }, [active, loading, handleDetectedSafe, stopScanner]);

  useEffect(() => stopScanner, [stopScanner]);

  return (
    <div className="card" style={{ marginTop: 8 }}>
      <h3>Barcode Scanner</h3>
      <div
        id="scanner"
        ref={targetRef}
        style={{
          width: "100%",
          minHeight: 260,
          background: "#00000010",
          borderRadius: 8,
          overflow: "hidden",
        }}
      />
      <div className="row" style={{ marginTop: 8, gap: 8 }}>
        {!active ? (
          <button onClick={startScanner} disabled={loading}>
            {loading ? "Starting..." : "Start Scanner"}
          </button>
        ) : (
          <button className="danger" onClick={stopScanner}>Stop Scanner</button>
        )}
      </div>
    </div>
  );
}
