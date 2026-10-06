import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Franca & Abanum's Wedding";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PETALS = [0, 72, 144, 216, 288];

function Blossom({ px, color }) {
  return (
    <svg width={px} height={px} viewBox="0 0 100 100">
      {PETALS.map((r) => (
        <ellipse
          key={r}
          cx="50"
          cy="27"
          rx="14"
          ry="23"
          fill={color}
          transform={`rotate(${r} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="8" fill="#d4a937" />
    </svg>
  );
}

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundImage: "linear-gradient(135deg, #6a45a6 0%, #3e2570 100%)",
      }}
    >
      {/* decorative blossoms */}
      <div
        style={{
          position: "absolute",
          top: -90,
          left: -90,
          display: "flex",
          opacity: 0.35,
        }}
      >
        <Blossom px={380} color="#d9cbee" />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -110,
          right: -90,
          display: "flex",
          opacity: 0.35,
        }}
      >
        <Blossom px={420} color="#f6e3a1" />
      </div>

      {/* thin gold frame */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          right: 28,
          bottom: 28,
          border: "2px solid #d4a937",
          borderRadius: 24,
          display: "flex",
        }}
      />

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#f6e3a1",
          }}
        >
          You&apos;re Invited
        </div>
        <div
          style={{
            fontSize: 100,
            color: "#ffffff",
            marginTop: 24,
            display: "flex",
          }}
        >
          Franca &amp; Abanum
        </div>
        <div style={{ fontSize: 34, color: "#e9c46a", marginTop: 24 }}>
          December 12, 2026
        </div>
      </div>
    </div>,
    { ...size },
  );
}
