-- =====================================================
-- SAMPLE DATA AND COMMON QUERIES
-- For Prepsy Mock Exams System
-- =====================================================

-- =====================================================
-- SAMPLE PRACTICE TESTS
-- =====================================================

-- Create 5 practice tests for AP Calculus AB
DO $$
DECLARE
    calc_ab_id UUID;
    test_id UUID;
    mc_type_id UUID;
    frq_type_id UUID;
BEGIN
    -- Get AP Calculus AB ID
    SELECT id INTO calc_ab_id FROM ap_classes WHERE class_code = 'calc-ab';
    
    -- Get question type IDs
    SELECT id INTO mc_type_id FROM question_types WHERE type_code = 'mc';
    SELECT id INTO frq_type_id FROM question_types WHERE type_code = 'frq';
    
    -- Create 5 practice tests
    FOR i IN 1..5 LOOP
        INSERT INTO practice_tests (ap_class_id, test_number, test_name, description, is_published)
        VALUES (
            calc_ab_id, 
            i, 
            'calc ab mock ' || i,
            'Comprehensive practice test ' || i || ' covering limits, derivatives, and integration',
            TRUE
        ) RETURNING id INTO test_id;
        
        -- Add 30 multiple choice questions
        FOR j IN 1..30 LOOP
            INSERT INTO questions (practice_test_id, question_type_id, question_number, question_text, points, topic, unit)
            VALUES (
                test_id,
                mc_type_id,
                j,
                'Sample multiple choice question ' || j || ' for Calculus AB Mock ' || i,
                1,
                CASE 
                    WHEN j <= 10 THEN 'Limits'
                    WHEN j <= 20 THEN 'Derivatives'
                    ELSE 'Integration'
                END,
                CASE 
                    WHEN j <= 10 THEN 'Unit 1: Limits and Continuity'
                    WHEN j <= 20 THEN 'Unit 2: Differentiation'
                    ELSE 'Unit 6: Integration'
                END
            );
        END LOOP;
        
        -- Add 6 free response questions
        FOR j IN 31..36 LOOP
            INSERT INTO questions (practice_test_id, question_type_id, question_number, question_text, points, topic, unit)
            VALUES (
                test_id,
                frq_type_id,
                j,
                'Free response question ' || (j-30) || ': Solve the following calculus problem showing all work.',
                CASE 
                    WHEN j <= 33 THEN 9  -- First 3 FRQs worth 9 points each
                    ELSE 6               -- Last 3 FRQs worth 6 points each
                END,
                'Applications',
                'Unit 4: Applications of Differentiation'
            );
        END LOOP;
        
        -- Update total points for the test
        UPDATE practice_tests 
        SET total_points = (SELECT SUM(points) FROM questions WHERE practice_test_id = test_id)
        WHERE id = test_id;
        
    END LOOP;
END $$;

-- Create sample practice tests for Computer Science A
DO $$
DECLARE
    csa_id UUID;
    test_id UUID;
    mc_type_id UUID;
    frq_type_id UUID;
BEGIN
    SELECT id INTO csa_id FROM ap_classes WHERE class_code = 'csa';
    SELECT id INTO mc_type_id FROM question_types WHERE type_code = 'mc';
    SELECT id INTO frq_type_id FROM question_types WHERE type_code = 'frq';
    
    FOR i IN 1..5 LOOP
        INSERT INTO practice_tests (ap_class_id, test_number, test_name, description, is_published)
        VALUES (
            csa_id, 
            i, 
            'csa mock ' || i,
            'Computer Science A practice test ' || i || ' covering OOP, data structures, and algorithms',
            TRUE
        ) RETURNING id INTO test_id;
        
        -- Add 40 multiple choice questions
        FOR j IN 1..40 LOOP
            INSERT INTO questions (practice_test_id, question_type_id, question_number, question_text, points, topic, unit)
            VALUES (
                test_id,
                mc_type_id,
                j,
                'Java programming question ' || j || ' for CSA Mock ' || i,
                1,
                CASE 
                    WHEN j <= 10 THEN 'Primitive Types'
                    WHEN j <= 20 THEN 'Using Objects'
                    WHEN j <= 30 THEN 'Arrays'
                    ELSE 'Inheritance'
                END,
                'Unit ' || CEIL(j/10.0)::TEXT
            );
        END LOOP;
        
        -- Add 4 free response questions
        FOR j IN 41..44 LOOP
            INSERT INTO questions (practice_test_id, question_type_id, question_number, question_text, points, topic, unit)
            VALUES (
                test_id,
                frq_type_id,
                j,
                'Free response question ' || (j-40) || ': Write a Java method that implements the specified functionality.',
                9,
                'Programming',
                'Unit 5: Writing Classes'
            );
        END LOOP;
        
        UPDATE practice_tests 
        SET total_points = (SELECT SUM(points) FROM questions WHERE practice_test_id = test_id)
        WHERE id = test_id;
        
    END LOOP;
END $$;

-- =====================================================
-- SAMPLE MULTIPLE CHOICE OPTIONS
-- =====================================================

-- Add options for the first few MC questions as examples
DO $$
DECLARE
    question_record RECORD;
    correct_option CHAR(1);
BEGIN
    -- Add options for first 10 questions across all tests
    FOR question_record IN 
        SELECT q.id as question_id, q.question_number
        FROM questions q 
        JOIN question_types qt ON q.question_type_id = qt.id 
        WHERE qt.type_code = 'mc' 
        AND q.question_number <= 10
        LIMIT 50
    LOOP
        -- Randomly assign correct answer
        correct_option := CHR(65 + (question_record.question_number % 4)); -- A, B, C, or D
        
        -- Insert 4 options
        FOR i IN 0..3 LOOP
            INSERT INTO mc_options (question_id, option_letter, option_text, is_correct)
            VALUES (
                question_record.question_id,
                CHR(65 + i), -- A, B, C, D
                'Option ' || CHR(65 + i) || ' for question ' || question_record.question_number,
                CHR(65 + i) = correct_option
            );
        END LOOP;
    END LOOP;
END $$;

-- =====================================================
-- COMMON QUERIES FOR THE APPLICATION
-- =====================================================

-- Query 1: Get all practice tests for a specific AP class
-- Usage: Get all Calculus AB mock exams
/*
SELECT 
    pt.id,
    pt.test_name,
    pt.test_number,
    pt.description,
    pt.total_points,
    COUNT(q.id) as question_count
FROM practice_tests pt
JOIN ap_classes ac ON pt.ap_class_id = ac.id
LEFT JOIN questions q ON pt.id = q.practice_test_id
WHERE ac.class_code = 'calc-ab' 
AND pt.is_published = TRUE
GROUP BY pt.id, pt.test_name, pt.test_number, pt.description, pt.total_points
ORDER BY pt.test_number;
*/

-- Query 2: Get a complete practice test with all questions
-- Usage: Load a specific mock exam for taking
/*
SELECT 
    pt.test_name,
    pt.description,
    ac.exam_duration_minutes,
    q.id as question_id,
    q.question_number,
    q.question_text,
    q.points,
    q.topic,
    qt.type_name as question_type,
    array_agg(
        json_build_object(
            'letter', mo.option_letter,
            'text', mo.option_text,
            'id', mo.id
        ) ORDER BY mo.option_letter
    ) FILTER (WHERE mo.id IS NOT NULL) as options
FROM practice_tests pt
JOIN ap_classes ac ON pt.ap_class_id = ac.id
JOIN questions q ON pt.id = q.practice_test_id
JOIN question_types qt ON q.question_type_id = qt.id
LEFT JOIN mc_options mo ON q.id = mo.question_id
WHERE pt.id = 'YOUR_TEST_ID_HERE'
GROUP BY pt.test_name, pt.description, ac.exam_duration_minutes, q.id, q.question_number, q.question_text, q.points, q.topic, qt.type_name
ORDER BY q.question_number;
*/

-- Query 3: Get user's test history and performance
-- Usage: Show user's progress across all AP classes
/*
SELECT 
    ac.display_name as class_name,
    pt.test_name,
    uta.percentage_score,
    uta.time_spent_minutes,
    uta.completed_at,
    RANK() OVER (PARTITION BY ac.id ORDER BY uta.percentage_score DESC) as rank_in_class
FROM user_test_attempts uta
JOIN practice_tests pt ON uta.practice_test_id = pt.id
JOIN ap_classes ac ON pt.ap_class_id = ac.id
WHERE uta.user_id = 'YOUR_USER_ID_HERE'
AND uta.is_completed = TRUE
ORDER BY uta.completed_at DESC;
*/

-- Query 4: Get analytics for a practice test
-- Usage: Show how students are performing on a specific test
/*
SELECT 
    pt.test_name,
    COUNT(uta.id) as total_attempts,
    COUNT(CASE WHEN uta.is_completed THEN 1 END) as completed_attempts,
    ROUND(AVG(uta.percentage_score), 2) as average_score,
    ROUND(AVG(uta.time_spent_minutes), 0) as average_time_minutes,
    MIN(uta.percentage_score) as min_score,
    MAX(uta.percentage_score) as max_score,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY uta.percentage_score) as median_score
FROM practice_tests pt
LEFT JOIN user_test_attempts uta ON pt.id = uta.practice_test_id
WHERE pt.id = 'YOUR_TEST_ID_HERE'
GROUP BY pt.test_name;
*/

-- Query 5: Get question-level analytics
-- Usage: See which questions are most difficult
/*
SELECT 
    q.question_number,
    q.question_text,
    q.topic,
    COUNT(ua.id) as total_answers,
    COUNT(CASE WHEN ua.is_correct THEN 1 END) as correct_answers,
    ROUND(
        COUNT(CASE WHEN ua.is_correct THEN 1 END)::DECIMAL / 
        NULLIF(COUNT(ua.id), 0) * 100, 2
    ) as success_rate,
    AVG(ua.time_spent_seconds) as avg_time_seconds
FROM questions q
LEFT JOIN user_answers ua ON q.id = ua.question_id
WHERE q.practice_test_id = 'YOUR_TEST_ID_HERE'
GROUP BY q.id, q.question_number, q.question_text, q.topic
ORDER BY success_rate ASC; -- Show hardest questions first
*/

-- =====================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to get available practice tests for a class
CREATE OR REPLACE FUNCTION get_practice_tests_for_class(class_code_param VARCHAR)
RETURNS TABLE (
    test_id UUID,
    test_name VARCHAR,
    test_number INTEGER,
    question_count BIGINT,
    total_points BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pt.id,
        pt.test_name,
        pt.test_number,
        COUNT(q.id),
        COALESCE(SUM(q.points), 0)
    FROM practice_tests pt
    JOIN ap_classes ac ON pt.ap_class_id = ac.id
    LEFT JOIN questions q ON pt.id = q.practice_test_id
    WHERE ac.class_code = class_code_param 
    AND pt.is_published = TRUE
    GROUP BY pt.id, pt.test_name, pt.test_number
    ORDER BY pt.test_number;
END;
$$ LANGUAGE plpgsql;

-- Function to start a new test attempt
CREATE OR REPLACE FUNCTION start_test_attempt(
    user_id_param UUID,
    test_id_param UUID
) RETURNS UUID AS $$
DECLARE
    attempt_id UUID;
    max_score INTEGER;
BEGIN
    -- Get max possible score for the test
    SELECT COALESCE(SUM(points), 0) INTO max_score
    FROM questions 
    WHERE practice_test_id = test_id_param;
    
    -- Create new attempt
    INSERT INTO user_test_attempts (user_id, practice_test_id, max_possible_score)
    VALUES (user_id_param, test_id_param, max_score)
    RETURNING id INTO attempt_id;
    
    RETURN attempt_id;
END;
$$ LANGUAGE plpgsql;

-- Function to submit an answer
CREATE OR REPLACE FUNCTION submit_answer(
    attempt_id_param UUID,
    question_id_param UUID,
    selected_option_id_param UUID DEFAULT NULL,
    free_response_text_param TEXT DEFAULT NULL,
    time_spent_param INTEGER DEFAULT 0
) RETURNS BOOLEAN AS $$
DECLARE
    is_correct_answer BOOLEAN := FALSE;
    question_points INTEGER;
    earned_points INTEGER := 0;
BEGIN
    -- Get question points
    SELECT points INTO question_points FROM questions WHERE id = question_id_param;
    
    -- Check if multiple choice answer is correct
    IF selected_option_id_param IS NOT NULL THEN
        SELECT is_correct INTO is_correct_answer 
        FROM mc_options 
        WHERE id = selected_option_id_param;
        
        IF is_correct_answer THEN
            earned_points := question_points;
        END IF;
    END IF;
    
    -- Insert or update the answer
    INSERT INTO user_answers (
        attempt_id, 
        question_id, 
        selected_option_id, 
        free_response_text, 
        points_earned, 
        is_correct, 
        time_spent_seconds
    ) VALUES (
        attempt_id_param,
        question_id_param,
        selected_option_id_param,
        free_response_text_param,
        earned_points,
        is_correct_answer,
        time_spent_param
    )
    ON CONFLICT (attempt_id, question_id) 
    DO UPDATE SET
        selected_option_id = EXCLUDED.selected_option_id,
        free_response_text = EXCLUDED.free_response_text,
        points_earned = EXCLUDED.points_earned,
        is_correct = EXCLUDED.is_correct,
        time_spent_seconds = EXCLUDED.time_spent_seconds,
        answered_at = NOW();
    
    RETURN is_correct_answer;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PERFORMANCE MONITORING QUERIES
-- =====================================================

-- Monitor database performance
/*
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
AND tablename IN ('practice_tests', 'questions', 'user_test_attempts');

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
*/
