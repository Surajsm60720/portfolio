import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/* Night ground, amber mark — the dark half of the palette, since a favicon
   sits against a browser chrome that is usually dark. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08090b",
          color: "#ffb454",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        S
      </div>
    ),
    size,
  );
}
