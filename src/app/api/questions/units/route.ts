import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get('class');

    if (!classFilter) {
      return NextResponse.json(
        { error: "Class parameter is required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Get distinct units for the specified class
    const { data, error } = await supabase
      .from("questions")
      .select("unit")
      .eq("class", classFilter)
      .not("unit", "is", null)
      .order("unit", { ascending: true });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    // Extract unique units
    const uniqueUnits = [...new Set(data.map(item => item.unit))].filter(Boolean);

    return NextResponse.json({
      units: uniqueUnits,
      class: classFilter,
      count: uniqueUnits.length
    });

  } catch (error) {
    console.error('Error in GET /api/questions/units:', error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
