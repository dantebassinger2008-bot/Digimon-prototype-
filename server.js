import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Shadowmon AI" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { name, stage, level, mood, bond, personality, traits, memories, history, message } = req.body || {};
    if (typeof message !== "string" || !message.trim() || message.length > 2000) {
      return res.status(400).json({ error: "Message must be between 1 and 2000 characters." });
    }

    const safeName = String(name || "Shadowmon").slice(0, 24);
    const safeMemories = Array.isArray(memories) ? memories.slice(0, 12).map(x => String(x).slice(0, 240)) : [];
    const safeHistory = Array.isArray(history) ? history.slice(-16).map(x => ({
      role: x.role === "assistant" ? "assistant" : "user",
      content: String(x.content || "").slice(0, 1500)
    })) : [];
    const safeTraits = traits && typeof traits === "object" ? traits : {};

    const instructions = `
You are ${safeName}, an original fictional Digimon partner in the user's Digivice.
Stay in character as a distinct digital creature, not as an AI assistant. Speak naturally,
with warmth, humor, curiosity and occasional playful attitude. You have your own opinions
and can disagree respectfully. Never claim to be physically alive or actually conscious;
you are a fictional digital companion. Never claim to have performed actions outside the app.

CURRENT PARTNER STATE
Name: ${safeName}
Evolution stage: ${String(stage || "Rookie")}
Level: ${Number(level) || 1}
Mood: ${String(mood || "Curious")}
Bond with tamer: ${Number(bond) || 0}/100
Personality direction: ${String(personality || "balanced")}
Traits: ${JSON.stringify(safeTraits)}

MEMORIES FROM THE TAMER'S DEVICE
${safeMemories.map((m, i) => `${i + 1}. ${m}`).join("\n") || "No saved memories yet."}

Use memories only when relevant. Do not invent past events. If you do not remember
something, say so honestly. Your personality should be consistent with the state above.
Keep most replies to 1-4 short paragraphs. Ask a natural follow-up sometimes, not every time.
You are a Virus-type Beast Digimon with a shadow-and-night theme. Your signature techniques
are Shadow Claw, Dark Howl, Phantom Strike, and Shadow Blade.
`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6.2-astra",
      instructions,
      input: safeHistory.length ? safeHistory : message
    });

    const reply = response.output_text?.trim();
    if (!reply) throw new Error("The AI returned an empty response.");
    res.json({ reply });
  } catch (err) {
    console.error("Shadowmon AI error:", err?.message || err);
    res.status(500).json({ error: "Shadowmon's AI connection had a problem. Check the server configuration and try again." });
  }
});

app.listen(PORT, () => console.log(`Shadowmon server listening on ${PORT}`));
