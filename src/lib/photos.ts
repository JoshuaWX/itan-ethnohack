const photoEntries: Record<string, { part: string; author: string; source: string; license: string; licenseUrl: string; originalFile?: string; checkedOn?: string }> = {
  papaya: { part: "Fruit and leaves", author: "Forest & Kim Starr", source: "https://commons.wikimedia.org/wiki/File:Starr_010404-0610_Carica_papaya.jpg", originalFile: "Starr_010404-0610_Carica_papaya.jpg", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", checkedOn: "2026-11-05" },
  "bitter-leaf": { part: "Leaves", author: "Zmu'az4Z", source: "https://commons.wikimedia.org/wiki/File:Vernonia_amygdalina_plant.jpg", originalFile: "Vernonia_amygdalina_plant.jpg", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/", checkedOn: "2026-11-05" },
  neem: { part: "Leaves", author: "Forest & Kim Starr", source: "https://commons.wikimedia.org/wiki/File:Starr_060928-0469_Azadirachta_indica.jpg", originalFile: "Starr_060928-0469_Azadirachta_indica.jpg", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/", checkedOn: "2026-11-05" },
  hibiscus: { part: "Calyces", author: "SarKaLay", source: "https://commons.wikimedia.org/wiki/File:Roselle_Calyces.jpg", license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" },
  ginger: { part: "Rhizome", author: "Kayleemariev", source: "https://commons.wikimedia.org/wiki/File:Zingiber_officinale_rhizome.jpg", license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" },
  "cinnamon-verum": { part: "Leaf", author: "Forest & Kim Starr", source: "https://commons.wikimedia.org/wiki/File:Starr_070906-8568_Cinnamomum_verum.jpg", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/" },
  "cinnamon-cassia": { part: "Leaves", author: "Forest & Kim Starr", source: "https://commons.wikimedia.org/wiki/File:Starr_070403-6416_Cinnamomum_burmanni.jpg", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/" },
  guava: { part: "Leaves", author: "Forest & Kim Starr", source: "https://commons.wikimedia.org/wiki/File:Starr_050818-4173_Psidium_guajava.jpg", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/" },
};

export const plantPhotos = Object.fromEntries(Object.entries(photoEntries).map(([id, photo]) => [id, {
  ...photo, taxonId: id, originalFile: photo.originalFile ?? decodeURIComponent(photo.source.split("File:")[1] ?? "unknown"),
  checkedOn: photo.checkedOn ?? "2026-11-04", edits: "Resized and converted to WebP; display may crop the image.",
}]));
