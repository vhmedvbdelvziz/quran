import { NextResponse } from "next/server";
import { getPageData, getTotalPages } from "@/lib/quran-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageParam = Number(searchParams.get("page"));
  const totalPages = getTotalPages();

  if (!pageParam || Number.isNaN(pageParam) || pageParam < 1 || pageParam > totalPages) {
    return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }

  try {
    const data = getPageData(pageParam);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load page" }, { status: 500 });
  }
}
