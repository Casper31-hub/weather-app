export interface LootItem {
  name: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  description: string;
}

export interface QuestObjective {
  text: string;
  currentCount: number;
  targetCount: number;
  type: string;
}

export interface Quest {
  id: string;
  title: string;
  giver: string;
  synopsis: string;
  story: string;
  requirements: string[];
  objectives: QuestObjective[];
  rewards: {
    gold: number;
    xp: number;
    lootItem: LootItem;
  };
  difficultyBadgeColor: "primary" | "secondary" | "accent" | "success";
  guildDepartment: string;
  status: "Available" | "Active" | "Completed" | "Claimed";
}

export interface Adventurer {
  name: string;
  class: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  gold: number;
  inventory: LootItem[];
  completedCount: number;
}
