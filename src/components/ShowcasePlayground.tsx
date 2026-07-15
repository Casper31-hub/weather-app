import { useState } from "react";
import { Check, Copy, Code, Eye, RefreshCw, Palette, Layers, Award } from "lucide-react";

export default function ShowcasePlayground() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [customButtonText, setCustomButtonText] = useState("Slay the Beast");
  const [badgeState, setBadgeState] = useState<"primary" | "secondary" | "accent" | "success">("primary");
  const [glowPower, setGlowPower] = useState(50);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const colors = [
    { name: "Background", hex: "#1A0F0A", desc: "Base dark canvas", cls: "bg-[#1A0F0A]" },
    { name: "Surface", hex: "#2C1A10", desc: "Layered card backing", cls: "bg-[#2C1A10]" },
    { name: "Primary (Gold)", hex: "#CA8A04", desc: "Interactive/Accents/Borders", cls: "bg-[#CA8A04] text-black" },
    { name: "Secondary (Red)", hex: "#991B1B", desc: "Combat triggers/Hostile UI", cls: "bg-[#991B1B]" },
    { name: "Accent (Purple)", hex: "#581C87", desc: "Arcane/Quest Logs", cls: "bg-[#581C87]" },
    { name: "Success (Green)", hex: "#22C55E", desc: "Reward states/Ascensions", cls: "bg-[#22C55E] text-black" },
    { name: "Text (Parchment)", hex: "#F5E6D3", desc: "Standard high contrast text", cls: "bg-[#F5E6D3] text-black" },
    { name: "Muted Text (Sand)", hex: "#BFA98A", desc: "Chronicles and secondary lore", cls: "bg-[#BFA98A] text-black" },
  ];

  const typographyExamples = [
    { label: "Display Title (Cinzel)", font: "font-heading text-xl uppercase tracking-wider", text: "STRIKE OF THE DRAGON" },
    { label: "Body Reading (Spectral)", font: "font-sans text-base leading-relaxed italic", text: "The path is fraught with ancient shadows, young traveler." },
    { label: "Codex & Values (Fira Code)", font: "font-mono text-xs text-quest-primary", text: "GOLD_VALUE = 420; // 16-bit uint" },
  ];

  return (
    <div id="showcase-playground-root" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Design Foundations Panel */}
      <div id="foundations-col" className="xl:col-span-5 flex flex-col gap-6">
        {/* Colors Palette Box */}
        <div className="quest-card p-6 flex flex-col gap-4">
          <h3 className="font-heading text-sm text-quest-primary uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4" /> Hex Color Foundations
          </h3>
          <p className="text-xs text-quest-muted">
            The QuestUI palette uses rich, warm earth tones to create high-contrast medieval immersion.
          </p>

          <div className="flex flex-col gap-2">
            {colors.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-[4px] border border-[#5c3b25]/40 bg-[#1c100a]"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[4px] border border-black/40 shrink-0 ${c.cls}`} />
                  <div>
                    <p className="text-xs font-bold text-quest-text">{c.name}</p>
                    <p className="text-[10px] text-quest-muted">{c.desc}</p>
                  </div>
                </div>
                <button
                  id={`copy-hex-${idx}`}
                  onClick={() => copyToClipboard(c.hex, `hex-${idx}`)}
                  className="quest-btn-outline px-2 py-1 text-[10px] font-mono flex items-center gap-1 shrink-0"
                >
                  {copiedText === `hex-${idx}` ? <Check className="w-3 h-3 text-quest-success" /> : <Copy className="w-3 h-3" />}
                  {c.hex}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Typography Standards */}
        <div className="quest-card p-6 flex flex-col gap-4">
          <h3 className="font-heading text-sm text-quest-primary uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4" /> Codex Typography
          </h3>

          <div className="flex flex-col gap-4">
            {typographyExamples.map((ex, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#1C100A] border border-[#5c3b25]/50 rounded-[4px] flex flex-col gap-1"
              >
                <span className="text-[10px] font-heading text-quest-muted tracking-wider uppercase">
                  {ex.label}
                </span>
                <p className={`${ex.font} text-quest-text mt-1`}>{ex.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component Sandbox (Right) */}
      <div id="sandbox-col" className="xl:col-span-7 flex flex-col gap-6">
        {/* Interactive Button sandbox */}
        <div className="quest-card p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-[#5c3b25] pb-2">
            <h3 className="font-heading text-sm text-quest-primary uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" /> Interactive Buttons Sandbox
            </h3>
            <span className="text-[10px] font-mono text-quest-muted">Tailwind v4 Compliant</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 flex flex-col gap-2 w-full">
              <label className="text-xs text-quest-muted">Custom Button Label:</label>
              <input
                id="btn-label-input"
                type="text"
                value={customButtonText}
                onChange={(e) => setCustomButtonText(e.target.value)}
                maxLength={25}
                className="quest-input px-3 py-2 text-sm w-full"
              />
            </div>

            <div className="flex-1 flex flex-col gap-2 w-full">
              <label className="text-xs text-quest-muted">Outer Glow Potency (%):</label>
              <input
                id="btn-glow-slider"
                type="range"
                min="0"
                max="100"
                value={glowPower}
                onChange={(e) => setGlowPower(Number(e.target.value))}
                className="w-full accent-quest-primary h-1 bg-[#1A0F0A] rounded-lg appearance-none cursor-pointer border border-[#5c3b25]"
              />
            </div>
          </div>

          {/* Render Block */}
          <div className="p-4 bg-[#1e110a] border border-[#5c3b25] rounded-[4px] flex flex-col gap-4">
            <p className="text-[10px] font-heading text-quest-muted uppercase tracking-wider">Live Preview</p>

            <div className="flex flex-wrap justify-center gap-4 py-4">
              <button
                id="showcase-btn-primary"
                className="quest-btn-primary px-5 py-2.5 text-xs shadow-md"
                style={{
                  boxShadow: `0 4px ${glowPower / 4}px rgba(202, 138, 4, ${glowPower / 100})`,
                }}
              >
                {customButtonText || "Forge Alliance"}
              </button>

              <button
                id="showcase-btn-secondary"
                className="quest-btn-secondary px-5 py-2.5 text-xs shadow-md"
                style={{
                  boxShadow: `0 4px ${glowPower / 4}px rgba(153, 27, 27, ${glowPower / 100})`,
                }}
              >
                {customButtonText || "Cast Fireball"}
              </button>

              <button id="showcase-btn-outline" className="quest-btn-outline px-5 py-2.5 text-xs">
                {customButtonText || "Flee Field"}
              </button>
            </div>

            {/* Code Box */}
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-quest-muted font-mono uppercase">Primary Button HTML/Classes:</span>
                <button
                  id="copy-class-btn"
                  onClick={() =>
                    copyToClipboard(
                      `<button class="quest-btn-primary px-5 py-2.5 text-xs shadow-md">${customButtonText}</button>`,
                      "btn-classes"
                    )
                  }
                  className="quest-btn-outline px-2 py-0.5 text-[9px] flex items-center gap-1"
                >
                  {copiedText === "btn-classes" ? <Check className="w-2.5 h-2.5 text-quest-success" /> : <Copy className="w-2.5 h-2.5" />}
                  Copy Code
                </button>
              </div>
              <code className="bg-[#130a06] border border-[#402717] p-2 rounded-[4px] text-[11px] font-mono text-quest-primary select-all break-all block leading-normal">
                {`<button class="quest-btn-primary px-5 py-2.5 text-xs shadow-md">${customButtonText}</button>`}
              </code>
            </div>
          </div>
        </div>

        {/* Dynamic Badge States & Progress demo */}
        <div className="quest-card p-6 flex flex-col gap-6">
          <h3 className="font-heading text-sm text-quest-primary uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4" /> Badge Status States
          </h3>

          <div className="flex flex-wrap gap-2 p-2 bg-[#23140c] border border-[#5c3b25] rounded-[4px]">
            {(["primary", "secondary", "accent", "success"] as const).map((b) => (
              <button
                key={b}
                id={`badge-demo-${b}`}
                onClick={() => setBadgeState(b)}
                className={`flex-1 py-1 px-3 text-xs font-heading rounded-[2px] transition-all cursor-pointer ${
                  badgeState === b
                    ? "bg-quest-primary text-quest-bg font-bold"
                    : "text-quest-muted hover:text-quest-text hover:bg-quest-surface/30"
                }`}
              >
                {b.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="p-4 bg-[#1e110a] border border-[#5c3b25] rounded-[4px] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-quest-text font-semibold">Active Bounty Tag</span>
              <span
                className={`text-xs font-mono px-3 py-1 border rounded-[2px] ${
                  badgeState === "success"
                    ? "border-emerald-700 text-emerald-400 bg-emerald-950/40"
                    : badgeState === "secondary"
                    ? "border-rose-700 text-rose-400 bg-rose-950/40"
                    : badgeState === "accent"
                    ? "border-purple-700 text-purple-400 bg-purple-950/40"
                    : "border-amber-700 text-amber-400 bg-amber-950/40"
                }`}
              >
                {badgeState === "primary"
                  ? "APPRENTICE"
                  : badgeState === "secondary"
                  ? "LEGENDARY"
                  : badgeState === "accent"
                  ? "MYSTICAL"
                  : "SAFEWOOD"}
              </span>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[10px] text-quest-muted font-mono uppercase">Badge Class Definitions:</span>
              <code className="bg-[#130a06] border border-[#402717] p-2 rounded-[4px] text-[11px] font-mono text-quest-primary break-all block leading-normal select-all">
                {badgeState === "success"
                  ? 'border-emerald-700/80 text-emerald-400 bg-emerald-950/40'
                  : badgeState === "secondary"
                  ? 'border-rose-700/80 text-rose-400 bg-rose-950/40'
                  : badgeState === "accent"
                  ? 'border-purple-700/80 text-purple-400 bg-purple-950/40'
                  : 'border-amber-700/80 text-amber-400 bg-amber-950/40'}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
