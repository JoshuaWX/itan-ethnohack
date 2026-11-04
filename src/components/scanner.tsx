"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ScanLine } from "lucide-react";
import { normalizeName } from "@/lib/matching";

type BarcodeDetectorInstance = {
  detect(input: HTMLVideoElement): Promise<{ rawValue: string }[]>;
};
type BarcodeDetectorConstructor = new (options: {
  formats: string[];
}) => BarcodeDetectorInstance;

export function Scanner({
  productId,
  productNumber,
}: {
  productId: string;
  productNumber: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [matched, setMatched] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    let stream: MediaStream | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stop = () => stream?.getTracks().forEach((track) => track.stop());
    const start = async () => {
      const Detector = (
        window as Window & { BarcodeDetector?: BarcodeDetectorConstructor }
      ).BarcodeDetector;
      if (!Detector || !navigator.mediaDevices?.getUserMedia) {
        setMessage(
          "Camera QR scanning is unavailable in this browser. Use the search field to enter the number instead.",
        );
        return;
      }
      try {
        const detector = new Detector({ formats: ["qr_code"] });
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (!active) {
          stop();
          return;
        }
        const video = videoRef.current;
        if (!video) {
          stop();
          return;
        }
        video.srcObject = stream;
        await video.play();
        if (!active) {
          stop();
          return;
        }
        setMessage(
          "Point your camera at a QR code containing a registration number.",
        );
        let failures = 0;
        const scan = async () => {
          if (!active) return;
          try {
            const results = await detector.detect(video);
            failures = 0;
            if (!active) return;
            if (results.length) {
              const value = results[0].rawValue.trim();
              if (
                normalizeName(value) === normalizeName(productNumber) ||
                value === "ITAN-DEMO-1"
              ) {
                setMatched(true);
                setMessage(value === "ITAN-DEMO-1" ? "Demo code recognised. Open the example product." : "A number in this curated collection was found.");
              } else {
                setMessage(
                  "No matching registration number was found in this small collection. Try manual search.",
                );
              }
              stop();
              return;
            }
          } catch {
            failures++;
            if (failures >= 10) {
              setMessage("Scanning could not start. Close the camera and try again, or use manual search.");
              stop();
              return;
            }
          }
          timer = setTimeout(scan, 300);
        };
        await scan();
      } catch {
        if (active)
          setMessage(
            "The camera could not be opened. Check permission or use manual search.",
          );
        stop();
      }
    };
    setMatched(false);
    setMessage("Starting camera…");
    void start();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      stop();
    };
  }, [open, productNumber]);

  return (
    <div className="scanner">
      <button
        type="button"
        className="scanner-toggle"
        onClick={() => setOpen((current) => !current)}
      >
        <ScanLine size={17} />
        {open ? "Close camera" : "Scan a QR code"}
      </button>
      <details className="demo-code">
        <summary>View a demo QR code</summary>
        <p>
          This sample encodes ITAN-DEMO-1 for testing. It is not a product
          authentication code.
        </p>
        {/* Static local SVG generated for the demo; no product artwork is used. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/demo-code.svg"
          width="180"
          height="180"
          alt="Demo QR code containing the test token ITAN-DEMO-1"
        />
      </details>
      {open && (
        <div className="scanner-panel">
          <p>
            Scan a QR code containing a registration number. URLs and other
            codes are not opened.
          </p>
          <video
            ref={videoRef}
            muted
            playsInline
            aria-label="Camera preview for QR scanning"
          />
          <p role="status">{message}</p>
          {matched && (
            <Link className="source-link" href={`/products/${productId}`}>
              Open the curated product record
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
