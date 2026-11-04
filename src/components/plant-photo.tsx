import Image from "next/image";
import { plantPhotos } from "@/lib/photos";

export function PlantPhoto({ id, name }: { id: string; name: string }) {
  const photo = plantPhotos[id];
  if (!photo) return null;
  return <figure className="plant-photo"><Image src={`/plants/${id}.webp`} width={800} height={600} sizes="(max-width: 700px) 90vw, 360px" alt={`${name}, ${photo.part.toLowerCase()}`} /><figcaption>{photo.part} · <a href={photo.source} target="_blank" rel="noreferrer">{photo.author}</a> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> · resized and converted to WebP</figcaption></figure>;
}
