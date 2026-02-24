import { NextResponse } from "next/server";

const API_BASE = "https://api.quran.com/api/v4";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/resources/recitations`);
    if (!response.ok) {
      throw new Error("recitations");
    }

    const data = (await response.json()) as { recitations: unknown };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load recitations" }, { status: 500 });
  }
}
