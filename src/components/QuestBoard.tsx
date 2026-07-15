import { useState } from "react";
import { Quest, QuestObjective } from "../types";
import { Shield, Sparkles, Trophy, Backpack, Skull, Feather, Eye, Compass, Hourglass, CheckCircle } from "lucide-react";

interface QuestBoardProps {
  quests: Quest[];
  onAcceptQuest: (id: string) => void;
  onProgressObjective: (questId: string, objectiveIndex: number) => void;
  onClaimRewards: (id: string) => void;
}

export default function QuestBoard({
  quests,
  onAcceptQuest,
  onProgressObjective,
  onClaimRewards,
}: QuestBoardProps) {
  const [filter, setFilter] = useState<"All" | "Available" | "Active" | "Completed">("All");
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  const filteredQuests = quests.filter((q) => {
    if (filter === "All") return true;
    if (filter === "Available") return q.status === "Available";
    if (filter === "Active") return q.status === "Active";
    if (filter === "Completed") return q.status === "Completed" || q.status === "Claimed";
    return true;
  });

  const selectedQuest = quests.find((q) => q.id === selectedQuestId) || quests[0];

  // Set default selection if none selected
  if (!selectedQuestId && filteredQuests.length > 0) {
    setSelectedQuestId(filteredQuests[0].id);
  }

  const getDifficultyBadge = (color: string) => {
    switch (color) {
      case "success":
        return "border-emerald-700/80 text-emerald-400 bg-emerald-950/40 shadow-[0_0_10px_rgba(34,197,94,0.15)]";
      case "secondary":
        return "border-rose-700/80 text-rose-400 bg-rose-950/40 shadow-[0_0_10px_rgba(239,68,68,0.15)]";
      case "accent":
        return "border-purple-700/80 text-purple-400 bg-purple-950/40 shadow-[0_0_10px_rgba(168,85,247,0.15)]";
      case "primary":
      default:
        return "border-amber-700/80 text-amber-400 bg-amber-950/40 shadow-[0_0_10px_rgba(202,138,4,0.15)]";
    }
  };

  const getObjectiveIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "combat":
        return <Skull className="w-4 h-4 text-rose-500 mr-2 shrink-0" />;
      case "gathering":
        return <Feather className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />;
      case "investigation":
        return <Eye className="w-4 h-4 text-cyan-400 mr-2 shrink-0" />;
      default:
        return <Compass className="w-4 h-4 text-amber-400 mr-2 shrink-0" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "text-orange-400 font-bold gold-glow border-orange-600 bg-orange-950/20";
      case "epic":
        return "text-purple-400 font-bold border-purple-600 bg-purple-950/20";
      case "rare":
        return "text-blue-400 font-semibold border-blue-600 bg-blue-950/20";
      case "uncommon":
        return "text-green-400 border-green-600 bg-green-950/20";
      case "common":
      default:
        return "text-stone-300 border-stone-700 bg-stone-900/20";
    }
  };

  return (
    <div id="quest-board-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: Quest list and filters */}
      <div id="quest-list-column" className="lg:col-span-5 flex flex-col gap-6">
        {/* Filter Scroll buttons */}
        <div id="board-filters" className="flex items-center gap-2 p-2 bg-[#23140c] border border-[#5c3b25] rounded-[4px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          {(["All", "Available", "Active", "Completed"] as const).map((tab) => (
            <button
              key={tab}
              id={`tab-btn-${tab}`}
              onClick={() => {
                setFilter(tab);
                setSelectedQuestId(null); // Reset selection
              }}
              className={`flex-1 py-2 px-3 text-sm font-heading rounded-[2px] transition-all cursor-pointer ${
                filter === tab
                  ? "bg-quest-primary text-quest-bg font-bold shadow-[0_0_8px_rgba(202,138,4,0.4)]"
                  : "text-quest-muted hover:text-quest-text hover:bg-quest-surface/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List scroll panel */}
        <div
          id="quest-list-scroll"
          className="flex flex-col gap-4 max-h-[580px] overflow-y-auto pr-2"
        >
          {filteredQuests.length === 0 ? (
            <div id="empty-board-notice" className="quest-card p-8 text-center flex flex-col items-center justify-center gap-4 text-quest-muted border-dashed border-[#5c3b25]">
              <Compass className="w-12 h-12 text-[#5c3b25]" />
              <p className="font-heading text-lg">No Quests Posted</p>
              <p className="text-sm">The guildboard remains silent. Generate a new quest from the wizard's sanctuary below or refine your board filters.</p>
            </div>
          ) : (
            filteredQuests.map((quest) => {
              const isSelected = quest.id === selectedQuestId;
              const isCompleted = quest.status === "Completed" || quest.status === "Claimed";
              const isActive = quest.status === "Active";

              return (
                <div
                  key={quest.id}
                  id={`quest-card-${quest.id}`}
                  onClick={() => setSelectedQuestId(quest.id)}
                  className={`quest-card p-4 flex flex-col gap-3 cursor-pointer border ${
                    isSelected
                      ? "border-quest-primary bg-[#3A2215] shadow-[0_0_15px_rgba(202,138,4,0.2)]"
                      : "border-[#4A2E1C]"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-mono text-quest-muted uppercase tracking-wider">
                      {quest.guildDepartment}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 border rounded-[2px] ${getDifficultyBadge(
                        quest.difficultyBadgeColor
                      )}`}
                    >
                      {quest.status === "Claimed" ? "CLAIMED" : quest.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`text-base font-bold font-heading leading-snug ${
                        isSelected ? "text-quest-primary" : "text-quest-text"
                      }`}
                    >
                      {quest.title}
                    </h3>
                    <p className="text-xs text-quest-muted line-clamp-2 mt-1">
                      {quest.synopsis}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#4A2E1C]/40 text-xs">
                    <div className="flex items-center gap-2 text-amber-500 font-semibold">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{quest.rewards.gold} Gold</span>
                    </div>
                    {isActive && (
                      <div className="flex items-center gap-1.5 text-quest-muted">
                        <Hourglass className="w-3 h-3 animate-pulse" />
                        <span>In Progress</span>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Ready</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Selected Quest Detail */}
      <div id="quest-detail-column" className="lg:col-span-7">
        {selectedQuest ? (
          <div id="quest-detail-card" className="quest-card p-6 flex flex-col gap-6 h-full min-h-[500px]">
            {/* Header */}
            <div className="border-b border-[#5c3b25] pb-4 flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-mono text-quest-muted tracking-wider">
                  Post of the {selectedQuest.guildDepartment}
                </span>
                <span className="text-xs text-quest-muted font-heading">
                  Offered by: <strong className="text-quest-text">{selectedQuest.giver}</strong>
                </span>
              </div>
              <h2 className="text-2xl font-bold font-heading text-quest-primary uppercase tracking-tight leading-tight">
                {selectedQuest.title}
              </h2>
            </div>

            {/* Scrollable Lore Narrative */}
            <div className="flex-1 flex flex-col gap-4 text-sm leading-relaxed max-h-[250px] overflow-y-auto pr-2 bg-[#20130b] p-4 rounded-[4px] border border-[#42291b]">
              <div className="font-heading text-xs uppercase text-quest-muted tracking-wider border-b border-[#5c3b25]/40 pb-1 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> The Chronicle
              </div>
              <p className="italic text-quest-text font-serif">"{selectedQuest.story}"</p>
            </div>

            {/* Requirements & Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-heading text-quest-muted uppercase tracking-wider">Prerequisites:</span>
                <ul className="flex flex-col gap-1">
                  {selectedQuest.requirements.map((req, idx) => (
                    <li key={idx} className="text-xs text-quest-text flex items-center gap-2">
                      <span className="text-quest-primary text-[10px]">✦</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-heading text-quest-muted uppercase tracking-wider">Loot Reward:</span>
                <div className={`p-2 border rounded-[4px] text-xs flex flex-col gap-1 ${getRarityColor(selectedQuest.rewards.lootItem.rarity)}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold">{selectedQuest.rewards.lootItem.name}</span>
                    <span className="text-[9px] uppercase font-mono px-1 border rounded-[2px]">
                      {selectedQuest.rewards.lootItem.rarity}
                    </span>
                  </div>
                  <p className="text-[11px] text-quest-text opacity-90 italic">
                    {selectedQuest.rewards.lootItem.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Objectives and Progress section */}
            <div className="border-t border-[#5c3b25] pt-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h4 className="font-heading text-sm uppercase text-quest-muted tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Quest Objectives
                </h4>
                <span className="text-xs font-mono text-quest-primary">
                  {selectedQuest.status === "Claimed" ? "Completed & Claimed" : selectedQuest.status}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {selectedQuest.objectives.map((obj, idx) => {
                  const percent = Math.min(100, Math.round((obj.currentCount / obj.targetCount) * 100));
                  const isFinished = obj.currentCount >= obj.targetCount;
                  const isActive = selectedQuest.status === "Active";

                  return (
                    <div key={idx} className="flex flex-col gap-1.5 p-3 bg-[#24150D] border border-[#4d2c18]/50 rounded-[4px]">
                      <div className="flex items-start justify-between text-xs gap-4">
                        <div className="flex items-center">
                          {getObjectiveIcon(obj.type)}
                          <span className={isFinished ? "line-through text-quest-muted" : "text-quest-text"}>
                            {obj.text}
                          </span>
                        </div>
                        <span className="font-mono font-bold shrink-0">
                          {obj.currentCount} / {obj.targetCount}
                        </span>
                      </div>

                      {/* Health / Progress Track */}
                      <div className="quest-progress-track">
                        <div
                          className={`quest-progress-fill${
                            isFinished ? "-success" : obj.type.toLowerCase() === "combat" ? "-secondary" : ""
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {/* Interactive Trigger (Only if Active) */}
                      {isActive && !isFinished && (
                        <div className="flex justify-end mt-1">
                          <button
                            id={`progress-btn-${selectedQuest.id}-${idx}`}
                            onClick={() => onProgressObjective(selectedQuest.id, idx)}
                            className="quest-btn-outline px-3 py-1 text-[11px]"
                          >
                            {obj.type === "Combat" ? "⚔️ Simulate Strike" : obj.type === "Investigation" ? "🔍 Inspect Area" : "🎒 Gather Specimen"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-[#5c3b25] pt-4 mt-auto flex justify-end gap-3">
              {selectedQuest.status === "Available" && (
                <button
                  id={`accept-quest-btn-${selectedQuest.id}`}
                  onClick={() => onAcceptQuest(selectedQuest.id)}
                  className="quest-btn-primary px-6 py-2.5 flex items-center gap-2 text-sm w-full md:w-auto justify-center"
                >
                  <Compass className="w-4 h-4" /> Sign Charter & Accept Quest
                </button>
              )}

              {selectedQuest.status === "Active" && (
                <div className="text-xs text-quest-muted flex items-center gap-2">
                  <Hourglass className="w-4 h-4 text-quest-primary animate-spin" />
                  <span>Execute objectives on the bulletin to complete the covenant.</span>
                </div>
              )}

              {selectedQuest.status === "Completed" && (
                <button
                  id={`claim-rewards-btn-${selectedQuest.id}`}
                  onClick={() => onClaimRewards(selectedQuest.id)}
                  className="quest-btn-primary px-8 py-3 flex items-center gap-2 text-sm animate-bounce w-full md:w-auto justify-center"
                >
                  <Trophy className="w-4 h-4" /> Claim Gold & Treasure Rewards
                </button>
              )}

              {selectedQuest.status === "Claimed" && (
                <div className="flex items-center gap-2 text-xs text-[#22C55E] bg-[#14321A] border border-[#22C55E]/30 px-4 py-2 rounded-[4px] w-full md:w-auto justify-center font-heading font-semibold shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
                  <CheckCircle className="w-4 h-4" /> Quest Log Completed & Seal Claimed
                </div>
              )}
            </div>
          </div>
        ) : (
          <div id="no-quest-selected" className="quest-card p-8 text-center flex flex-col items-center justify-center h-full min-h-[500px] text-quest-muted">
            <Compass className="w-16 h-16 text-quest-muted mb-4 opacity-50" />
            <h3 className="text-xl font-heading mb-2 text-quest-primary">No Parchment Selected</h3>
            <p className="text-sm max-w-sm">Select an available bounty from the tavern board list to read its chronicle, objective stipulations, and magic rewards.</p>
          </div>
        )}
      </div>
    </div>
  );
}
