import { NextResponse } from "next/server";
import { getJuzContent } from "@/lib/quran-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const juzParam = Number(searchParams.get("juz"));

  if (!juzParam || Number.isNaN(juzParam) || juzParam < 1 || juzParam > 30) {
    return NextResponse.json({ error: "Invalid juz" }, { status: 400 });
  }

  try {
    const data = getJuzContent(juzParam);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load juz" }, { status: 500 });
  }
}
