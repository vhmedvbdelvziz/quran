import { NextResponse } from "next/server";
import { getSuraContent } from "@/lib/quran-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const suraParam = Number(searchParams.get("sura"));

  if (!suraParam || Number.isNaN(suraParam) || suraParam < 1 || suraParam > 114) {
    return NextResponse.json({ error: "Invalid sura" }, { status: 400 });
  }

  try {
    const data = getSuraContent(suraParam);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load sura" }, { status: 500 });
  }
}
