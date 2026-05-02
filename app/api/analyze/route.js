import { NextResponse } from "next/server";
import { analyzeSecondhandItem } from "../../../lib/ai";

const MAX_IMAGE_LENGTH = 8 * 1024 * 1024;

export async function POST(request) {
  try {
    const body = await request.json();
    const image = body?.image;

    if (typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Image is required as a base64 data URL." },
        { status: 400 }
      );
    }

    if (image.length > MAX_IMAGE_LENGTH) {
      return NextResponse.json(
        { error: "Image is too large. Please upload a smaller image." },
        { status: 413 }
      );
    }

    const result = await analyzeSecondhandItem(image);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze API error:", error);

    const isConfigError = error.message?.includes("OPENROUTER_API_KEY");
    return NextResponse.json(
      {
        error: isConfigError
          ? "OpenRouter API key is not configured."
          : "Reco belum bisa menganalisis gambar ini. Coba gunakan foto yang lebih jelas.",
        detail:
          process.env.NODE_ENV === "development" && !isConfigError
            ? error.message
            : undefined
      },
      { status: isConfigError ? 500 : 502 }
    );
  }
}
