export type YoutubeVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
};

const CHANNEL_ID = "UCuKnW8o4NSWAh5Mun1Ch7Gg";

function decodeHtml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function getLatestVideos(limit = 3): Promise<YoutubeVideo[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);

    return entries
      .slice(0, limit)
      .map((entry) => {
        const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
        const title = entry.match(/<media:title>(.*?)<\/media:title>/)?.[1] ?? "";
        const thumbnail = entry.match(/<media:thumbnail url="(.*?)"/)?.[1] ?? "";
        const publishedAt = entry.match(/<published>(.*?)<\/published>/)?.[1] ?? "";
        return {
          videoId,
          title: decodeHtml(title),
          thumbnail,
          publishedAt,
          url: `https://www.youtube.com/watch?v=${videoId}`,
        };
      })
      .filter((v) => v.videoId);
  } catch {
    return [];
  }
}
