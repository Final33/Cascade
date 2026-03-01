-- FRQ Database Setup for Supabase
-- This script creates tables for storing Free Response Questions with variable parts

-- Enable RLS
ALTER TABLE IF EXISTS frq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS frq_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS frq_rubrics ENABLE ROW LEVEL SECURITY;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS frq_rubrics CASCADE;
DROP TABLE IF EXISTS frq_parts CASCADE;
DROP TABLE IF EXISTS frq_questions CASCADE;

-- Create FRQ Questions table
CREATE TABLE frq_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    unit VARCHAR(200) NOT NULL,
    topic VARCHAR(300) NOT NULL,
    question TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) DEFAULT 'Medium',
    total_points INTEGER NOT NULL DEFAULT 0,
    time_limit INTEGER NOT NULL DEFAULT 25, -- in minutes
    exam_type VARCHAR(50) DEFAULT 'Practice',
    year INTEGER,
    sample_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true
);

-- Create FRQ Parts table (for multi-part questions)
CREATE TABLE frq_parts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    frq_question_id UUID REFERENCES frq_questions(id) ON DELETE CASCADE,
    part_label VARCHAR(10) NOT NULL, -- e.g., 'a', 'b', 'c', '1', '2', etc.
    part_question TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 1,
    hint TEXT,
    sample_answer TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(frq_question_id, part_label)
);

-- Create FRQ Rubrics table (for detailed grading criteria)
CREATE TABLE frq_rubrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    frq_question_id UUID REFERENCES frq_questions(id) ON DELETE CASCADE,
    part_label VARCHAR(10), -- NULL for overall rubric, specific part for part-specific rubric
    criteria TEXT NOT NULL,
    max_points INTEGER NOT NULL,
    grading_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (frq_question_id, part_label) REFERENCES frq_parts(frq_question_id, part_label) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes for better performance
CREATE INDEX idx_frq_questions_subject ON frq_questions(subject);
CREATE INDEX idx_frq_questions_unit ON frq_questions(unit);
CREATE INDEX idx_frq_questions_topic ON frq_questions(topic);
CREATE INDEX idx_frq_questions_difficulty ON frq_questions(difficulty);
CREATE INDEX idx_frq_questions_active ON frq_questions(is_active);
CREATE INDEX idx_frq_parts_question_id ON frq_parts(frq_question_id);
CREATE INDEX idx_frq_parts_order ON frq_parts(frq_question_id, order_index);
CREATE INDEX idx_frq_rubrics_question_id ON frq_rubrics(frq_question_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_frq_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_frq_questions_updated_at 
    BEFORE UPDATE ON frq_questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_frq_updated_at_column();

-- Create function to automatically calculate total_points
CREATE OR REPLACE FUNCTION calculate_frq_total_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the total_points in frq_questions based on sum of parts
    UPDATE frq_questions 
    SET total_points = (
        SELECT COALESCE(SUM(points), 0) 
        FROM frq_parts 
        WHERE frq_question_id = NEW.frq_question_id
    )
    WHERE id = NEW.frq_question_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-calculate total points when parts are added/updated/deleted
CREATE TRIGGER calculate_total_points_on_insert
    AFTER INSERT ON frq_parts
    FOR EACH ROW
    EXECUTE FUNCTION calculate_frq_total_points();

CREATE TRIGGER calculate_total_points_on_update
    AFTER UPDATE ON frq_parts
    FOR EACH ROW
    EXECUTE FUNCTION calculate_frq_total_points();

CREATE TRIGGER calculate_total_points_on_delete
    AFTER DELETE ON frq_parts
    FOR EACH ROW
    EXECUTE FUNCTION calculate_frq_total_points();

-- RLS Policies

-- FRQ Questions policies
CREATE POLICY "Anyone can view active FRQ questions" ON frq_questions
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all FRQ questions" ON frq_questions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert FRQ questions" ON frq_questions
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Only admins can update FRQ questions" ON frq_questions
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Only admins can delete FRQ questions" ON frq_questions
    FOR DELETE USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- FRQ Parts policies
CREATE POLICY "Anyone can view FRQ parts for active questions" ON frq_parts
    FOR SELECT USING (
        frq_question_id IN (
            SELECT id FROM frq_questions WHERE is_active = true
        )
    );

CREATE POLICY "Authenticated users can view all FRQ parts" ON frq_parts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage FRQ parts" ON frq_parts
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- FRQ Rubrics policies
CREATE POLICY "Anyone can view FRQ rubrics for active questions" ON frq_rubrics
    FOR SELECT USING (
        frq_question_id IN (
            SELECT id FROM frq_questions WHERE is_active = true
        )
    );

CREATE POLICY "Authenticated users can view all FRQ rubrics" ON frq_rubrics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage FRQ rubrics" ON frq_rubrics
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Insert sample FRQ data (migrating from local data)
INSERT INTO frq_questions (
    id,
    subject,
    unit,
    topic,
    question,
    difficulty,
    total_points,
    time_limit,
    exam_type,
    year,
    sample_response
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'AP Calculus AB',
    'Applications of Derivatives',
    'Optimization',
    'A farmer has 200 feet of fencing and wants to enclose a rectangular area and then divide it into two equal parts with a fence parallel to one of the sides.',
    'Medium',
    0, -- Will be calculated automatically
    25,
    'Practice',
    2023,
    'Let x be the width and y be the length. The constraint is 3x + 2y = 200. The area function is A = xy. Using substitution and calculus, the maximum area occurs when x = 100/3 feet and y = 50 feet.'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'AP Calculus AB',
    'Integration Techniques',
    'Definite Integrals',
    'Water is flowing into a tank at a rate of R(t) = 6t² + 4t gallons per minute, where t is measured in minutes.',
    'Hard',
    0, -- Will be calculated automatically
    30,
    'Practice',
    2023,
    'The total amount is the definite integral of the rate function. Part (a): ∫₀⁵(6t² + 4t)dt = [2t³ + 2t²]₀⁵ = 250 + 50 = 300 gallons. Part (b): Set up and solve the equation for when the tank reaches capacity.'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'AP Calculus AB',
    'Limits and Continuity',
    'Limits',
    'Consider the piecewise function f(x) defined below.',
    'Easy',
    0, -- Will be calculated automatically
    20,
    'Practice',
    2023,
    'Analyze continuity by checking if the left and right limits exist and equal the function value at the point of interest. Use algebraic manipulation and limit properties.'
);

-- Insert FRQ parts for the first question (Optimization)
INSERT INTO frq_parts (frq_question_id, part_label, part_question, points, hint, sample_answer, order_index) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'a',
    'Find the dimensions that will maximize the enclosed area.',
    4,
    'Set up the constraint equation using the total fencing available.',
    'Width = 100/3 feet, Length = 50 feet',
    1
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'b',
    'What is the maximum area that can be enclosed?',
    3,
    'Use the dimensions from part (a) to calculate the area.',
    'Maximum area = (100/3) × 50 = 5000/3 ≈ 1666.67 square feet',
    2
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'c',
    'Justify that your answer gives a maximum and not a minimum.',
    2,
    'Use the second derivative test or analyze the behavior of the function.',
    'The second derivative is negative, confirming a maximum. Alternatively, check endpoint behavior.',
    3
);

-- Insert FRQ parts for the second question (Integration)
INSERT INTO frq_parts (frq_question_id, part_label, part_question, points, hint, sample_answer, order_index) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    'a',
    'How much water flows into the tank during the first 5 minutes?',
    3,
    'Integrate the rate function from t=0 to t=5.',
    '∫₀⁵(6t² + 4t)dt = 300 gallons',
    1
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'b',
    'If the tank can hold 500 gallons, at what time will it be full?',
    4,
    'Set up the equation ∫₀ᵗ(6t² + 4t)dt = 500 and solve for t.',
    'Solve 2t³ + 2t² = 500, which gives t ≈ 6.3 minutes',
    2
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'c',
    'Find the average rate of flow during the first 3 minutes.',
    2,
    'Use the formula for average value of a function over an interval.',
    'Average rate = (1/3)∫₀³(6t² + 4t)dt = 24 gallons per minute',
    3
);

-- Insert FRQ parts for the third question (Limits)
INSERT INTO frq_parts (frq_question_id, part_label, part_question, points, hint, sample_answer, order_index) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'a',
    'Determine if the function is continuous at x = 2.',
    3,
    'Check if lim(x→2) f(x) = f(2).',
    'The function is continuous at x = 2 because the left and right limits both equal f(2).',
    1
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'b',
    'Find the limit as x approaches 0.',
    2,
    'Analyze the behavior of each piece of the function near x = 0.',
    'lim(x→0) f(x) = 3',
    2
);

-- Insert sample rubrics
INSERT INTO frq_rubrics (frq_question_id, part_label, criteria, max_points, grading_notes) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'a',
    'Correctly sets up constraint equation (1 pt), correctly expresses area as function of one variable (1 pt), correctly takes derivative (1 pt), correctly solves for critical points (1 pt)',
    4,
    'Award partial credit for correct setup even if calculation errors occur.'
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'b',
    'Uses correct dimensions from part (a) (1 pt), correctly calculates area (2 pts)',
    3,
    'If part (a) is incorrect, award points for correct method using their answer.'
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'c',
    'Uses second derivative test OR analyzes endpoints/behavior (2 pts)',
    2,
    'Accept multiple valid justification methods.'
);

-- Create view for easy FRQ retrieval with parts
CREATE OR REPLACE VIEW frq_questions_with_parts AS
SELECT 
    fq.*,
    COALESCE(
        json_agg(
            json_build_object(
                'id', fp.id,
                'part_label', fp.part_label,
                'part_question', fp.part_question,
                'points', fp.points,
                'hint', fp.hint,
                'sample_answer', fp.sample_answer,
                'order_index', fp.order_index
            ) ORDER BY fp.order_index
        ) FILTER (WHERE fp.id IS NOT NULL),
        '[]'::json
    ) as parts
FROM frq_questions fq
LEFT JOIN frq_parts fp ON fq.id = fp.frq_question_id
WHERE fq.is_active = true
GROUP BY fq.id, fq.subject, fq.unit, fq.topic, fq.question, fq.difficulty, 
         fq.total_points, fq.time_limit, fq.exam_type, fq.year, fq.sample_response,
         fq.created_at, fq.updated_at, fq.created_by, fq.is_active;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON frq_questions_with_parts TO anon, authenticated;
GRANT ALL ON frq_questions, frq_parts, frq_rubrics TO authenticated;

-- Notification for completion
DO $$ 
BEGIN 
    RAISE NOTICE 'FRQ database setup completed successfully!';
    RAISE NOTICE 'Created tables: frq_questions, frq_parts, frq_rubrics';
    RAISE NOTICE 'Created view: frq_questions_with_parts';
    RAISE NOTICE 'Inserted sample data with 3 FRQ questions and their parts';
END $$;
