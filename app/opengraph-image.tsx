import { ImageResponse } from "next/og";
import { identity } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${identity.name} — ${identity.role}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090b",
          color: "#f5f2ec",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#ffb454",
          }}
        >
          {identity.location} · {identity.role}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -3 }}>
            {identity.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              lineHeight: 1.3,
              color: "rgba(245,242,236,0.66)",
              marginTop: 20,
              maxWidth: 900,
            }}
          >
            {identity.thesis}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, color: "rgba(245,242,236,0.42)" }}>
          surajmenon.vercel.app
        </div>
      </div>
    ),
    size,
  );
}
