import { useState, FormEvent } from "react";
import { Quest } from "../types";
import { Sparkles, RefreshCw, Feather, Flame, Shield, HelpCircle, AlertCircle, Wand2 } from "lucide-react";

interface WizardGeneratorProps {
  onQuestGenerated: (newQuest: Quest) => void;
}

const CONJURE_MESSAGES = [
  "Mixing the dragon blood ink...",
  "Whispering arcane incantations...",
  "Consulting the celestial star-alignments...",
  "Sealing the parchment with dark wax...",
  "Bribing the local sewer imps for rumors...",
  "Chanting protection runes over the quill...",
];

export default function WizardGenerator({ onQuestGenerated }: WizardGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Monster Hunt");
  const [difficulty, setDifficulty] = useState("Journeyman");
  const [adventurerClass, setAdventurerClass] = useState("Ranger");
  const [seedIdea, setSeedIdea] = useState("");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoadingMsgIdx(0);

    // Dynamic messaging interval
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % CONJURE_MESSAGES.length);
    }, 1500);

    try {
      const response = await fetch("/api/quests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questType: category,
          difficulty,
          location: "Tavern Guild Board",
          adventurerClass,
          seedIdea: seedIdea.trim() || "A mysterious glowing glyph in the woods"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to conjure quest. Check that your GEMINI_API_KEY is configured.");
      }

      const questData = await response.json();
      
      // Map server response to exact local Quest structure with unique ID
      const newQuest: Quest = {
        id: `q-gen-${Date.now()}`,
        title: questData.title || "The Unnamed Riddle of Whispering Pines",
        giver: questData.giver || "Tavern Barkeep",
        synopsis: questData.synopsis || "A mysterious assignment left in the dead of night.",
        story: questData.story || "A blank parchment was left pinned to the tavern doors, thrumming with raw mystical aura...",
        requirements: questData.requirements || ["Level 3+", "Keen Sense of Sight"],
        objectives: (questData.objectives || []).map((obj: any) => ({
          text: obj.text || "Investigate the strange noises",
          currentCount: 0,
          targetCount: obj.targetCount || 1,
          type: obj.type || "Investigation"
        })),
        rewards: {
          gold: questData.rewards?.gold || 150,
          xp: questData.rewards?.xp || 400,
          lootItem: {
            name: questData.rewards?.lootItem?.name || "Rusty Broadsword",
            rarity: questData.rewards?.lootItem?.rarity || "Common",
            description: questData.rewards?.lootItem?.description || "A standard blade worn down by elements."
          }
        },
        difficultyBadgeColor: questData.difficultyBadgeColor || "primary",
        guildDepartment: questData.guildDepartment || "The Ranger Conclave",
        status: "Available"
      };

      onQuestGenerated(newQuest);
      setSeedIdea(""); // Reset
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "The magic channels are congested. Attempt again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const presetSeeds = [
    "A legendary red drake nesting on the iron mine shaft",
    "Strange, glowing runes pulsating along the river banks",
    "A noble merchant's daughter kidnapped by rogue goblin bards",
    "Missing ancient scrolls containing cosmic starmap constellations",
  ];

  return (
    <div id="wizard-generator-panel" className="quest-card p-6 flex flex-col gap-6 relative overflow-hidden">
      {/* Background Arcane Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="border-b border-[#5c3b25] pb-3">
        <h2 className="text-xl font-heading font-bold text-quest-primary tracking-wide flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-quest-primary animate-pulse" /> Arcane Quest Weaver
        </h2>
        <p className="text-xs text-quest-muted mt-1 leading-snug">
          Harness the cosmic intelligence of **Gemini 3.5-Flash** to summon custom, high-lore covenants directly onto the guildboard.
        </p>
      </div>

      {loading ? (
        <div id="conjuring-loader" className="py-12 flex flex-col items-center justify-center gap-6 min-h-[300px]">
          <div className="relative">
            <Flame className="w-12 h-12 text-quest-primary animate-bounce" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-dashed border-quest-primary animate-spin" />
          </div>
          <div className="text-center flex flex-col gap-1.5">
            <p className="font-heading text-lg text-quest-primary tracking-wider animate-pulse">
              CONJURING THE SCROLL COVENANT...
            </p>
            <p className="text-xs text-quest-muted font-mono italic">
              {CONJURE_MESSAGES[loadingMsgIdx]}
            </p>
          </div>
        </div>
      ) : (
        <form id="wizard-form" onSubmit={handleGenerate} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading text-quest-muted uppercase tracking-wider">Quest Category</label>
              <select
                id="wizard-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="quest-select p-2.5 text-sm w-full"
              >
                <option value="Monster Hunt">⚔️ Monster Hunt</option>
                <option value="Arcane Retrieval">🔮 Arcane Retrieval</option>
                <option value="Diplomatic Treaty">📜 Diplomatic Treaty</option>
                <option value="Bounty Hunt">🎯 Outlaw Bounty Hunt</option>
                <option value="Dungeon Raiding">🛡️ Dungeon Raiding</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading text-quest-muted uppercase tracking-wider">Danger Tier</label>
              <select
                id="wizard-danger"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="quest-select p-2.5 text-sm w-full"
              >
                <option value="Apprentice">Safe (Apprentice)</option>
                <option value="Journeyman">Vulnerable (Journeyman)</option>
                <option value="Master">Perilous (Master)</option>
                <option value="Legendary">Calamity (Legendary)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading text-quest-muted uppercase tracking-wider">Target Adventurer</label>
              <select
                id="wizard-class"
                value={adventurerClass}
                onChange={(e) => setAdventurerClass(e.target.value)}
                className="quest-select p-2.5 text-sm w-full"
              >
                <option value="Ranger">Ranger of the Woods</option>
                <option value="Fighter">Heavily Armored Fighter</option>
                <option value="Wizard">Elemental Spellcaster</option>
                <option value="Rogue">Silent Assassin Rogue</option>
                <option value="Cleric">Holy Light Cleric</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-heading text-quest-muted uppercase tracking-wider">
                Arcane Seeds & Keywords (Optional)
              </label>
              <span className="text-[10px] text-quest-muted">Specify details for custom flavor</span>
            </div>
            <textarea
              id="wizard-seed-textarea"
              value={seedIdea}
              onChange={(e) => setSeedIdea(e.target.value)}
              placeholder="e.g. A cursed artifact in a sunken elven shipwreck guarding by marine skeletons..."
              rows={2}
              className="quest-input p-3 text-sm w-full resize-none"
              maxLength={200}
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-heading text-quest-muted uppercase tracking-wider">Seed Inspiration:</span>
            <div className="flex flex-wrap gap-2">
              {presetSeeds.map((seed, idx) => (
                <button
                  key={idx}
                  id={`preset-seed-${idx}`}
                  type="button"
                  onClick={() => setSeedIdea(seed)}
                  className="bg-[#1D1109] border border-[#4d2f19] text-quest-muted text-[11px] px-2.5 py-1 rounded-[2px] hover:text-quest-primary hover:border-quest-primary transition-colors text-left"
                >
                  {seed}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div id="wizard-error-banner" className="flex items-start gap-2 bg-[#421313] border border-rose-500/30 p-3 rounded-[4px] text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Incantation Fractured:</span> {error}
                <p className="mt-1 text-[11px] opacity-80">
                  Configure your **GEMINI_API_KEY** via {"Settings > Secrets"} in AI Studio or check container connectivity.
                </p>
              </div>
            </div>
          )}

          <button
            id="conjure-submit-btn"
            type="submit"
            className="quest-btn-primary py-3.5 px-6 text-sm flex items-center justify-center gap-2 mt-2"
          >
            <Sparkles className="w-4 h-4 text-black animate-spin" /> Channel Spell & Pin Custom Quest
          </button>
        </form>
      )}
    </div>
  );
}
