import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-end leading-none", className)}>
      <span className={cn("text-2xl font-extrabold tracking-[-0.03em]", dark ? "text-ink" : "text-white")}>
        rentimmo
      </span>
      <span className="mx-0.5 inline-block h-2 w-2 translate-y-[-2px] rounded-full bg-brand-green transition-transform duration-300 group-hover:scale-125" />
      <span
        className={cn(
          "ml-1 hidden text-[11px] font-bold uppercase tracking-[0.25em] sm:inline",
          dark ? "text-ink/50" : "text-white/55"
        )}
      >
        academy
      </span>
    </Link>
  );
}
