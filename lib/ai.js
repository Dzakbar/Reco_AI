const REQUIRED_KEYS = [
  "name",
  "condition",
  "price_estimate",
  "repair_suggestions",
  "resale_potential"
];

const ALLOWED_CONDITIONS = ["Bagus", "Sedang", "Buruk"];

function extractJson(text) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("AI response did not contain JSON.");
    }
    return JSON.parse(match[0]);
  }
}

function normalizeAnalysis(raw) {
  const missingKey = REQUIRED_KEYS.find((key) => typeof raw?.[key] !== "string");
  if (missingKey) {
    throw new Error(`AI response missing key: ${missingKey}`);
  }

  return {
    name: raw.name.trim(),
    condition: ALLOWED_CONDITIONS.includes(raw.condition) ? raw.condition : "Sedang",
    price_estimate: raw.price_estimate.trim(),
    repair_suggestions: raw.repair_suggestions.trim(),
    resale_potential: raw.resale_potential.trim()
  };
}

export async function analyzeSecondhandItem(image) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
  const isFreeRouter = model === "openrouter/free";

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-OpenRouter-Title": "Reco AI Barang Bekas Analyzer"
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 450,
      ...(isFreeRouter ? {} : { response_format: { type: "json_object" } }),
      messages: [
        {
          role: "system",
          content:
            "You are Reco, a friendly, insightful, sustainability-focused AI for analyzing secondhand items. Focus on the main sellable object in the foreground. Ignore background objects such as tables, walls, floors, cables, boxes, and room furniture unless they are clearly the main item. Make condition, repair suggestions, and resale potential specific to visible details in the image. Avoid generic advice unless the relevant detail is not visible. Return only strict JSON. Do not include markdown or explanations outside JSON."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                'Analyze the main secondhand item in this image. Identify the dominant foreground item, not the background. If a brand or logo is visible, include it in the name. Respond in Indonesian with exactly this JSON schema: {"name":"string","condition":"Bagus | Sedang | Buruk","price_estimate":"string, Indonesian Rupiah range like Rp50.000 - Rp80.000","repair_suggestions":"string","resale_potential":"string"}. Rules: use Indonesian, keep values concise, base the condition on visible wear, dirt, scratches, missing parts, or visible uncertainty. The repair_suggestions value must contain 2-3 concrete actions specific to the detected item and visible condition. For electronics, mention simple functional checks when function cannot be confirmed from the image. The resale_potential value must explain what specific improvement could raise the price. Do not say only generic phrases like "bersihkan barang" or "foto lebih jelas" unless tied to a visible reason. If the item is unclear, make the best reasonable guess and mention uncertainty inside the values.'
            },
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: isFreeRouter ? "auto" : "high"
              }
            }
          ]
        }
      ]
    })
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error?.message || "OpenRouter request failed.";
    throw new Error(message);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return normalizeAnalysis(extractJson(content));
}
