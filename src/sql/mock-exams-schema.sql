-- =====================================================
-- CLUSION MOCK EXAMS DATABASE SCHEMA
-- Production-ready schema for organizing practice tests
-- =====================================================

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. AP CLASSES TABLE
-- Stores all supported AP classes with metadata
-- =====================================================
CREATE TABLE ap_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'calc-ab', 'csa', 'stats'
    class_name VARCHAR(100) NOT NULL, -- e.g., 'AP Calculus AB'
    display_name VARCHAR(100) NOT NULL, -- e.g., 'Calculus AB'
    category VARCHAR(50) NOT NULL, -- e.g., 'Mathematics', 'Sciences'
    exam_duration_minutes INTEGER NOT NULL DEFAULT 180,
    total_questions INTEGER NOT NULL DEFAULT 40,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PRACTICE TESTS TABLE
-- Stores individual practice test metadata
-- =====================================================
CREATE TABLE practice_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ap_class_id UUID NOT NULL REFERENCES ap_classes(id) ON DELETE CASCADE,
    test_number INTEGER NOT NULL, -- 1, 2, 3, 4, 5
    test_name VARCHAR(100) NOT NULL, -- e.g., 'calc ab mock 1'
    description TEXT,
    difficulty_level VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
    is_published BOOLEAN DEFAULT FALSE,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique test numbers per AP class
    UNIQUE(ap_class_id, test_number)
);

-- =====================================================
-- 3. QUESTION TYPES TABLE
-- Defines different types of questions (MC, FRQ, etc.)
-- =====================================================
CREATE TABLE question_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_code VARCHAR(20) UNIQUE NOT NULL, -- 'mc', 'frq', 'saq', 'dbq', 'leq'
    type_name VARCHAR(50) NOT NULL, -- 'Multiple Choice', 'Free Response'
    description TEXT,
    default_points INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- 4. QUESTIONS TABLE
-- Stores all practice test questions
-- =====================================================
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    practice_test_id UUID NOT NULL REFERENCES practice_tests(id) ON DELETE CASCADE,
    question_type_id UUID NOT NULL REFERENCES question_types(id),
    question_number INTEGER NOT NULL, -- Order within the test
    question_text TEXT NOT NULL,
    question_image_url TEXT, -- Optional image
    points INTEGER NOT NULL DEFAULT 1,
    time_limit_minutes INTEGER, -- Optional time limit per question
    topic VARCHAR(100), -- e.g., 'Limits', 'Derivatives'
    unit VARCHAR(100), -- e.g., 'Unit 1: Limits and Continuity'
    difficulty VARCHAR(20) DEFAULT 'medium',
    explanation TEXT, -- Detailed explanation for the answer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique question numbers per test
    UNIQUE(practice_test_id, question_number)
);

-- =====================================================
-- 5. MULTIPLE CHOICE OPTIONS TABLE
-- Stores options for multiple choice questions
-- =====================================================
CREATE TABLE mc_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_letter CHAR(1) NOT NULL, -- A, B, C, D, E
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique option letters per question
    UNIQUE(question_id, option_letter)
);

-- =====================================================
-- 6. USER TEST ATTEMPTS TABLE
-- Tracks user attempts at practice tests
-- =====================================================
CREATE TABLE user_test_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References users table
    practice_test_id UUID NOT NULL REFERENCES practice_tests(id),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_minutes INTEGER,
    total_score INTEGER DEFAULT 0,
    max_possible_score INTEGER DEFAULT 0,
    percentage_score DECIMAL(5,2), -- Calculated field
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. USER ANSWERS TABLE
-- Stores individual user answers
-- =====================================================
CREATE TABLE user_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES user_test_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),
    selected_option_id UUID REFERENCES mc_options(id), -- For MC questions
    free_response_text TEXT, -- For FRQ questions
    points_earned INTEGER DEFAULT 0,
    is_correct BOOLEAN,
    time_spent_seconds INTEGER,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one answer per question per attempt
    UNIQUE(attempt_id, question_id)
);

-- =====================================================
-- 8. PRACTICE TEST ANALYTICS TABLE
-- Aggregated analytics for each practice test
-- =====================================================
CREATE TABLE practice_test_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    practice_test_id UUID NOT NULL REFERENCES practice_tests(id) ON DELETE CASCADE,
    total_attempts INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    average_time_minutes INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0, -- Percentage who complete
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(practice_test_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Primary lookup indexes
CREATE INDEX idx_practice_tests_ap_class ON practice_tests(ap_class_id);
CREATE INDEX idx_questions_practice_test ON questions(practice_test_id);
CREATE INDEX idx_questions_type ON questions(question_type_id);
CREATE INDEX idx_mc_options_question ON mc_options(question_id);
CREATE INDEX idx_user_attempts_user ON user_test_attempts(user_id);
CREATE INDEX idx_user_attempts_test ON user_test_attempts(practice_test_id);
CREATE INDEX idx_user_answers_attempt ON user_answers(attempt_id);
CREATE INDEX idx_user_answers_question ON user_answers(question_id);

-- Performance indexes for common queries
CREATE INDEX idx_practice_tests_published ON practice_tests(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_user_attempts_completed ON user_test_attempts(completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX idx_ap_classes_active ON ap_classes(is_active) WHERE is_active = TRUE;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_ap_classes_updated_at BEFORE UPDATE ON ap_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_practice_tests_updated_at BEFORE UPDATE ON practice_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate percentage score automatically
CREATE OR REPLACE FUNCTION calculate_percentage_score()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.max_possible_score > 0 THEN
        NEW.percentage_score = (NEW.total_score::DECIMAL / NEW.max_possible_score::DECIMAL) * 100;
    ELSE
        NEW.percentage_score = 0;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_user_test_percentage BEFORE INSERT OR UPDATE ON user_test_attempts FOR EACH ROW EXECUTE FUNCTION calculate_percentage_score();

-- =====================================================
-- SEED DATA - INSERT INITIAL AP CLASSES
-- =====================================================

INSERT INTO ap_classes (class_code, class_name, display_name, category, exam_duration_minutes, total_questions) VALUES
-- Mathematics
('calc-ab', 'AP Calculus AB', 'Calculus AB', 'Mathematics', 195, 45),
('calc-bc', 'AP Calculus BC', 'Calculus BC', 'Mathematics', 195, 45),
('precalc', 'AP Precalculus', 'Precalculus', 'Mathematics', 180, 40),
('stats', 'AP Statistics', 'Statistics', 'Mathematics', 180, 40),

-- Sciences
('bio', 'AP Biology', 'Biology', 'Sciences', 180, 60),
('chem', 'AP Chemistry', 'Chemistry', 'Sciences', 180, 60),
('enviro-sci', 'AP Environmental Science', 'Environmental Science', 'Sciences', 180, 80),
('physics-1', 'AP Physics 1', 'Physics 1', 'Sciences', 180, 50),
('physics-2', 'AP Physics 2', 'Physics 2', 'Sciences', 180, 50),
('physics-c-mech', 'AP Physics C: Mechanics', 'Physics C: Mechanics', 'Sciences', 180, 35),
('physics-c-em', 'AP Physics C: Electricity and Magnetism', 'Physics C: E&M', 'Sciences', 180, 35),

-- History & Social Studies
('world-history', 'AP World History', 'World History', 'History & Social Studies', 180, 55),
('us-history', 'AP US History', 'US History', 'History & Social Studies', 180, 55),
('euro-history', 'AP European History', 'European History', 'History & Social Studies', 180, 55),
('us-gov', 'AP US Government', 'US Government', 'History & Social Studies', 180, 55),
('human-geo', 'AP Human Geography', 'Human Geography', 'History & Social Studies', 180, 60),
('psych', 'AP Psychology', 'Psychology', 'History & Social Studies', 180, 100),

-- Economics
('micro-econ', 'AP Microeconomics', 'Microeconomics', 'Economics', 180, 60),
('macro-econ', 'AP Macroeconomics', 'Macroeconomics', 'Economics', 180, 60),

-- English
('eng-lang', 'AP English Language and Composition', 'English Language', 'English', 195, 45),
('eng-lit', 'AP English Literature and Composition', 'English Literature', 'English', 195, 45),

-- Computer Science
('csa', 'AP Computer Science A', 'Computer Science A', 'Computer Science', 180, 40),

-- Arts
('art-history', 'AP Art History', 'Art History', 'Arts', 180, 80);

-- Insert question types
INSERT INTO question_types (type_code, type_name, description, default_points) VALUES
('mc', 'Multiple Choice', 'Multiple choice questions with 4-5 options', 1),
('frq', 'Free Response', 'Free response questions requiring written answers', 4),
('saq', 'Short Answer', 'Short answer questions for history classes', 3),
('dbq', 'Document-Based Question', 'Document-based questions for history classes', 7),
('leq', 'Long Essay Question', 'Long essay questions for history classes', 6);

-- =====================================================
-- USEFUL VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for practice test overview with class info
CREATE VIEW practice_test_overview AS
SELECT 
    pt.id,
    pt.test_name,
    pt.test_number,
    ac.class_name,
    ac.display_name,
    ac.category,
    pt.difficulty_level,
    pt.is_published,
    COUNT(q.id) as question_count,
    SUM(q.points) as total_points,
    pt.created_at
FROM practice_tests pt
JOIN ap_classes ac ON pt.ap_class_id = ac.id
LEFT JOIN questions q ON pt.id = q.practice_test_id
GROUP BY pt.id, ac.class_name, ac.display_name, ac.category;

-- View for user performance analytics
CREATE VIEW user_performance_summary AS
SELECT 
    uta.user_id,
    ac.class_name,
    COUNT(uta.id) as attempts_count,
    AVG(uta.percentage_score) as avg_percentage,
    MAX(uta.percentage_score) as best_score,
    AVG(uta.time_spent_minutes) as avg_time_minutes
FROM user_test_attempts uta
JOIN practice_tests pt ON uta.practice_test_id = pt.id
JOIN ap_classes ac ON pt.ap_class_id = ac.id
WHERE uta.is_completed = TRUE
GROUP BY uta.user_id, ac.class_name;

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE ap_classes IS 'Stores all supported AP classes with exam metadata';
COMMENT ON TABLE practice_tests IS 'Individual practice tests for each AP class';
COMMENT ON TABLE questions IS 'All questions belonging to practice tests';
COMMENT ON TABLE mc_options IS 'Multiple choice options for MC questions';
COMMENT ON TABLE user_test_attempts IS 'User attempts at practice tests';
COMMENT ON TABLE user_answers IS 'Individual answers for each question';
COMMENT ON TABLE practice_test_analytics IS 'Aggregated analytics for practice tests';

COMMENT ON COLUMN ap_classes.class_code IS 'Unique identifier for URL routing (e.g., calc-ab)';
COMMENT ON COLUMN practice_tests.test_number IS 'Sequential number (1-5) for each AP class';
COMMENT ON COLUMN questions.question_number IS 'Order of question within the test';
COMMENT ON COLUMN user_test_attempts.percentage_score IS 'Automatically calculated from total_score/max_possible_score';
