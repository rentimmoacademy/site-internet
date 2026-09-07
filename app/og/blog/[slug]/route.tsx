import { ImageResponse } from "next/og";
import { getPost } from "@/lib/mdx";

export const runtime = "edge";

const categoryColors: Record<string, string> = {
  "sous-location": "#2DB84B",
  conciergerie:    "#1A6B33",
  cleaning:        "#5FD87A",
  maroc:           "#C97B2E",
  outils:          "#2563EB",
};

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  const title = post?.title ?? "Rentimmo Academy";
  const category = post?.category ?? "sous-location";
  const readTime = post?.readTime ?? "";
  const accentColor = categoryColors[category] ?? "#2DB84B";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          background: "#0F1113",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orb glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: accentColor,
            opacity: 0.15,
            filter: "blur(100px)",
          }}
        />

        {/* Brand tag */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "60px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: accentColor,
              color: "#0F1113",
              fontSize: "11px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              padding: "6px 14px",
              borderRadius: "100px",
            }}
          >
            Rentimmo Academy
          </div>
        </div>

        {/* Category pill */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
          }}
        >
          <div
            style={{
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}55`,
              color: accentColor,
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              padding: "5px 14px",
              borderRadius: "100px",
            }}
          >
            {category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? "38px" : "48px",
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "3px",
              background: accentColor,
              borderRadius: "2px",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
            rentimmoacademy.fr
          </span>
          {readTime && (
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>
              · {readTime} de lecture
            </span>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
