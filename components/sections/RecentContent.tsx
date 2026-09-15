import Link from "next/link";
import Image from "next/image";
import { Play, Instagram, Youtube, ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { getLatestVideos } from "@/lib/youtube";

const IG_URL = "https://www.instagram.com/rentimmo_academy/";
const YT_URL = "https://www.youtube.com/@rentimmoacademy";

export default async function RecentContent() {
  const videos = await getLatestVideos(3);

  return (
    <section className="relative bg-white py-28 text-ink">
      <div className="container-x">
        <SectionHeader
          tag="En vidéo"
          title={
            <>
              Nos derniers posts,{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">en direct.</span>
            </>
          }
          subtitle="Ce qu'on partage cette semaine sur YouTube et Instagram."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {videos.map((v) => (
            <a
              key={v.videoId}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-ink"
            >
              <div className="relative aspect-[9/13]">
                <Image
                  src={v.thumbnail}
                  alt={v.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                  <Play size={14} fill="currentColor" />
                </span>
                <p className="absolute bottom-4 left-4 right-4 line-clamp-3 text-sm font-bold leading-snug text-white">
                  {v.title}
                </p>
              </div>
            </a>
          ))}

          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex aspect-[9/13] flex-col items-center justify-center gap-4 rounded-3xl border border-ink/10 bg-cream p-6 text-center transition-colors hover:bg-brand-green/10"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green/15 text-brand-green ring-1 ring-brand-green/30">
              <Instagram size={24} strokeWidth={2.2} />
            </span>
            <p className="text-sm font-bold text-ink">@rentimmo_academy</p>
            <p className="text-xs text-ink/60">Le quotidien de l'academy en coulisses.</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-dark transition-transform group-hover:translate-x-1">
              Suivre <ArrowUpRight size={12} />
            </span>
          </a>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href={YT_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost-dark">
            <Youtube size={16} /> Voir toutes nos vidéos
          </Link>
        </div>
      </div>
    </section>
  );
}
