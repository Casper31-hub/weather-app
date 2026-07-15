import { useState } from "react";
import WeatherForecastWidget from "./components/WeatherForecastWidget";
import { playSpellConjure } from "./utils/audio";
import { Volume2, VolumeX, Flame } from "lucide-react";

export default function App() {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      playSpellConjure();
    }
  };

  return (
    <div id="quest-app-scaffold" className="min-h-screen bg-[#1A0F0A] text-[#F5E6D3] flex flex-col relative overflow-x-hidden font-sans">
      {/* Decorative background grids/details */}
      <div className="absolute inset-0 bg-[radial-gradient(#2C1A10_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* IMMERSIVE HEADER (THE CHRONICLER) */}
      <header id="tavern-header" className="bg-[#2C1A10] border-b-2 border-[#CA8A04] shadow-[0_4px_20px_rgba(0,0,0,0.8)] relative z-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl uppercase tracking-widest text-[#CA8A04] font-heading font-bold" style={{ textShadow: "0 0 12px rgba(202, 138, 4, 0.4)" }}>
              The Chronicler
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] ml-1 text-[#BFA98A] font-heading mt-1">
              Celestial Weather Augury Interface v4.0.2
            </p>
          </div>

          <div className="flex gap-6 items-center">
            {/* Audio Feedback Toggle */}
            <button
              id="audio-mute-toggle"
              onClick={toggleMute}
              className="quest-btn-outline p-2 hover:bg-[#3d2417] flex items-center justify-center"
              title={isMuted ? "Unmute Spell Audio" : "Mute Spell Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-[#BFA98A]" /> : <Volume2 className="w-4 h-4 text-[#CA8A04]" />}
            </button>

            {/* Hero Badge */}
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "#BFA98A" }}>Hero Status</div>
              <div className="text-lg font-heading tracking-tight text-[#F5E6D3]">Sir Alistair Thorne</div>
            </div>

            <div className="w-11 h-11 rounded-sm border border-[#CA8A04] bg-[#1A0F0A] flex items-center justify-center shadow-[0_0_10px_rgba(202,138,4,0.2)]">
              <div className="w-6 h-6 bg-[#CA8A04] rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 text-[#1A0F0A]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CORE LAYOUT - CENTERED PRIMARY CONTENT */}
      <main id="app-content-stage" className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-10 flex flex-col justify-center gap-8 relative z-10">
        {/* Real-time Celestial Weather Forecast Auguries */}
        <div className="w-full">
          <WeatherForecastWidget />
        </div>
      </main>

      {/* FOOTER */}
      <footer id="tavern-footer" className="bg-[#1C100A] border-t border-[#CA8A04]/20 py-6 text-[10px] uppercase tracking-[0.2em] text-[#BFA98A]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 font-heading text-center md:text-left">
          <div>Session Time: 04:12:09</div>
          <div>Location: Silverpine Tavern</div>
          <div>Region: Northern Realms</div>
        </div>
      </footer>
    </div>
  );
}
