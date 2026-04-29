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
      className="group fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-green pl-4 pr-5 py-3 font-bold text-ink shadow-[0_10px_40px_rgba(45,184,75,0.45)] transition-transform hover:scale-105 md:py-3.5"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-ink text-green md:h-10 md:w-10">
        <CalendarCheck className="h-4 w-4 md:h-5 md:w-5" />
        <span className="absolute -inset-1 -z-10 animate-pulse-soft rounded-full bg-green/40" />
      </span>
      <span className="text-sm font-extrabold tracking-tight md:text-base">
        Réserver un call
      </span>
    </motion.a>
  );
}
