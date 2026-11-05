"use client";

import Image from "next/image";
import { plantPhotos } from "@/lib/photos";
import { Leaf } from "lucide-react";
import { useState } from "react";

export function PlantPhoto({ id, name }: { id: string; name: string }) {
  const [failedId, setFailedId] = useState("");
  const photo = plantPhotos[id];
  if (!photo || failedId === id) return <figure className="plant-photo plant-illustration"><Leaf size={80} strokeWidth={1} aria-hidden="true" /><figcaption>Plant illustration · a photograph of {name} is unavailable.</figcaption></figure>;
  return <figure className="plant-photo"><Image src={`/plants/${id}.webp`} width={800} height={600} sizes="(max-width: 700px) 90vw, 360px" alt={`${name}, ${photo.part.toLowerCase()}`} onError={() => setFailedId(id)} /><figcaption>
    <span>{photo.part}</span>
    <details className="photo-credits"><summary>Photo credit and full image</summary><p><a href={photo.source} target="_blank" rel="noreferrer">{photo.author} · original source</a> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a></p><p>{photo.edits}</p><a href={`/plants/${id}.webp`} target="_blank" rel="noreferrer">View the full photograph ↗</a></details>
  </figcaption></figure>;
}
