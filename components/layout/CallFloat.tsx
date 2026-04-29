"use client";

import { CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function CallFloat() {
  return (
    <motion.a
      href="https://cal.com/rentimmo-academy/superbnbacademy?overlayCalendar=true"
      target="_blank"
      rel="noreferrer"
      aria-label="Réserver un appel d'audit gratuit"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, type: "spring" }}
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-ink pl-2 pr-5 py-2 font-bold text-white shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_0_2px_rgba(45,184,75,0.6)] ring-1 ring-brand-green/60 transition-all hover:scale-[1.04] hover:shadow-[0_12px_40px_rgba(45,184,75,0.55),0_0_0_2px_rgba(45,184,75,0.9)] md:bottom-6 md:right-6 md:pl-2.5 md:pr-6 md:py-2.5"
    >
      {/* Notification badge */}
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
    </motion.a>
  );
}
