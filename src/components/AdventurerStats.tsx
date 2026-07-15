import { useState } from "react";
import { Adventurer, LootItem } from "../types";
import { Shield, Sparkles, Trophy, Backpack, Skull, Feather, Eye, Sparkle, Sword, Compass, BookOpen } from "lucide-react";

interface AdventurerStatsProps {
  adventurer: Adventurer;
  onClassChange: (newClass: string) => void;
}

export default function AdventurerStats({ adventurer, onClassChange }: AdventurerStatsProps) {
  const [selectedLoot, setSelectedLoot] = useState<LootItem | null>(null);

  const xpPercent = Math.min(100, Math.round((adventurer.xp / adventurer.nextLevelXp) * 100));

  const getClassIcon = (cls: string) => {
    switch (cls.toLowerCase()) {
      case "ranger":
        return <Compass className="w-6 h-6 text-emerald-400" />;
      case "wizard":
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      case "rogue":
        return <Eye className="w-6 h-6 text-stone-400" />;
      case "cleric":
        return <BookOpen className="w-6 h-6 text-amber-300" />;
      case "fighter":
      default:
        return <Sword className="w-6 h-6 text-rose-400" />;
    }
  };

  const getRarityClass = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "border-orange-500 bg-orange-950/20 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.3)]";
      case "epic":
        return "border-purple-500 bg-purple-950/20 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.3)]";
      case "rare":
        return "border-blue-500 bg-blue-950/20 text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.3)]";
      case "uncommon":
        return "border-green-500 bg-green-950/20 text-green-400";
      case "common":
      default:
        return "border-[#5c3b25] bg-stone-900/40 text-stone-300";
    }
  };

  return (
    <div id="adventurer-stats-panel" className="quest-card p-6 flex flex-col gap-6">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#5c3b25] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#1c100a] border border-[#CA8A04] rounded-[4px] shadow-[0_0_10px_rgba(202,138,4,0.15)] shrink-0">
            {getClassIcon(adventurer.class)}
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-quest-text tracking-wide">{adventurer.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-quest-muted">Select Calling:</span>
              <select
                id="class-selector"
                value={adventurer.class}
                onChange={(e) => onClassChange(e.target.value)}
                className="quest-select text-xs px-2 py-0.5 bg-[#1A0F0A] text-quest-primary font-heading font-medium border border-[#5c3b25] rounded-[2px]"
              >
                <option value="Ranger">Ranger of the Wilds</option>
                <option value="Fighter">Champion Fighter</option>
                <option value="Wizard">Arcane Wizard</option>
                <option value="Rogue">Shadow Rogue</option>
                <option value="Cleric">Acolyte Cleric</option>
              </select>
            </div>
          </div>
        </div>

        {/* Level Emblem */}
        <div className="flex items-center gap-3 bg-[#1A0F0A] border border-[#5c3b25] px-4 py-2 rounded-[4px] self-start md:self-auto">
          <div className="text-center">
            <p className="text-[10px] font-heading text-quest-muted uppercase tracking-wider">Ascension</p>
            <p className="text-lg font-heading font-bold text-quest-primary">LEVEL {adventurer.level}</p>
          </div>
        </div>
      </div>

      {/* Experience Track */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-heading text-quest-muted uppercase tracking-wider flex items-center gap-1">
            <Sparkle className="w-3.5 h-3.5 text-quest-primary animate-pulse" /> Adventurer Renown (XP)
          </span>
          <span className="font-mono font-bold text-quest-primary">
            {adventurer.xp} / {adventurer.nextLevelXp} XP
          </span>
        </div>
        <div className="quest-progress-track">
          <div className="quest-progress-fill" style={{ width: `${xpPercent}%` }} />
        </div>
      </div>

      {/* Stats Quick-Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#21130a] border border-[#4a2e1c]/40 p-3 rounded-[4px] flex flex-col gap-1">
          <span className="text-[10px] font-heading text-quest-muted uppercase tracking-wider flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> Coffers Wealth
          </span>
          <span className="text-lg font-mono font-bold text-amber-400">{adventurer.gold} Gold Pieces</span>
        </div>

        <div className="bg-[#21130a] border border-[#4a2e1c]/40 p-3 rounded-[4px] flex flex-col gap-1">
          <span className="text-[10px] font-heading text-quest-muted uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-quest-success" /> Guild Standing
          </span>
          <span className="text-lg font-mono font-bold text-quest-success">
            {adventurer.completedCount} Quests Logged
          </span>
        </div>
      </div>

      {/* Inventory Slot grid */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-xs uppercase text-quest-muted tracking-wider flex items-center gap-1.5">
          <Backpack className="w-4 h-4 text-quest-primary" /> Character Arsenal & Satchel ({adventurer.inventory.length}/8 Slots)
        </h3>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {Array.from({ length: 8 }).map((_, index) => {
            const item = adventurer.inventory[index];
            const isSlotOccupied = !!item;

            return (
              <div
                key={index}
                id={`inventory-slot-${index}`}
                onClick={() => isSlotOccupied && setSelectedLoot(item)}
                className={`aspect-square rounded-[4px] border border-dashed flex items-center justify-center cursor-pointer transition-all ${
                  isSlotOccupied
                    ? `${getRarityClass(item.rarity)} border-solid hover:scale-105 active:scale-95`
                    : "border-[#402717] bg-[#1a0f0a]/40 hover:bg-[#20130a] text-[#4d2c18]"
                }`}
                title={item ? `${item.name} (${item.rarity})` : "Empty Inventory Slot"}
              >
                {isSlotOccupied ? (
                  <span className="text-xl">
                    {item.rarity === "Legendary" ? "👑" : item.rarity === "Epic" ? "🔮" : item.rarity === "Rare" ? "🛡️" : item.rarity === "Uncommon" ? "🧪" : "🗡️"}
                  </span>
                ) : (
                  <span className="text-xs font-mono select-none">Ø</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Item Description */}
        {selectedLoot ? (
          <div id="relic-inspector" className="p-3 bg-[#1C100A] border border-[#5c3b25] rounded-[4px] flex flex-col gap-1.5 relative">
            <button
              onClick={() => setSelectedLoot(null)}
              className="absolute top-2 right-2 text-xs text-quest-muted hover:text-quest-text cursor-pointer"
            >
              ✕ Close
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-heading font-bold text-quest-primary">{selectedLoot.name}</span>
              <span className={`text-[9px] font-mono uppercase px-1 border rounded-[2px] ${getRarityClass(selectedLoot.rarity)}`}>
                {selectedLoot.rarity}
              </span>
            </div>
            <p className="text-xs italic text-quest-text leading-snug">{selectedLoot.description}</p>
          </div>
        ) : (
          <p className="text-xs text-quest-muted text-center italic py-2">
            Click any acquired relics inside the grid slots to inspect their magical enchantments and descriptions.
          </p>
        )}
      </div>
    </div>
  );
}
