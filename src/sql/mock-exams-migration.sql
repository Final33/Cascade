-- =====================================================
-- PREPSY MOCK EXAMS MIGRATION SCRIPT
-- Simple migration that works with existing ap_classes table
-- Focus: Create practice tests and questions for existing AP classes
-- =====================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 1: VERIFY EXISTING AP_CLASSES TABLE
-- =====================================================

-- Verify ap_classes table exists and log its structure
DO $$
DECLARE
    table_exists BOOLEAN;
    column_info RECORD;
BEGIN
    -- Check if ap_classes table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'ap_classes'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE 'Found existing ap_classes table with columns:';
        FOR column_info IN 
            SELECT column_name, data_type, character_maximum_length, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'ap_classes'
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE '  - %: % (%) %', 
                column_info.column_name, 
                column_info.data_type,
                COALESCE(column_info.character_maximum_length::text, 'no limit'),
                CASE WHEN column_info.is_nullable = 'NO' THEN 'NOT NULL' ELSE 'nullable' END;
        END LOOP;
    ELSE
        RAISE EXCEPTION 'ap_classes table does not exist. Please create it first.';
    END IF;
END $$;

-- =====================================================
-- STEP 2: CREATE MOCK EXAM TABLES
-- =====================================================

-- 1. Question Types table
CREATE TABLE IF NOT EXISTS question_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_code VARCHAR(20) UNIQUE NOT NULL,
    type_name VARCHAR(50) NOT NULL,
    description TEXT,
    default_points INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Practice Tests table
CREATE TABLE IF NOT EXISTS practice_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ap_class_id UUID NOT NULL,
    test_number INTEGER NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20) DEFAULT 'medium',
    is_published BOOLEAN DEFAULT FALSE,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    practice_test_id UUID NOT NULL,
    question_type_id UUID NOT NULL,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_image_url TEXT,
    points INTEGER NOT NULL DEFAULT 1,
    time_limit_minutes INTEGER,
    topic VARCHAR(100),
    unit VARCHAR(100),
    difficulty VARCHAR(20) DEFAULT 'medium',
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Multiple Choice Options table
CREATE TABLE IF NOT EXISTS mc_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL,
    option_letter CHAR(1) NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Test Attempts table
CREATE TABLE IF NOT EXISTS user_test_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    practice_test_id UUID NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_minutes INTEGER,
    total_score INTEGER DEFAULT 0,
    max_possible_score INTEGER DEFAULT 0,
    percentage_score DECIMAL(5,2),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Answers table
CREATE TABLE IF NOT EXISTS user_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL,
    question_id UUID NOT NULL,
    selected_option_id UUID,
    free_response_text TEXT,
    points_earned INTEGER DEFAULT 0,
    is_correct BOOLEAN,
    time_spent_seconds INTEGER,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Practice Test Analytics table
CREATE TABLE IF NOT EXISTS practice_test_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    practice_test_id UUID NOT NULL,
    total_attempts INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    average_time_minutes INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 3: ADD MISSING COLUMNS TO EXISTING TABLES
-- =====================================================

-- Add missing columns to questions table if it already exists
DO $$
BEGIN
    -- Add practice_test_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' AND column_name = 'practice_test_id') THEN
        ALTER TABLE questions ADD COLUMN practice_test_id UUID;
        RAISE NOTICE 'Added practice_test_id column to questions table';
    END IF;

    -- Add question_type_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' AND column_name = 'question_type_id') THEN
        ALTER TABLE questions ADD COLUMN question_type_id UUID;
        RAISE NOTICE 'Added question_type_id column to questions table';
    END IF;

    -- Add other missing columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' AND column_name = 'question_number') THEN
        ALTER TABLE questions ADD COLUMN question_number INTEGER;
        RAISE NOTICE 'Added question_number column to questions table';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' AND column_name = 'points') THEN
        ALTER TABLE questions ADD COLUMN points INTEGER DEFAULT 1;
        RAISE NOTICE 'Added points column to questions table';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' AND column_name = 'time_limit_minutes') THEN
        ALTER TABLE questions ADD COLUMN time_limit_minutes INTEGER;
        RAISE NOTICE 'Added time_limit_minutes column to questions table';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' AND column_name = 'topic') THEN
        ALTER TABLE questions ADD COLUMN topic VARCHAR(100);
        RAISE NOTICE 'Added topic column to questions table';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' AND column_name = 'unit') THEN
        ALTER TABLE questions ADD COLUMN unit VARCHAR(100);
        RAISE NOTICE 'Added unit column to questions table';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' AND column_name = 'difficulty') THEN
        ALTER TABLE questions ADD COLUMN difficulty VARCHAR(20) DEFAULT 'medium';
        RAISE NOTICE 'Added difficulty column to questions table';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' AND column_name = 'explanation') THEN
        ALTER TABLE questions ADD COLUMN explanation TEXT;
        RAISE NOTICE 'Added explanation column to questions table';
    END IF;
END $$;

-- Add missing columns to other tables
DO $$
BEGIN
    -- Add question_id to mc_options if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mc_options' AND column_name = 'question_id') THEN
        ALTER TABLE mc_options ADD COLUMN question_id UUID;
        RAISE NOTICE 'Added question_id column to mc_options table';
    END IF;

    -- Add practice_test_id to user_test_attempts if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_test_attempts' AND column_name = 'practice_test_id') THEN
        ALTER TABLE user_test_attempts ADD COLUMN practice_test_id UUID;
        RAISE NOTICE 'Added practice_test_id column to user_test_attempts table';
    END IF;

    -- Add attempt_id to user_answers if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_answers' AND column_name = 'attempt_id') THEN
        ALTER TABLE user_answers ADD COLUMN attempt_id UUID;
        RAISE NOTICE 'Added attempt_id column to user_answers table';
    END IF;

    -- Add question_id to user_answers if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_answers' AND column_name = 'question_id') THEN
        ALTER TABLE user_answers ADD COLUMN question_id UUID;
        RAISE NOTICE 'Added question_id column to user_answers table';
    END IF;

    -- Add selected_option_id to user_answers if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_answers' AND column_name = 'selected_option_id') THEN
        ALTER TABLE user_answers ADD COLUMN selected_option_id UUID;
        RAISE NOTICE 'Added selected_option_id column to user_answers table';
    END IF;

    -- Add practice_test_id to practice_test_analytics if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'practice_test_analytics' AND column_name = 'practice_test_id') THEN
        ALTER TABLE practice_test_analytics ADD COLUMN practice_test_id UUID;
        RAISE NOTICE 'Added practice_test_id column to practice_test_analytics table';
    END IF;
END $$;

-- =====================================================
-- STEP 4: ADD FOREIGN KEY CONSTRAINTS
-- =====================================================

DO $$
BEGIN
    -- practice_tests -> ap_classes
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'practice_tests' 
                    AND kcu.column_name = 'ap_class_id'
                    AND tc.constraint_type = 'FOREIGN KEY') THEN
        BEGIN
            ALTER TABLE practice_tests ADD CONSTRAINT practice_tests_ap_class_id_fkey 
            FOREIGN KEY (ap_class_id) REFERENCES ap_classes(id) ON DELETE CASCADE;
            RAISE NOTICE 'Added foreign key: practice_tests -> ap_classes';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key practice_tests_ap_class_id_fkey: %', SQLERRM;
        END;
    END IF;

    -- questions -> practice_tests
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'questions' 
                    AND kcu.column_name = 'practice_test_id'
                    AND tc.constraint_type = 'FOREIGN KEY') THEN
        BEGIN
            ALTER TABLE questions ADD CONSTRAINT questions_practice_test_id_fkey 
            FOREIGN KEY (practice_test_id) REFERENCES practice_tests(id) ON DELETE CASCADE;
            RAISE NOTICE 'Added foreign key: questions -> practice_tests';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key questions_practice_test_id_fkey: %', SQLERRM;
        END;
    END IF;

    -- questions -> question_types
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'questions' 
                    AND kcu.column_name = 'question_type_id'
                    AND tc.constraint_type = 'FOREIGN KEY') THEN
        BEGIN
            ALTER TABLE questions ADD CONSTRAINT questions_question_type_id_fkey 
            FOREIGN KEY (question_type_id) REFERENCES question_types(id);
            RAISE NOTICE 'Added foreign key: questions -> question_types';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key questions_question_type_id_fkey: %', SQLERRM;
        END;
    END IF;

    -- mc_options -> questions
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'mc_options' 
                    AND kcu.column_name = 'question_id'
                    AND tc.constraint_type = 'FOREIGN KEY') THEN
        BEGIN
            ALTER TABLE mc_options ADD CONSTRAINT mc_options_question_id_fkey 
            FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;
            RAISE NOTICE 'Added foreign key: mc_options -> questions';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key mc_options_question_id_fkey: %', SQLERRM;
        END;
    END IF;

    -- user_test_attempts -> practice_tests
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'user_test_attempts' 
                    AND kcu.column_name = 'practice_test_id'
                    AND tc.constraint_type = 'FOREIGN KEY') THEN
        BEGIN
            ALTER TABLE user_test_attempts ADD CONSTRAINT user_test_attempts_practice_test_id_fkey 
            FOREIGN KEY (practice_test_id) REFERENCES practice_tests(id);
            RAISE NOTICE 'Added foreign key: user_test_attempts -> practice_tests';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key user_test_attempts_practice_test_id_fkey: %', SQLERRM;
        END;
    END IF;

    -- user_answers -> user_test_attempts
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'user_answers' 
                    AND kcu.column_name = 'attempt_id'
                    AND tc.constraint_type = 'FOREIGN KEY') THEN
        BEGIN
            ALTER TABLE user_answers ADD CONSTRAINT user_answers_attempt_id_fkey 
            FOREIGN KEY (attempt_id) REFERENCES user_test_attempts(id) ON DELETE CASCADE;
            RAISE NOTICE 'Added foreign key: user_answers -> user_test_attempts';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key user_answers_attempt_id_fkey: %', SQLERRM;
        END;
    END IF;

    -- user_answers -> questions
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'user_answers' 
                    AND kcu.column_name = 'question_id'
                    AND tc.constraint_type = 'FOREIGN KEY') THEN
        BEGIN
            ALTER TABLE user_answers ADD CONSTRAINT user_answers_question_id_fkey 
            FOREIGN KEY (question_id) REFERENCES questions(id);
            RAISE NOTICE 'Added foreign key: user_answers -> questions';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key user_answers_question_id_fkey: %', SQLERRM;
        END;
    END IF;

    -- user_answers -> mc_options
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'user_answers' 
                    AND kcu.column_name = 'selected_option_id'
                    AND tc.constraint_type = 'FOREIGN KEY') THEN
        BEGIN
            ALTER TABLE user_answers ADD CONSTRAINT user_answers_selected_option_id_fkey 
            FOREIGN KEY (selected_option_id) REFERENCES mc_options(id);
            RAISE NOTICE 'Added foreign key: user_answers -> mc_options';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key user_answers_selected_option_id_fkey: %', SQLERRM;
        END;
    END IF;

    -- practice_test_analytics -> practice_tests
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'practice_test_analytics' 
                    AND kcu.column_name = 'practice_test_id'
                    AND tc.constraint_type = 'FOREIGN KEY') THEN
        BEGIN
            ALTER TABLE practice_test_analytics ADD CONSTRAINT practice_test_analytics_practice_test_id_fkey 
            FOREIGN KEY (practice_test_id) REFERENCES practice_tests(id) ON DELETE CASCADE;
            RAISE NOTICE 'Added foreign key: practice_test_analytics -> practice_tests';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key practice_test_analytics_practice_test_id_fkey: %', SQLERRM;
        END;
    END IF;
END $$;

-- =====================================================
-- STEP 5: ADD UNIQUE CONSTRAINTS
-- =====================================================

DO $$
BEGIN
    -- practice_tests unique constraint (ap_class_id, test_number)
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'practice_tests' 
                    AND tc.constraint_type = 'UNIQUE'
                    AND EXISTS (SELECT 1 FROM information_schema.key_column_usage kcu2 
                               WHERE kcu2.constraint_name = tc.constraint_name 
                               AND kcu2.column_name IN ('ap_class_id', 'test_number'))
                    GROUP BY tc.constraint_name 
                    HAVING COUNT(*) = 2) THEN
        BEGIN
            ALTER TABLE practice_tests ADD CONSTRAINT practice_tests_ap_class_id_test_number_key 
            UNIQUE(ap_class_id, test_number);
            RAISE NOTICE 'Added unique constraint: practice_tests(ap_class_id, test_number)';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add unique constraint practice_tests_ap_class_id_test_number_key: %', SQLERRM;
        END;
    END IF;

    -- questions unique constraint (practice_test_id, question_number)
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'questions' 
                    AND tc.constraint_type = 'UNIQUE'
                    AND EXISTS (SELECT 1 FROM information_schema.key_column_usage kcu2 
                               WHERE kcu2.constraint_name = tc.constraint_name 
                               AND kcu2.column_name IN ('practice_test_id', 'question_number'))
                    GROUP BY tc.constraint_name 
                    HAVING COUNT(*) = 2) THEN
        BEGIN
            ALTER TABLE questions ADD CONSTRAINT questions_practice_test_id_question_number_key 
            UNIQUE(practice_test_id, question_number);
            RAISE NOTICE 'Added unique constraint: questions(practice_test_id, question_number)';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add unique constraint questions_practice_test_id_question_number_key: %', SQLERRM;
        END;
    END IF;

    -- mc_options unique constraint (question_id, option_letter)
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'mc_options' 
                    AND tc.constraint_type = 'UNIQUE'
                    AND EXISTS (SELECT 1 FROM information_schema.key_column_usage kcu2 
                               WHERE kcu2.constraint_name = tc.constraint_name 
                               AND kcu2.column_name IN ('question_id', 'option_letter'))
                    GROUP BY tc.constraint_name 
                    HAVING COUNT(*) = 2) THEN
        BEGIN
            ALTER TABLE mc_options ADD CONSTRAINT mc_options_question_id_option_letter_key 
            UNIQUE(question_id, option_letter);
            RAISE NOTICE 'Added unique constraint: mc_options(question_id, option_letter)';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add unique constraint mc_options_question_id_option_letter_key: %', SQLERRM;
        END;
    END IF;

    -- user_answers unique constraint (attempt_id, question_id)
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'user_answers' 
                    AND tc.constraint_type = 'UNIQUE'
                    AND EXISTS (SELECT 1 FROM information_schema.key_column_usage kcu2 
                               WHERE kcu2.constraint_name = tc.constraint_name 
                               AND kcu2.column_name IN ('attempt_id', 'question_id'))
                    GROUP BY tc.constraint_name 
                    HAVING COUNT(*) = 2) THEN
        BEGIN
            ALTER TABLE user_answers ADD CONSTRAINT user_answers_attempt_id_question_id_key 
            UNIQUE(attempt_id, question_id);
            RAISE NOTICE 'Added unique constraint: user_answers(attempt_id, question_id)';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add unique constraint user_answers_attempt_id_question_id_key: %', SQLERRM;
        END;
    END IF;

    -- practice_test_analytics unique constraint (practice_test_id)
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'practice_test_analytics' 
                    AND kcu.column_name = 'practice_test_id'
                    AND tc.constraint_type = 'UNIQUE') THEN
        BEGIN
            ALTER TABLE practice_test_analytics ADD CONSTRAINT practice_test_analytics_practice_test_id_key 
            UNIQUE(practice_test_id);
            RAISE NOTICE 'Added unique constraint: practice_test_analytics(practice_test_id)';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add unique constraint practice_test_analytics_practice_test_id_key: %', SQLERRM;
        END;
    END IF;
END $$;

-- =====================================================
-- STEP 6: CREATE INDEXES
-- =====================================================

DO $$
BEGIN
    -- Basic performance indexes (with column existence checks)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_practice_tests_ap_class')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'practice_tests' AND column_name = 'ap_class_id') THEN
        BEGIN
            CREATE INDEX idx_practice_tests_ap_class ON practice_tests(ap_class_id);
            RAISE NOTICE 'Created index: idx_practice_tests_ap_class';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not create index idx_practice_tests_ap_class: %', SQLERRM;
        END;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_questions_practice_test')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'practice_test_id') THEN
        BEGIN
            CREATE INDEX idx_questions_practice_test ON questions(practice_test_id);
            RAISE NOTICE 'Created index: idx_questions_practice_test';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not create index idx_questions_practice_test: %', SQLERRM;
        END;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_questions_type')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'question_type_id') THEN
        BEGIN
            CREATE INDEX idx_questions_type ON questions(question_type_id);
            RAISE NOTICE 'Created index: idx_questions_type';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not create index idx_questions_type: %', SQLERRM;
        END;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_mc_options_question')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mc_options' AND column_name = 'question_id') THEN
        BEGIN
            CREATE INDEX idx_mc_options_question ON mc_options(question_id);
            RAISE NOTICE 'Created index: idx_mc_options_question';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not create index idx_mc_options_question: %', SQLERRM;
        END;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_attempts_user')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_test_attempts' AND column_name = 'user_id') THEN
        BEGIN
            CREATE INDEX idx_user_attempts_user ON user_test_attempts(user_id);
            RAISE NOTICE 'Created index: idx_user_attempts_user';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not create index idx_user_attempts_user: %', SQLERRM;
        END;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_attempts_test')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_test_attempts' AND column_name = 'practice_test_id') THEN
        BEGIN
            CREATE INDEX idx_user_attempts_test ON user_test_attempts(practice_test_id);
            RAISE NOTICE 'Created index: idx_user_attempts_test';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not create index idx_user_attempts_test: %', SQLERRM;
        END;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_answers_attempt')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_answers' AND column_name = 'attempt_id') THEN
        BEGIN
            CREATE INDEX idx_user_answers_attempt ON user_answers(attempt_id);
            RAISE NOTICE 'Created index: idx_user_answers_attempt';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not create index idx_user_answers_attempt: %', SQLERRM;
        END;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_answers_question')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_answers' AND column_name = 'question_id') THEN
        BEGIN
            CREATE INDEX idx_user_answers_question ON user_answers(question_id);
            RAISE NOTICE 'Created index: idx_user_answers_question';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not create index idx_user_answers_question: %', SQLERRM;
        END;
    END IF;
END $$;

-- =====================================================
-- STEP 7: INSERT DEFAULT DATA
-- =====================================================

-- Insert question types
INSERT INTO question_types (type_code, type_name, description, default_points) VALUES
('mc', 'Multiple Choice', 'Multiple choice questions with 4-5 options', 1),
('frq', 'Free Response', 'Free response questions requiring written answers', 4),
('saq', 'Short Answer', 'Short answer questions for history classes', 3),
('dbq', 'Document-Based Question', 'Document-based questions for history classes', 7),
('leq', 'Long Essay Question', 'Long essay questions for history classes', 6)
ON CONFLICT (type_code) DO NOTHING;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

DO $$
DECLARE
    table_count INTEGER;
    constraint_count INTEGER;
    index_count INTEGER;
    ap_class_count INTEGER;
BEGIN
    -- Count created objects
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_name IN ('question_types', 'practice_tests', 'questions', 'mc_options', 'user_test_attempts', 'user_answers', 'practice_test_analytics');
    
    SELECT COUNT(*) INTO constraint_count 
    FROM information_schema.table_constraints 
    WHERE table_name IN ('practice_tests', 'questions', 'mc_options', 'user_test_attempts', 'user_answers', 'practice_test_analytics')
    AND constraint_type IN ('FOREIGN KEY', 'UNIQUE');
    
    SELECT COUNT(*) INTO index_count 
    FROM pg_indexes 
    WHERE tablename IN ('practice_tests', 'questions', 'mc_options', 'user_test_attempts', 'user_answers', 'practice_test_analytics');
    
    SELECT COUNT(*) INTO ap_class_count
    FROM ap_classes;
    
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Mock Exams Migration Completed Successfully!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Tables created: % of 7', table_count;
    RAISE NOTICE 'Constraints created: %', constraint_count;
    RAISE NOTICE 'Indexes created: %', index_count;
    RAISE NOTICE 'Existing AP classes found: %', ap_class_count;
    RAISE NOTICE '';
    RAISE NOTICE 'You can now:';
    RAISE NOTICE '1. Create practice tests linked to existing AP classes';
    RAISE NOTICE '2. Add questions to practice tests with labels/topics';
    RAISE NOTICE '3. Track user attempts and performance';
    RAISE NOTICE '';
    RAISE NOTICE 'Ready for production use!';
END $$;