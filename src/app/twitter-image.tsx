import { ImageResponse } from "next/og";

export const alt = "SmartGiftMatch — find the perfect gift in under a minute";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#fbf7f1", color: "#1d1b18", fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 34, fontWeight: 700, display: "flex" }}>
          SmartGift<span style={{ color: "#e5533d" }}>Match</span>
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.05, marginTop: 36, maxWidth: 900 }}>Gifts that feel like you really know them.</div>
        <div style={{ fontSize: 32, marginTop: 36, color: "#6b645a" }}>5 questions · 3 perfect picks · free</div>
        <div style={{ position: "absolute", right: -80, top: -80, width: 380, height: 380, borderRadius: 400, background: "#fbe3dc" }} />
        <div style={{ position: "absolute", right: 120, bottom: -120, width: 300, height: 300, borderRadius: 300, background: "#dcefe5" }} />
      </div>
    ),
    size,
  );
}
