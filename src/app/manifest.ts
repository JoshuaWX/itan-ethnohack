import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ìtàn — Plant knowledge",
    short_name: "Ìtàn",
    description: "Explore plant knowledge and evidence in Nigeria.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f3ec",
    theme_color: "#173e32",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
