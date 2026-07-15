import { Quest, Adventurer } from "./types";

export const INITIAL_ADVENTURER: Adventurer = {
  name: "Alaric the Swift",
  class: "Ranger",
  level: 4,
  xp: 1250,
  nextLevelXp: 3000,
  gold: 420,
  inventory: [
    {
      name: "Dull Steel Dagger",
      rarity: "Common",
      description: "A simple blade, worn by time and countless campfires."
    },
    {
      name: "Elixir of Lesser Sight",
      rarity: "Uncommon",
      description: "Glows with a faint amber light. Grants night vision for ten leagues."
    }
  ],
  completedCount: 3
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: "q-1",
    title: "The Gilded Chalice of Barrow Downs",
    giver: "Lord-Regent Kenneth",
    synopsis: "Retrieve the ancient chalice stolen by tomb wights from the royal mausoleum.",
    story: "The royal house of Kenneth has been desecrated! Under the veil of the last crescent moon, tomb wights burrowed into the ancestral crypts and made off with the Gilded Chalice. Rumor has it they seek to drink blood from it to seal an unholy pact. Retrieve it, and the Crown shall pay you handsomely in gold and favor.",
    requirements: ["Level 3+", "Silvered Weaponry"],
    objectives: [
      {
        text: "Slay Barrow Wights in the downs",
        currentCount: 0,
        targetCount: 5,
        type: "Combat"
      },
      {
        text: "Recover the Gilded Chalice",
        currentCount: 0,
        targetCount: 1,
        type: "Gathering"
      }
    ],
    rewards: {
      gold: 250,
      xp: 600,
      lootItem: {
        name: "Ring of the Wolf-Friend",
        rarity: "Rare",
        description: "Enables the wearer to speak with forest creatures and commands respect among woodland beasts."
      }
    },
    difficultyBadgeColor: "primary",
    guildDepartment: "The Iron Vanguard",
    status: "Available"
  },
  {
    id: "q-2",
    title: "Curing the Weeping Willow's Blight",
    giver: "Arch-Druid Melissa",
    synopsis: "Gather corrupted spores from the Heartwood to formulate an antidote for the Blighted Canopy.",
    story: "A toxic, purple shadow falls across the elder trees of Whisperwood. The Heartwood itself is weeping black sap. We suspect a group of hedge wizards have been brewing dark draft formulas near the northern springs. We require pure corrupted samples to synthesize a curing tonic before the wood rots entirely.",
    requirements: ["Herbalism Kit", "Elvish language skill preferred"],
    objectives: [
      {
        text: "Extract Blight Spores from infected hollows",
        currentCount: 0,
        targetCount: 3,
        type: "Gathering"
      },
      {
        text: "Defend Druid altar from maddened spore-fiends",
        currentCount: 0,
        targetCount: 1,
        type: "Combat"
      }
    ],
    rewards: {
      gold: 180,
      xp: 450,
      lootItem: {
        name: "Heartwood Focus Staff",
        rarity: "Uncommon",
        description: "Carved from a living branch, it thrums with quiet rejuvenating energy."
      }
    },
    difficultyBadgeColor: "success",
    guildDepartment: "The Ranger Conclave",
    status: "Available"
  },
  {
    id: "q-3",
    title: "The Whispers in the Sewerage",
    giver: "Squire Jeremy of the City Watch",
    synopsis: "Investigate reports of a rogue coven conducting rituals beneath the cobblestones.",
    story: "The sewer grates of the lower ward are vibrating with rhythmic, low chants at midnight. Citizens report seeing black-robed silhouettes slipping down the drainage canal. The City Watch is too thinly spread to send heavy-armored guards. Slip in, map their ritual chamber, and extinguish their unholy brazier.",
    requirements: ["Stealth", "Thieves' Tools recommended"],
    objectives: [
      {
        text: "Infiltrate Sewers and locate Ritual Brazier",
        currentCount: 0,
        targetCount: 1,
        type: "Investigation"
      },
      {
        text: "Disrupt Rogue Coven and banish the summoned Imp",
        currentCount: 0,
        targetCount: 1,
        type: "Combat"
      }
    ],
    rewards: {
      gold: 350,
      xp: 800,
      lootItem: {
        name: "Silent-Step Suede Boots",
        rarity: "Epic",
        description: "Lined with phantom feathers. The wearer leaves neither sound nor footprints on any floor."
      }
    },
    difficultyBadgeColor: "accent",
    guildDepartment: "The Shadow Concordat",
    status: "Available"
  }
];
