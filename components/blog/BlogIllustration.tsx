import { Check, AlertTriangle, BookOpen, Newspaper, GraduationCap, ArrowRight } from "lucide-react";

const ICONS = {
  legal: AlertTriangle,
  news: Newspaper,
  education: GraduationCap,
  checklist: Check,
  comparison: ArrowRight,
  cta: BookOpen,
};

const COLORS = {
  legal: { bg: "bg-amber-50 border-amber-200", icon: "text-amber-600 bg-amber-100", label: "text-amber-700" },
  news: { bg: "bg-sky-50 border-sky-200", icon: "text-sky-600 bg-sky-100", label: "text-sky-700" },
  education: { bg: "bg-brand-green/5 border-brand-green/20", icon: "text-brand-green bg-brand-green/10", label: "text-brand-green" },
  checklist: { bg: "bg-brand-green/5 border-brand-green/20", icon: "text-brand-green bg-brand-green/10", label: "text-brand-green" },
  comparison: { bg: "bg-ink/5 border-ink/10", icon: "text-ink bg-ink/10", label: "text-ink" },
  cta: { bg: "bg-brand-green/5 border-brand-green/20", icon: "text-brand-green bg-brand-green/10", label: "text-brand-green" },
};

type IllustrationType = keyof typeof ICONS;

interface BlogIllustrationProps {
  type: IllustrationType;
  label: string;
  items?: string[];
}

export default function BlogIllustration({ type, label, items }: BlogIllustrationProps) {
  const Icon = ICONS[type] ?? BookOpen;
  const colors = COLORS[type] ?? COLORS.education;

  if ((type === "checklist" || type === "comparison") && items?.length) {
    return (
      <div className={`not-prose my-8 rounded-2xl border ${colors.bg} p-6`}>
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors.icon}`}>
            <Icon size={16} />
          </div>
          <p className={`text-sm font-bold ${colors.label}`}>{label}</p>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink/80">
              <Check size={14} className={`mt-0.5 flex-shrink-0 ${colors.label}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (type === "cta") {
    return (
      <div className={`not-prose my-8 rounded-2xl border ${colors.bg} p-6`}>
        <div className="flex items-start gap-4 md:items-center">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${colors.icon}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className={`font-bold ${colors.label}`}>{label}</p>
            <p className="mt-1 text-sm text-ink/60">Découvre la Sous-Location Academy →</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`not-prose my-8 flex items-center gap-4 rounded-2xl border ${colors.bg} px-6 py-4`}>
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${colors.icon}`}>
        <Icon size={20} />
      </div>
      <p className={`text-sm font-bold ${colors.label}`}>{label}</p>
    </div>
  );
}
