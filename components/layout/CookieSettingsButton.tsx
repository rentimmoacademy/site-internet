"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

/** Lien « Gérer mes cookies » : rouvre le bandeau de consentement. */
export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className={className}
    >
      Gérer mes cookies
    </button>
  );
}
