import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

/**
 * Renders a CODE128 barcode for any value.
 *
 * Props:
 *   value: string (required)
 *   height?: number (default 60)
 *   displayValue?: boolean (default true)
 */
export default function BarcodeImage({ value, height = 60, displayValue = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !value) return;
    try {
      JsBarcode(ref.current, String(value), {
        format: "CODE128",
        height,
        displayValue,
        margin: 0,
        lineColor: "#111111ff",
        background: "#fff",
      });
    } catch (e) {
      console.error("JsBarcode error:", e);
    }
  }, [value, height, displayValue]);

  // use <svg> so it's crisp when printed
  return <svg ref={ref} role="img" aria-label={`Barcode ${value}`} />;
}
