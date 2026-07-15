/**
 * Procedural Audio Synthesizer for medieval RPG audio feedback
 * Uses browser Web Audio API to construct synthetic tones without any external assets.
 */

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
}

// Retro Gold coin sound effect
export function playGoldChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = "sine";
  osc2.type = "triangle";

  // Gold sparkle double-note chime
  osc1.frequency.setValueAtTime(987.77, now); // B5
  osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

  osc2.frequency.setValueAtTime(493.88, now); // B4
  osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);

  osc1.stop(now + 0.45);
  osc2.stop(now + 0.45);
}

// Ascension Level Up epic fan-fare chord
export function playLevelUpFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
  gain.connect(ctx.destination);

  // Arpeggio notes representing epic heroic ascension
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, now + idx * 0.12);
    
    // Subtle lowpass filter to make it sound vintage brassy rather than harsh buzzer
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, now);

    osc.connect(filter);
    filter.connect(gain);
    
    osc.start(now + idx * 0.12);
    osc.stop(now + 1.2);
  });
}

// Combat strike metal sword clink sound
export function playSwordClink() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

  // Add noise high-frequency layer for metallic scrape
  const oscNoise = ctx.createOscillator();
  oscNoise.type = "sine";
  oscNoise.frequency.setValueAtTime(2400, now);
  
  const gainNoise = ctx.createGain();
  gainNoise.gain.setValueAtTime(0.1, now);
  gainNoise.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  oscNoise.connect(gainNoise);
  gainNoise.connect(ctx.destination);

  osc.start(now);
  oscNoise.start(now);

  osc.stop(now + 0.2);
  oscNoise.stop(now + 0.2);
}

// Spell/Conjure sound effect
export function playSpellConjure() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  // Pitch slide upward
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);

  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.65);
}
