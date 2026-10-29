import "./motion.css";
import type { CSSProperties, ReactNode } from "react";

/** Bandeau défilant. Le 2e groupe est décoratif (aria-hidden) ; en reduced-motion il disparaît et le 1er passe à la ligne. */
export default function Marquee({
  items,
  separator = <span className="mo-pulse-dot" style={{ width: 6, height: 6, margin: "0 22px" }} aria-hidden />,
  speed = 38,
  className,
  itemClassName,
}: {
  items: ReactNode[];
  separator?: ReactNode;
  speed?: number;
  className?: string;
  itemClassName?: string;
}) {
  const group = (hidden: boolean) => (
    <div className="mo-marquee-group" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
          <span className={itemClassName}>{it}</span>
          {separator}
        </span>
      ))}
    </div>
  );
  return (
    <div className={`mo-marquee ${className || ""}`} style={{ "--mo-speed": `${speed}s` } as CSSProperties}>
      <div className="mo-marquee-track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
