import { ReactNode } from "react";

type Props = {
  kicker?: string;
  title: string;
  intro?: string;
  bg?: "cream" | "white" | "ink";
  children: ReactNode;
};

export default function LandingSection({ kicker, title, intro, bg = "cream", children }: Props) {
  const bgCls =
    bg === "ink"
      ? "bg-ink text-cream"
      : bg === "white"
      ? "bg-white text-ink"
      : "bg-cream text-ink";

  const kickerColor = bg === "ink" ? "text-brand-light" : "text-brand-dark";
  const introColor = bg === "ink" ? "text-cream/80" : "text-ink-muted";

  return (
    <section className={`${bgCls} py-20 md:py-28`}>
      <div className="container-x">
        <div className="mb-12 max-w-3xl">
          {kicker && (
            <span className={`text-sm font-bold uppercase tracking-wider ${kickerColor}`}>
              {kicker}
            </span>
          )}
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {intro && <p className={`mt-4 text-lg ${introColor}`}>{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
