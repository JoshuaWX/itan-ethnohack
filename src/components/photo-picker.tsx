"use client";

import { useRef } from "react";
import { Camera, ImagePlus } from "lucide-react";

export function PhotoPicker({ accept, disabled, onPick, replacing }: {
  accept: string;
  disabled?: boolean;
  onPick: (file: File) => void;
  replacing?: boolean;
}) {
  const camera = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  function pick(input: HTMLInputElement) {
    const file = input.files?.[0];
    input.value = "";
    if (file) onPick(file);
  }
  return <div className="photo-actions">
    <input hidden aria-label="Camera photo" ref={camera} type="file" accept={accept} capture="environment" onChange={(event) => pick(event.currentTarget)} />
    <input hidden aria-label="Gallery photo" ref={gallery} type="file" accept={accept} onChange={(event) => pick(event.currentTarget)} />
    <button className="button" type="button" disabled={disabled} onClick={() => camera.current?.click()}><Camera size={18} aria-hidden="true" /> {replacing ? "Retake photo" : "Take a photo"}</button>
    <button className="button photo-secondary" type="button" disabled={disabled} onClick={() => gallery.current?.click()}><ImagePlus size={18} aria-hidden="true" /> {replacing ? "Replace photo" : "Choose a photo"}</button>
  </div>;
}
