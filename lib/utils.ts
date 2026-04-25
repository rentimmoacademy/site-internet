import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "Rentimmo Academy",
  tagline: "L'académie qui forme les pros de la LCD",
  url: "https://rentimmo-academy.com",
  whatsapp: "33600000000",
  email: "rentimmoacademy@gmail.com",
  calBooking: "https://cal.com/rentimmo-academy/appel-strategique",
  socials: {
    instagram: "https://instagram.com/rentimmoacademy",
    youtube: "https://youtube.com/@rentimmoacademy",
    tiktok: "https://tiktok.com/@rentimmoacademy",
  },
};
