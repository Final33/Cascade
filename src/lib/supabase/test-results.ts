import { createBrowserClient } from '@supabase/ssr';

interface ActualTestResults {
  score: number;
  totalTime: number;
  questions: any[];
  userAnswers?: any[];
  completedAt: Date;
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function saveTestResults(
  testType: string,
  difficulty: string,
  selectedUnits: string[],
  results: ActualTestResults
) {
  try {
    // First, get the user id
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Insert the main test record
    const { data: testData, error: testError } = await supabase
      .from('tests')
      .insert({
        user_id: user.id,
        test_type: testType,
        difficulty,
        selected_units: selectedUnits,
        score: results.score,
        total_time: results.totalTime,
        question_count: results.questions.length,
        completed_at: results.completedAt.toISOString()
      })
      .select('id')
      .single();
      
    if (testError) {
      throw new Error(`Failed to save test: ${testError.message}`);
    }
    
    // Insert individual question records
    const questionRecords = results.questions.map((question: any, index: number) => ({
      test_id: testData.id,
      question_number: index + 1,
      question_content: question.content,
      question_type: question.type,
      user_answer: question.userAnswer || results.userAnswers?.[index] || null,
      is_correct: question.isCorrect || false,
      options: question.options || null,
      documents: question.documents || null,
      rubric: question.rubric || null,
      explanation: question.explanation || null,
      feedback: question.feedback || null,
      score: question.score || null,
      total_points: question.totalPoints || null
    }));
    
    const { error: questionsError } = await supabase
      .from('test_questions')
      .insert(questionRecords);
      
    if (questionsError) {
      throw new Error(`Failed to save test questions: ${questionsError.message}`);
    }
    
    // Update daily activity and streak (this will be handled by the database trigger)
    // But we can also manually call it to ensure immediate UI updates
    try {
      await updateDailyActivity(
        results.questions.length,
        results.score,
        results.totalTime,
        1
      );
    } catch (activityError) {
      console.warn('Failed to update daily activity:', activityError);
      // Don't throw error here as the main test save was successful
    }
    
    return testData.id;
  } catch (error) {
    console.error('Error saving test results:', error);
    throw error;
  }
}

export async function getUserTestHistory() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });
      
    if (error) {
      throw new Error(`Failed to fetch test history: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching test history:', error);
    throw error;
  }
}

export async function updateTotalPracticeTime() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('tests')
      .select('total_time')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch test history: ${error.message}`);
    }

    const totalSeconds = (data || []).reduce((sum, test) => {
      return sum + (test.total_time || 0);
    }, 0);

    const totalPracticeHours = Math.round(totalSeconds / 3600);

    // Update the 'users' table with the new totalPracticeHours
    const { error: updateError } = await supabase
      .from('users')
      .update({ totalPracticeTime: totalPracticeHours })
      .eq('uid', user.id);

    if (updateError) {
      throw new Error(`Failed to update user practice time: ${updateError.message}`);
    }

  } catch (error) {
    console.error('Error calculating or updating total practice hours:', error);
    throw error;
  }
}

export async function getPracticeTimeThisWeek() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = now.getDate() - day; // Last Sunday
  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('tests')
    .select('total_time, completed_at')
    .eq('user_id', user.id)
    .gte('completed_at', startOfWeek.toISOString());

  if (error) throw new Error(`Failed to fetch weekly tests: ${error.message}`);

  const weeklySeconds = data.reduce((sum, test) => sum + (test.total_time || 0), 0);
  const weeklyHours = weeklySeconds / 3600;

  return weeklyHours;
}

export async function getQuestionsAnsweredThisWeek() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('tests')
    .select('question_count, completed_at')
    .eq('user_id', user.id)
    .gte('completed_at', startOfWeek.toISOString());

  if (error) throw new Error(`Failed to fetch weekly question count: ${error.message}`);

  const questions = data.reduce((sum, test) => sum + (test.question_count || 0), 0);
  return questions;
}



export async function getTotalPracticeTime() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('users')
      .select('totalPracticeTime')
      .eq('uid', user.id)
      .single()
    if (error) {
      throw new Error(`Failed to fetch test history: ${error.message}`);
    }
    const totalPracticeHours = data.totalPracticeTime || 0;
    return totalPracticeHours;

  } catch (error) {
    console.error('Error calculating or updating total practice hours:', error);
    throw error;
  }
}
export async function getWeeklyAccuracyImprovement() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const now = new Date();

    // Start of this week (Sunday)
    const day = now.getDay();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - day);
    startOfThisWeek.setHours(0, 0, 0, 0);

    // Start of last week (Previous Sunday)
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    // Fetch all tests from last 2 weeks
    const { data, error } = await supabase
      .from('tests')
      .select('question_count, score, completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', startOfLastWeek.toISOString());

    if (error) throw new Error(`Failed to fetch test history: ${error.message}`);

    // Split tests into two weeks
    const lastWeekTests = [];
    const thisWeekTests = [];

    for (const test of data || []) {
      const completedAt = new Date(test.completed_at);
      if (completedAt >= startOfThisWeek) {
        thisWeekTests.push(test);
      } else {
        lastWeekTests.push(test);
      }
    }

    // Helper to calculate average accuracy
    const getAccuracy = (tests: any[]) => {
      const totalQuestions = tests.reduce((sum: number, t: any) => sum + (t.question_count || 0), 0);
      const totalCorrect = tests.reduce((sum: number, t: any) => sum + (t.score || 0), 0);
      return totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : null;
    };

    const accuracyLastWeek = getAccuracy(lastWeekTests);
    const accuracyThisWeek = getAccuracy(thisWeekTests);

    if (accuracyLastWeek === null || accuracyThisWeek === null) {
      return null; // Not enough data
    }

    const improvement = accuracyThisWeek - accuracyLastWeek;
    return improvement;

  } catch (error) {
    console.error('Error calculating weekly accuracy improvement:', error);
    throw error;
  }
}
export async function getHoursImprovementThisWeek() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const now = new Date();

    // Start of this week (Sunday at 00:00)
    const day = now.getDay();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - day);
    startOfThisWeek.setHours(0, 0, 0, 0);

    // Start of last week (previous Sunday at 00:00)
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    // Fetch tests completed from the start of last week onwards
    const { data, error } = await supabase
      .from('tests')
      .select('total_time, completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', startOfLastWeek.toISOString());

    if (error) throw new Error(`Failed to fetch test history: ${error.message}`);

    // Split tests by week
    const lastWeekTests = [];
    const thisWeekTests = [];

    for (const test of data || []) {
      const completedAt = new Date(test.completed_at);
      if (completedAt >= startOfThisWeek) {
        thisWeekTests.push(test);
      } else {
        lastWeekTests.push(test);
      }
    }

    // Helper to calculate total time in hours
    const getHours = (tests: any[]) => {
      const totalSeconds = tests.reduce((sum: number, t: any) => sum + (t.total_time || 0), 0);
      return totalSeconds / 3600;
    };

    const hoursLastWeek = getHours(lastWeekTests);
    const hoursThisWeek = getHours(thisWeekTests);


    const improvement = hoursThisWeek - hoursLastWeek;
    return improvement;

  } catch (error) {
    console.error('Error calculating weekly hours improvement:', error);
    throw error;
  }
}
export async function getTestsCompletedByUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { count, error } = await supabase
      .from('tests')
      .select('id', { count: 'exact', head: true }) // No data, just count
      .eq('user_id', user.id);

    if (error) throw new Error(`Failed to count tests: ${error.message}`);

    return count || 0;
  } catch (error) {
    console.error('Error getting test count for user:', error);
    throw error;
  }
}
export async function getTestsCompletedThisWeek() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const now = new Date();

    // Start of this week (Sunday)
    const dayOfWeek = now.getDay();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - dayOfWeek);
    startOfThisWeek.setHours(0, 0, 0, 0);

    // Fetch all tests completed since the start of this week
    const { data, error } = await supabase
      .from('tests')
      .select('id') // just need the IDs for counting
      .eq('user_id', user.id)
      .gte('completed_at', startOfThisWeek.toISOString());

    if (error) {
      throw new Error(`Failed to fetch test history: ${error.message}`);
    }
    if (data.length === null) return 0;
    return data.length; // number of tests completed this week

  } catch (error) {
    console.error('Error fetching tests completed this week:', error);
    throw error;
  }
}

export async function getTestCountImprovementThisWeek() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const now = new Date();

    // Start of this week (Sunday)
    const dayOfWeek = now.getDay();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - dayOfWeek);
    startOfThisWeek.setHours(0, 0, 0, 0);

    // Start of last week (previous Sunday)
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    // Fetch tests from the past 2 weeks
    const { data, error } = await supabase
      .from('tests')
      .select('completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', startOfLastWeek.toISOString());

    if (error) throw new Error(`Failed to fetch test history: ${error.message}`);

    // Split into last week and this week
    let thisWeekCount = 0;
    let lastWeekCount = 0;
    
    for (const test of data || []) {
      const completedAt = new Date(test.completed_at);
      if (completedAt >= startOfThisWeek) {
        thisWeekCount++;
      } else {
        lastWeekCount++;
      }
    }

    // Calculate improvement
    const improvement = thisWeekCount - lastWeekCount;
    return improvement;

  } catch (error) {
    console.error('Error calculating test count improvement:', error);
    throw error;
  }
}

export async function getQuestionsAnswered() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('tests')
      .select('question_count')
      .eq('user_id', user.id)
    if (error) {
      throw new Error(`Failed to fetch test history: ${error.message}`);
    }
    const totalQuestions = data.reduce((acc, curr) => acc + (curr.question_count || 0), 0);
    return totalQuestions;
  } catch (error) {
    console.error('Error calculating or updating questions answered:', error);
    throw error;
  }
}
export async function getCorrectQuestions() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('tests')
      .select('score')
      .eq('user_id', user.id)
    if (error) {
      throw new Error(`Failed to fetch test history: ${error.message}`);
    }
    const totalRight = data.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return totalRight;
  } catch (error) {
    console.error('Error calculating or updating questions answered:', error);
    throw error;
  }
}
export async function getTestDetails(testId: string) {
  try {
    // Get the test record
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();
      
    if (testError) {
      throw new Error(`Failed to fetch test: ${testError.message}`);
    }
    
    // Get the test questions
    const { data: questions, error: questionsError } = await supabase
      .from('test_questions')
      .select('*')
      .eq('test_id', testId)
      .order('question_number', { ascending: true });
      
    if (questionsError) {
      throw new Error(`Failed to fetch test questions: ${questionsError.message}`);
    }
    
    return {
      test,
      questions: questions || []
    };
  } catch (error) {
    console.error('Error fetching test details:', error);
    throw error;
  }
}

// =====================================================
// DAILY GOALS AND STUDY STREAKS API FUNCTIONS
// =====================================================

export async function getDailyProgress() { 
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.rpc('get_daily_progress', {
      p_user_id: user.id
    });

    if (error) {
      throw new Error(`Failed to fetch daily progress: ${error.message}`);
    }

    return data || {};
  } catch (error) {
    console.error('Error fetching daily progress:', error);
    throw error;
  }
}

export async function updateDailyActivity(
  questionsAnswered: number = 0,
  questionsCorrect: number = 0,
  practiceTimeSeconds: number = 0,
  testsCompleted: number = 0
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.rpc('update_daily_activity_and_streak', {
      p_user_id: user.id,
      p_questions_answered: questionsAnswered,
      p_questions_correct: questionsCorrect,
      p_practice_time_seconds: practiceTimeSeconds,
      p_tests_completed: testsCompleted
    });

    if (error) {
      throw new Error(`Failed to update daily activity: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating daily activity:', error);
    throw error;
  }
}

export async function getTodayActivity() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', user.id)
      .eq('activity_date', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw new Error(`Failed to fetch today's activity: ${error.message}`);
    }

    return data || {
      questions_answered: 0,
      questions_correct: 0,
      practice_time_seconds: 0,
      tests_completed: 0,
      goal_achieved: false
    };
  } catch (error) {
    console.error('Error fetching today activity:', error);
    throw error;
  }
}

export async function getUserStreakInfo() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('users')
      .select('current_streak, longest_streak, last_activity_date, daily_goal_questions')
      .eq('uid', user.id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch streak info: ${error.message}`);
    }

    return data || {
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: null,
      daily_goal_questions: 20
    };
  } catch (error) {
    console.error('Error fetching streak info:', error);
    throw error;
  }
}

export async function getWeeklyStreakData() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the last 7 days of activity
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // Last 7 days including today

    const { data, error } = await supabase
      .from('daily_activities')
      .select('activity_date, goal_achieved, questions_answered')
      .eq('user_id', user.id)
      .gte('activity_date', startDate.toISOString().split('T')[0])
      .lte('activity_date', endDate.toISOString().split('T')[0])
      .order('activity_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch weekly streak data: ${error.message}`);
    }

    // Create array for last 7 days
    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(endDate.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayActivity = data?.find(d => d.activity_date === dateStr);
      weekData.push({
        date: dateStr,
        hasActivity: !!dayActivity && dayActivity.questions_answered > 0,
        goalAchieved: dayActivity?.goal_achieved || false,
        questionsAnswered: dayActivity?.questions_answered || 0
      });
    }

    return weekData;
  } catch (error) {
    console.error('Error fetching weekly streak data:', error);
    throw error;
  }
}

export async function updateDailyGoal(newGoal: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Update user's daily goal
    const { error: userError } = await supabase
      .from('users')
      .update({ daily_goal_questions: newGoal })
      .eq('uid', user.id);

    if (userError) {
      throw new Error(`Failed to update user goal: ${userError.message}`);
    }

    // Update or insert daily goal record
    // First, deactivate any existing active goals of this type
    await supabase
      .from('daily_goals')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('goal_type', 'questions')
      .eq('is_active', true);

    // Then insert the new active goal
    const { error: goalError } = await supabase
      .from('daily_goals')
      .insert({
        user_id: user.id,
        goal_type: 'questions',
        target_value: newGoal,
        is_active: true
      });

    if (goalError) {
      throw new Error(`Failed to update daily goal: ${goalError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating daily goal:', error);
    throw error;
  }
}

export async function getQuestionsAnsweredToday() {
  try {
    const todayActivity = await getTodayActivity();
    return todayActivity.questions_answered || 0;
  } catch (error) {
    console.error('Error fetching questions answered today:', error);
    return 0;
  }
}

export async function updateDailyLoginActivity() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if we already updated activity today
    const today = new Date().toISOString().split('T')[0];
    const { data: userInfo } = await supabase
      .from('users')
      .select('last_activity_date')
      .eq('uid', user.id)
      .single();

    console.log('🔍 Login activity check:', {
      userId: user.id,
      today,
      lastActivityDate: userInfo?.last_activity_date,
      needsUpdate: !userInfo?.last_activity_date || userInfo.last_activity_date !== today
    });

    // Only update if this is the first activity today
    if (!userInfo?.last_activity_date || userInfo.last_activity_date !== today) {
      console.log('🔄 Calling update_daily_activity_and_streak RPC...');
      
      // When user logs in, count it as 1 question answered to start/maintain streak
      const { data, error } = await supabase.rpc('update_daily_activity_and_streak', {
        p_user_id: user.id,
        p_questions_answered: 1 // Login counts as activity
      });

      if (error) {
        console.error('❌ RPC Error:', error);
        throw new Error(`Failed to update daily login activity: ${error.message}`);
      }

      console.log('✅ Daily login activity updated:', data);
      
      // Check if the function returned an error
      if (data && typeof data === 'object' && data.success === false) {
        console.error('❌ Function returned error:', data.error);
        throw new Error(`Function error: ${data.error}`);
      }
      
      return data;
    } else {
      console.log('📅 Daily activity already updated today');
      return null;
    }
  } catch (error) {
    console.error('Error updating daily login activity:', error);
    throw error;
  }
}

// Debug function to check raw database state
export async function checkRawDatabaseState() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('🔍 Checking raw database state for user:', user.id);

    // Check users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('uid, current_streak, longest_streak, last_activity_date, daily_goal_questions')
      .eq('uid', user.id)
      .single();

    if (userError) {
      console.error('❌ User data error:', userError);
    } else {
      console.log('👤 User data:', userData);
    }

    // Check daily_activities table
    const today = new Date().toISOString().split('T')[0];
    const { data: activityData, error: activityError } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', user.id)
      .eq('activity_date', today)
      .single();

    if (activityError && activityError.code !== 'PGRST116') {
      console.error('❌ Activity data error:', activityError);
    } else {
      console.log('📅 Today activity data:', activityData || 'No activity record for today');
    }

    // Check study_streaks table
    const { data: streakData, error: streakError } = await supabase
      .from('study_streaks')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_current', true)
      .single();

    if (streakError && streakError.code !== 'PGRST116') {
      console.error('❌ Streak data error:', streakError);
    } else {
      console.log('🔥 Current streak data:', streakData || 'No current streak record');
    }

    return {
      userData,
      activityData,
      streakData,
      userId: user.id,
      today
    };
  } catch (error) {
    console.error('❌ Error checking raw database state:', error);
    throw error;
  }
}