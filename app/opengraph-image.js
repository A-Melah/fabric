import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Joshua & Joy's Wedding";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f6f0",
      }}
    >
      <div
        style={{
          fontSize: 28,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: "#8b4f2c",
        }}
      >
        You're Invited
      </div>
      <div style={{ fontSize: 96, color: "#303727", marginTop: 20 }}>
        Joy &amp; Joshua
      </div>
      <div style={{ fontSize: 32, color: "#8b4f2c", marginTop: 20 }}>
        November 28, 2026
      </div>
    </div>,
    { ...size },
  );
}
