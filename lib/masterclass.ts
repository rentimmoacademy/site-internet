// LocalStorage key + threshold for the masterclass watch gate
export const MC_KEY = "rentimmo_mc_watched_v1";
export const MC_THRESHOLD = 0.5; // 50% watched unlocks the call CTA

// YouTube video ID (the part after v= or after youtu.be/)
// https://youtu.be/QyzwMPk_4yY → QyzwMPk_4yY
export const MC_VIDEO_ID = "QyzwMPk_4yY";

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
