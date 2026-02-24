import { NextResponse } from "next/server";

const API_BASE = "https://api.quran.com/api/v4";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/resources/tafsirs`);
    if (!response.ok) {
      throw new Error("tafsirs");
    }

    const data = (await response.json()) as { tafsirs: unknown };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load tafsir list" }, { status: 500 });
  }
}
