import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get('class');
    const unitFilter = searchParams.get('unit');
    const topicFilter = searchParams.get('topic');
    const typeFilter = searchParams.get('type');
    const difficultyFilter = searchParams.get('difficulty');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const fetchAll = searchParams.get('all') === 'true';

    const filters = {
      class: classFilter ?? undefined,
      unit: unitFilter && unitFilter !== 'All Units' ? unitFilter : undefined,
      topic: topicFilter ?? undefined,
      type: typeFilter ?? undefined,
      difficulty: difficultyFilter ?? undefined,
    };

    console.log('Question filters:', filters);

    // Validate required class parameter
    if (!filters.class) {
      return NextResponse.json(
        { error: "Class parameter is required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    console.log('Testing database connection...');
    try {
      const { data: testData, error: testError } = await supabase
        .from("questions")
        .select("count", { count: "exact", head: true });
      
      if (testError) {
        console.error('Database connection test failed:', testError);
      } else {
        console.log('Database connection successful');
      }
    } catch (connectionError) {
      console.error('Database connection error:', connectionError);
    }

    let query = supabase
      .from("questions")
      .select("*", { count: "exact" });
    
    // Apply filters with case-insensitive matching where appropriate
    if (filters.class) query = query.ilike("class", filters.class);
    if (filters.unit) query = query.ilike("unit", filters.unit);
    if (filters.topic) query = query.ilike("topic", `%${filters.topic}%`);
    if (filters.type) query = query.ilike("type", filters.type);
    if (filters.difficulty) query = query.ilike("difficulty", filters.difficulty);

    const offset = (page - 1) * limit;
    if (!fetchAll) {
      query = query.range(offset, offset + limit - 1);
    }
    query = query.order("label", { ascending: true });

    console.log('Executing Supabase query...');
    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    console.log(`Fetched ${data?.length || 0} questions with total count: ${count}`);
    console.log('Applied filters:', filters);
    
    if (data && data.length > 0) {
      console.log('Sample question data (first 3):');
      data.slice(0, 3).forEach((question, index) => {
        console.log(`Question ${index + 1}:`, {
          id: question.id,
          class: question.class,
          unit: question.unit,
          topic: question.topic,
          label: question.label,
          difficulty: question.difficulty,
          type: question.type
        });
      });
    } else {
      console.log('No questions found for current filters');
      
      // Check if there are any questions for this class at all
      console.log('Checking if any questions exist for this class...');
      const { data: classQuestions, error: classError, count: classCount } = await supabase
        .from("questions")
        .select("*", { count: "exact" })
        .ilike("class", filters.class)
        .limit(3);
        
      if (classError) {
        console.error('Error checking class questions:', classError);
      } else {
        console.log(`Found ${classCount} total questions for class "${filters.class}"`);
        if (classQuestions && classQuestions.length > 0) {
          console.log('Sample questions for this class:');
          classQuestions.forEach((q, i) => {
            console.log(`Sample ${i + 1}:`, {
              id: q.id,
              class: q.class,
              unit: q.unit,
              topic: q.topic,
              label: q.label
            });
          });
        }
      }
    }

    const totalPages = fetchAll ? 1 : Math.ceil((count || 0) / limit);

    return NextResponse.json({
      questions: data || [],
      pagination: {
        page,
        limit: fetchAll ? (count || 0) : limit,
        total: count || 0,
        totalPages
      }
    });

  } catch (error) {
    console.error('Error in GET /api/questions:', error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 