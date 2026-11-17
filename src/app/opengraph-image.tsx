import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} - Votre façade, comme au premier jour`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", padding: 80, color: "#1A1E24" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#1A1E24", display: "flex" }} />
          <div style={{ display: "flex" }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>Votre façade,</div>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>comme au premier jour.</div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#646A73" }}>Nettoyage, ravalement et peinture en Île-de-France</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ background: "#2A3FF5", color: "#fff", fontSize: 28, padding: "14px 28px", borderRadius: 999 }}>{`Devis gratuit sous ${site.quoteDelay}`}</div>
          <div style={{ background: "#EEF0F2", fontSize: 28, padding: "14px 28px", borderRadius: 999 }}>{site.phone}</div>
        </div>
      </div>
    ),
    size,
  );
}
