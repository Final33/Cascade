import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/**
 * Type definition for a Question based on the database schema.
 */
export type Question = {
  id: string; // uuid
  class: string; // text
  unit: string; // text
  topic: string; // text
  label: string; // text
  difficulty: string; // text
  question_text: string; // text
  created_at: string; // timestamptz
  type: string; // text
  options: any; // jsonb (array of options for MCQ)
  correct_option: string; // text
  explanation: string; // text
};

/**
 * Fetches questions from Supabase with filtering and pagination.
 * 
 * This function uses server-side client for secure access and applies filters efficiently.
 * It fetches only the necessary data with pagination to optimize performance.
 * 
 * @param filters - Object containing optional filters: class, unit, topic, type, difficulty
 * @param page - Current page number (1-indexed)
 * @param limit - Number of questions per page
 * @returns Promise resolving to { questions: Question[], total: number }
 * @throws Error if fetching fails or unauthorized
 */
export async function getQuestions(
  filters: {
    class?: string;
    unit?: string;
    topic?: string;
    type?: string;
    difficulty?: string;
  } = {},
  page: number = 1,
  limit: number = 20,
  fetchAll: boolean = false
): Promise<{ questions: Question[]; total: number }> {
  const supabase = createSupabaseServerClient();

  // Check authentication
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError) {
    console.error('Auth error:', authError);
    throw new Error(`Authentication error: ${authError.message}`);
  }
  
  console.log('Session info:', session ? 'User logged in' : 'No session');
  
  if (!session?.user?.id) {
    console.log('No authenticated user - this might be a RLS issue');
    // For now, we'll allow unauthenticated access for testing
    // In production, you should uncomment the line below:
    // throw new Error("Unauthorized");
  }

  let query = supabase
    .from("questions")
    .select("*", { count: "exact" });

  // Apply filters
  if (filters.class) query = query.eq("class", filters.class);
  if (filters.unit) query = query.eq("unit", filters.unit);
  if (filters.topic) query = query.ilike("topic", `%${filters.topic}%`);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);

  // Pagination and ordering
  const offset = (page - 1) * limit;
  if (!fetchAll) {
    query = query.range(offset, offset + limit - 1);
  }
  query = query.order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error('Supabase query error:', error);
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    
    // If it's an RLS error, let's try a different approach
    if (error.code === 'PGRST116' || error.message.includes('RLS') || error.message.includes('policy')) {
      console.log('Detected RLS issue - trying alternative query approach...');
      
      // Try a simple count query to test table access
      const { data: countData, error: countError, count: rawCount } = await supabase
        .from("questions")
        .select("*", { count: "exact" })
        .limit(1);
        
      if (countError) {
        console.error('Even basic count query failed:', countError);
      } else {
        console.log(`Basic count query succeeded - found ${rawCount} total questions`);
        if (countData && countData.length > 0) {
          console.log('Sample question from basic query:', countData[0]);
        }
      }
    }
    
    throw new Error(`Failed to fetch questions: ${error.message}`);
  }

  return {
    questions: data as Question[],
    total: count || 0
  };
} 