import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Les tailles de police maison (text-h2…) doivent être reconnues comme tailles, sinon twMerge les écrase avec la couleur.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["display", "h1", "h2", "tag"] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "Rentimmo Academy",
  tagline: "L'académie qui forme les pros de la LCD",
  url: "https://www.rentimmoacademy.fr",
  whatsapp: "33600000000",
  email: "contact@rentimmoacademy.fr",
  calBooking: "https://cal.com/rentimmoacademy/appel-strategique",
  socials: {
    instagram: "https://instagram.com/rentimmo_academy",
    youtube: "https://youtube.com/@rentimmoacademy",
    tiktok: "https://tiktok.com/@rentimmoacademy",
  },
};
