import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Cairo";
    const country = searchParams.get("country") || "Egypt";
    
    // Using Aladhan API for prayer times
    const response = await fetch(
      `http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=5`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch prayer times: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error("Invalid response from prayer times API");
    }

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return NextResponse.json(
      { error: "Failed to fetch prayer times" },
      { status: 500 }
    );
  }
}
