import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on server side only
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Server-side API endpoint for quest generation
app.post("/api/quests/generate", async (req, res) => {
  try {
    const { questType, difficulty, location, adventurerClass, seedIdea } = req.body;

    const systemInstruction = `You are an immersive medieval fantasy Dungeon Master and Quest Writer. 
Generate a rich, thematic medieval fantasy quest for an adventurer. 
Write engaging flavor text and story detail suited for the theme. Avoid any modern language or tone. Use medieval/archaic styled nouns and verbs where appropriate.`;

    const prompt = `Generate a fantasy quest with the following constraints:
- Quest Category: ${questType || "Bounty Hunt"}
- Difficulty Level: ${difficulty || "Medium"} (e.g. Apprentice, Journeyman, Master, Legendary)
- Guild/Location: ${location || "Tavern Board"}
- Target Class: ${adventurerClass || "Fighter"}
- Seed concept or keyword: ${seedIdea || "none specified"}

Return the quest details matching the required JSON schema structure. Make it high-flavor, creative, and fully fleshed-out.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "giver", "synopsis", "story", "requirements", "objectives", "rewards", "difficultyBadgeColor", "guildDepartment"],
          properties: {
            title: {
              type: Type.STRING,
              description: "A creative, medieval sounding quest title (e.g., 'The Whispering Curse of Ironwood')"
            },
            giver: {
              type: Type.STRING,
              description: "The name and title of the NPC giving the quest (e.g., 'Father Roderick, High Cleric')"
            },
            synopsis: {
              type: Type.STRING,
              description: "A short, engaging one-sentence summary shown on the quest bulletin board."
            },
            story: {
              type: Type.STRING,
              description: "A rich paragraph detailing the lore, the threat, and the tavern rumors surrounding this quest."
            },
            requirements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2-3 specific requirements (e.g. 'Level 5+', 'Silvered Weaponry required', 'Must speak Elvish')"
            },
            objectives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["text", "targetCount", "type"],
                properties: {
                  text: { type: Type.STRING, description: "A specific action (e.g., 'Slay Crypt Horrors in the barrow')" },
                  targetCount: { type: Type.INTEGER, description: "Numeric goal (e.g., 5 or 1)" },
                  type: { type: Type.STRING, description: "e.g., 'Combat', 'Gathering', 'Investigation', 'Ritual'" }
                }
              },
              description: "A list of 2-3 tactical objectives needed to complete the quest."
            },
            rewards: {
              type: Type.OBJECT,
              required: ["gold", "xp", "lootItem"],
              properties: {
                gold: { type: Type.INTEGER, description: "Amount of gold pieces rewarded" },
                xp: { type: Type.INTEGER, description: "Experience points granted" },
                lootItem: {
                  type: Type.OBJECT,
                  required: ["name", "rarity", "description"],
                  properties: {
                    name: { type: Type.STRING, description: "The name of a magical or rare medieval item rewarded" },
                    rarity: { type: Type.STRING, description: "e.g. Common, Uncommon, Rare, Epic, Legendary" },
                    description: { type: Type.STRING, description: "A quick thematic description of what the item does" }
                  }
                }
              }
            },
            difficultyBadgeColor: {
              type: Type.STRING,
              description: "Suggest a color for the UI badge: 'primary' (yellow), 'secondary' (red), 'accent' (purple), or 'success' (green) based on difficulty"
            },
            guildDepartment: {
              type: Type.STRING,
              description: "Which sub-guild is this for? e.g. 'The Iron Vanguard', 'The Shadow Concordat', 'The College of Whispers', 'The Ranger Conclave'"
            }
          }
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error generating quest:", error);
    res.status(500).json({ error: error?.message || "Failed to generate medieval quest" });
  }
});

// Weather API Proxy Route
app.get("/api/weather/forecast", async (req, res) => {
  try {
    const response = await fetch("https://api.data.gov.my/weather/forecast/", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "QuestUI-App"
      }
    });
    if (!response.ok) {
      throw new Error(`Weather API returned status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Error proxying weather API:", error);
    res.status(500).json({ error: error?.message || "Failed to fetch weather forecast data from the server." });
  }
});

// Vite middleware configuration
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

initializeServer();
