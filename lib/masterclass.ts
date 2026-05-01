// LocalStorage key + threshold for the masterclass watch gate
export const MC_KEY = "rentimmo_mc_watched_v1";
export const MC_THRESHOLD = 0.7; // 70% watched unlocks the call CTA

// IMPORTANT: replace with your real YouTube video ID (the part after v= in the URL)
// e.g. https://www.youtube.com/watch?v=ABC123XYZ45 → ABC123XYZ45
export const MC_VIDEO_ID = "VIDEO_ID_HERE";

export const MC_TITLE = "Masterclass — Génère tes premiers revenus Airbnb sans crédit";

export function isMasterclassWatched(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(MC_KEY) === "1";
}

export function markMasterclassWatched() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MC_KEY, "1");
  window.dispatchEvent(new CustomEvent("mc-unlocked"));
}
