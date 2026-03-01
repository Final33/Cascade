-- Simplified FRQ Schema Update
-- Updates the database to support the four base FRQ types (FRQ, DBQ, LEQ, SAQ)

-- Add new columns to frq_questions table for simplified FRQ type support
ALTER TABLE frq_questions ADD COLUMN IF NOT EXISTS frq_specific_data JSONB;

-- Update existing columns if they exist, otherwise add them
DO $$ 
BEGIN
    -- Check if frq_type column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'frq_questions' AND column_name = 'frq_type') THEN
        ALTER TABLE frq_questions ADD COLUMN frq_type VARCHAR(20);
    END IF;
    
    -- Update max_points column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'frq_questions' AND column_name = 'max_points') THEN
        ALTER TABLE frq_questions ADD COLUMN max_points INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_frq_questions_frq_type ON frq_questions(frq_type);
CREATE INDEX IF NOT EXISTS idx_frq_questions_subject_frq_type ON frq_questions(subject, frq_type);
CREATE INDEX IF NOT EXISTS idx_frq_questions_frq_specific_data ON frq_questions USING GIN(frq_specific_data);

-- Update the existing view to include new columns
DROP VIEW IF EXISTS frq_questions_with_parts;
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
    ) AS parts
FROM frq_questions fq
LEFT JOIN frq_parts fp ON fq.id = fp.frq_question_id
WHERE fq.is_active = true
GROUP BY fq.id, fq.subject, fq.unit, fq.topic, fq.question, fq.difficulty,
         fq.total_points, fq.time_limit, fq.exam_type, fq.year, fq.sample_response,
         fq.stimulus_image_url, fq.stimulus_image_description, 
         fq.stimulus_image_2_url, fq.stimulus_image_2_description,
         fq.frq_type, fq.frq_specific_data, fq.max_points,
         fq.created_at, fq.updated_at, fq.created_by, fq.is_active;

-- Grant permissions
GRANT SELECT ON frq_questions_with_parts TO anon, authenticated;

-- Add comments for documentation
COMMENT ON COLUMN frq_questions.frq_type IS 'Base FRQ type: frq, dbq, leq, or saq';
COMMENT ON COLUMN frq_questions.frq_specific_data IS 'JSON data specific to the FRQ type (e.g., document count for DBQ, thinking skill for LEQ)';
COMMENT ON COLUMN frq_questions.max_points IS 'Maximum points possible for this FRQ';

-- Clean up any old complex columns if they exist (optional)
DO $$ 
BEGIN
    -- Remove complex columns that are no longer needed
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'frq_questions' AND column_name = 'frq_type_config') THEN
        ALTER TABLE frq_questions DROP COLUMN frq_type_config;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'frq_questions' AND column_name = 'class_specific_data') THEN
        ALTER TABLE frq_questions DROP COLUMN class_specific_data;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'frq_questions' AND column_name = 'rubric_type') THEN
        ALTER TABLE frq_questions DROP COLUMN rubric_type;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'frq_questions' AND column_name = 'guidelines') THEN
        ALTER TABLE frq_questions DROP COLUMN guidelines;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'frq_questions' AND column_name = 'examples') THEN
        ALTER TABLE frq_questions DROP COLUMN examples;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors if columns don't exist
        NULL;
END $$;

-- Insert sample data for different FRQ types
INSERT INTO frq_questions (
    subject, unit, topic, question, difficulty, total_points, time_limit, 
    exam_type, year, frq_type, frq_specific_data, max_points, 
    stimulus_image_url, stimulus_image_description, 
    created_by, is_active
) VALUES 
-- Sample DBQ for AP World History
(
    'AP World History', 
    'Unit 3: Land-Based Empires', 
    'Ottoman Empire', 
    'Using the documents, analyze the methods used by the Ottoman Empire to maintain control over its diverse population from 1450 to 1750.',
    'Medium',
    0, -- Will be calculated by trigger
    60,
    'Practice',
    2024,
    'dbq',
    '{"historical_context": "The Ottoman Empire expanded rapidly from 1450-1750, incorporating diverse ethnic and religious groups.", "document_count": 7, "additional_document_suggestion": true, "document_types": "Government decrees, tax records, religious texts, traveler accounts"}',
    7,
    NULL,
    NULL,
    (SELECT uid FROM users WHERE admin = true LIMIT 1),
    true
),
-- Sample LEQ for AP US History  
(
    'AP US History',
    'Unit 4: 1800-1848',
    'Westward Expansion',
    'Evaluate the extent to which westward expansion from 1800 to 1848 affected the political and social development of the United States.',
    'Hard',
    0, -- Will be calculated by trigger
    40,
    'Practice', 
    2024,
    'leq',
    '{"historical_thinking_skill": "change_continuity", "time_period": "1800-1848", "geographic_focus": "americas", "thematic_focus": "Political and Social Development"}',
    6,
    NULL,
    NULL,
    (SELECT uid FROM users WHERE admin = true LIMIT 1),
    true
),
-- Sample SAQ for AP World History
(
    'AP World History',
    'Unit 1: The Global Tapestry',
    'Silk Roads',
    'Use the image and your knowledge of world history to answer all parts of the question that follows.',
    'Easy',
    0, -- Will be calculated by trigger  
    15,
    'Practice',
    2024,
    'saq',
    '{"number_of_parts": 3, "has_stimulus": true, "stimulus_type": "image", "task_verbs": "Identify, Explain, Analyze"}',
    3,
    NULL,
    'Map showing Silk Road trade routes',
    (SELECT uid FROM users WHERE admin = true LIMIT 1),
    true
),
-- Sample standard FRQ for AP Calculus AB
(
    'AP Calculus AB',
    'Unit 2: Differentiation',
    'Applications of Derivatives',
    'A particle moves along the x-axis so that its position at time t ≥ 0 is given by x(t) = t³ - 6t² + 9t + 1.',
    'Medium',
    0, -- Will be calculated by trigger
    25,
    'Practice',
    2024,
    'frq',
    '{"question_context": "Motion along a line with position function", "requires_calculations": true, "requires_graphs": true, "requires_data_analysis": false}',
    9,
    NULL,
    NULL,
    (SELECT uid FROM users WHERE admin = true LIMIT 1),
    true
)
ON CONFLICT DO NOTHING;

-- Add corresponding parts for the sample questions
INSERT INTO frq_parts (frq_question_id, part_label, part_question, points, hint, sample_answer, order_index)
SELECT 
    fq.id,
    'a',
    CASE 
        WHEN fq.frq_type = 'dbq' THEN 'Develop a thesis that responds to the prompt.'
        WHEN fq.frq_type = 'leq' THEN 'Develop a thesis that evaluates the extent to which westward expansion affected political and social development.'
        WHEN fq.frq_type = 'saq' THEN 'Identify ONE way the Silk Roads facilitated cultural exchange.'
        WHEN fq.frq_type = 'frq' THEN 'Find the velocity of the particle at time t = 2.'
    END,
    CASE 
        WHEN fq.frq_type = 'dbq' THEN 1
        WHEN fq.frq_type = 'leq' THEN 1  
        WHEN fq.frq_type = 'saq' THEN 1
        WHEN fq.frq_type = 'frq' THEN 3
    END,
    '',
    '',
    1
FROM frq_questions fq 
WHERE fq.frq_type IN ('dbq', 'leq', 'saq', 'frq') 
AND NOT EXISTS (SELECT 1 FROM frq_parts fp WHERE fp.frq_question_id = fq.id);

-- Notification for completion
DO $$ 
BEGIN 
    RAISE NOTICE 'Simplified FRQ schema update completed successfully!';
    RAISE NOTICE 'Added support for base FRQ types: FRQ, DBQ, LEQ, SAQ';
    RAISE NOTICE 'Updated view: frq_questions_with_parts';
    RAISE NOTICE 'Inserted sample questions for each FRQ type';
END $$;
