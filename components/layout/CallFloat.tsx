"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { CallGateDialog } from "@/components/CallGate";

export default function CallFloat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isSuperBnb = pathname?.startsWith("/super-bnb-academy") ?? false;
  const href = isSuperBnb
    ? "https://cal.com/rentimmo-academy/superbnbacademy?overlayCalendar=true"
    : "https://cal.com/rentimmo-academy/appel-strategique?overlayCalendar=true";

  // Super BnB audit = no gate (direct link). Strategic call = gated.
  const handleClick = () => {
    if (isSuperBnb) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleClick}
        aria-label="Réserver un appel"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, type: "spring" }}
        className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-ink pl-2 pr-5 py-2 font-bold text-white shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_0_2px_rgba(45,184,75,0.6)] ring-1 ring-brand-green/60 transition-all hover:scale-[1.04] hover:shadow-[0_12px_40px_rgba(45,184,75,0.55),0_0_0_2px_rgba(45,184,75,0.9)] md:bottom-6 md:right-6 md:pl-2.5 md:pr-6 md:py-2.5"
      >
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-alert opacity-70" />
          <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-alert text-[11px] font-extrabold text-white ring-2 ring-ink">
            1
          </span>
        </span>

        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-ink md:h-11 md:w-11">
          <CalendarCheck className="h-5 w-5" strokeWidth={2.6} />
          <span className="absolute -inset-1 -z-10 animate-pulse-soft rounded-full bg-brand-green/50" />
        </span>
        <span className="text-sm font-extrabold tracking-tight md:text-[15px]">
          Réserver un call
        </span>
      </motion.button>

      <CallGateDialog open={open} onClose={() => setOpen(false)} href={href} />
    </>
  );
}
