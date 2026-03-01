-- FRQ Types Schema Update for Class-Specific FRQs
-- This script adds support for different FRQ types per AP class

-- Add new columns to frq_questions table for FRQ type support
ALTER TABLE frq_questions ADD COLUMN IF NOT EXISTS frq_type VARCHAR(50);
ALTER TABLE frq_questions ADD COLUMN IF NOT EXISTS frq_type_config JSONB;
ALTER TABLE frq_questions ADD COLUMN IF NOT EXISTS class_specific_data JSONB;
ALTER TABLE frq_questions ADD COLUMN IF NOT EXISTS rubric_type VARCHAR(20) DEFAULT 'analytic';
ALTER TABLE frq_questions ADD COLUMN IF NOT EXISTS max_points INTEGER;
ALTER TABLE frq_questions ADD COLUMN IF NOT EXISTS guidelines TEXT[];
ALTER TABLE frq_questions ADD COLUMN IF NOT EXISTS examples TEXT[];

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_frq_questions_frq_type ON frq_questions(frq_type);
CREATE INDEX IF NOT EXISTS idx_frq_questions_subject_frq_type ON frq_questions(subject, frq_type);
CREATE INDEX IF NOT EXISTS idx_frq_questions_class_specific_data ON frq_questions USING GIN(class_specific_data);

-- Create FRQ Type Templates table for reusable templates
CREATE TABLE IF NOT EXISTS frq_type_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    frq_type VARCHAR(50) NOT NULL,
    template_name VARCHAR(200) NOT NULL,
    template_data JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(subject, frq_type, template_name)
);

-- Enable RLS on new table
ALTER TABLE frq_type_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for frq_type_templates
CREATE POLICY "Anyone can view FRQ type templates" ON frq_type_templates
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage FRQ type templates" ON frq_type_templates
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.uid = auth.uid() AND users.admin = true
    )
);

-- Create function to update frq_questions updated_at timestamp
CREATE OR REPLACE FUNCTION update_frq_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for frq_questions updated_at
DROP TRIGGER IF EXISTS frq_questions_updated_at_trigger ON frq_questions;
CREATE TRIGGER frq_questions_updated_at_trigger
    BEFORE UPDATE ON frq_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_frq_questions_updated_at();

-- Create trigger for frq_type_templates updated_at
DROP TRIGGER IF EXISTS frq_type_templates_updated_at_trigger ON frq_type_templates;
CREATE TRIGGER frq_type_templates_updated_at_trigger
    BEFORE UPDATE ON frq_type_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_frq_questions_updated_at();

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
         fq.frq_type, fq.frq_type_config, fq.class_specific_data, fq.rubric_type,
         fq.max_points, fq.guidelines, fq.examples,
         fq.created_at, fq.updated_at, fq.created_by, fq.is_active;

-- Grant permissions
GRANT SELECT ON frq_questions_with_parts TO anon, authenticated;
GRANT ALL ON frq_type_templates TO authenticated;

-- Insert sample FRQ type templates for different AP classes

-- AP World History SAQ Template
INSERT INTO frq_type_templates (subject, frq_type, template_name, template_data, description) VALUES
('AP World History', 'saq', 'Standard SAQ Template', 
'{
  "time_period": "",
  "geographic_region": "",
  "historical_thinking_skill": "analyze",
  "prompt_structure": "three_part",
  "part_a_focus": "identify",
  "part_b_focus": "explain", 
  "part_c_focus": "analyze"
}', 'Standard three-part SAQ template for AP World History')
ON CONFLICT (subject, frq_type, template_name) DO NOTHING;

-- AP World History DBQ Template
INSERT INTO frq_type_templates (subject, frq_type, template_name, template_data, description) VALUES
('AP World History', 'dbq', 'Standard DBQ Template',
'{
  "time_period": "",
  "geographic_region": "",
  "document_count": 7,
  "document_types": ["primary_source", "secondary_source"],
  "required_skills": ["contextualization", "thesis", "evidence", "analysis", "synthesis"],
  "additional_document_suggestion": true
}', 'Standard DBQ template with 7 documents for AP World History')
ON CONFLICT (subject, frq_type, template_name) DO NOTHING;

-- AP Calculus Analytical FRQ Template
INSERT INTO frq_type_templates (subject, frq_type, template_name, template_data, description) VALUES
('AP Calculus AB', 'analytical', 'Multi-Part Calculus Problem',
'{
  "calculator_allowed": false,
  "mathematical_practices": ["reasoning", "modeling", "communication"],
  "part_structure": "sequential_building",
  "requires_justification": true,
  "units_of_study": ["limits", "derivatives", "integrals"]
}', 'Standard analytical FRQ for AP Calculus AB')
ON CONFLICT (subject, frq_type, template_name) DO NOTHING;

-- AP Statistics Inference Template
INSERT INTO frq_type_templates (subject, frq_type, template_name, template_data, description) VALUES
('AP Statistics', 'inference', 'Hypothesis Test Template',
'{
  "statistical_investigation": "inference",
  "data_type": "quantitative",
  "inference_type": "hypothesis_test",
  "conditions_required": ["randomness", "normality", "independence"],
  "technology_allowed": true
}', 'Standard hypothesis testing FRQ for AP Statistics')
ON CONFLICT (subject, frq_type, template_name) DO NOTHING;

-- AP Computer Science Methods Template
INSERT INTO frq_type_templates (subject, frq_type, template_name, template_data, description) VALUES
('AP Computer Science A', 'methods_control', 'Method Implementation Template',
'{
  "programming_construct": "method_writing",
  "control_structures": ["loops", "conditionals"],
  "data_structures": ["arrays", "strings"],
  "algorithm_complexity": "linear",
  "java_features": ["static_methods", "parameter_passing"]
}', 'Standard method writing FRQ for AP Computer Science A')
ON CONFLICT (subject, frq_type, template_name) DO NOTHING;

-- AP English Language Synthesis Template
INSERT INTO frq_type_templates (subject, frq_type, template_name, template_data, description) VALUES
('AP English Language and Composition', 'synthesis', 'Source-Based Argument Template',
'{
  "source_count": 6,
  "source_types": ["text", "visual", "data"],
  "argument_focus": "contemporary_issue",
  "required_sources": 3,
  "rhetorical_situation": "defined_audience",
  "evidence_integration": "synthesis_required"
}', 'Standard synthesis essay with 6 sources for AP English Language')
ON CONFLICT (subject, frq_type, template_name) DO NOTHING;

-- Create function to get FRQ type configuration
CREATE OR REPLACE FUNCTION get_frq_type_config(p_subject VARCHAR, p_frq_type VARCHAR)
RETURNS JSONB AS $$
DECLARE
    config_data JSONB;
BEGIN
    SELECT template_data INTO config_data
    FROM frq_type_templates
    WHERE subject = p_subject 
    AND frq_type = p_frq_type 
    AND is_active = true
    LIMIT 1;
    
    RETURN COALESCE(config_data, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_frq_type_config(VARCHAR, VARCHAR) TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE frq_type_templates IS 'Templates for different FRQ types across AP classes';
COMMENT ON COLUMN frq_questions.frq_type IS 'Type of FRQ (saq, leq, dbq, analytical, etc.)';
COMMENT ON COLUMN frq_questions.frq_type_config IS 'JSON configuration specific to the FRQ type';
COMMENT ON COLUMN frq_questions.class_specific_data IS 'Additional data specific to the AP class';
COMMENT ON COLUMN frq_questions.rubric_type IS 'Type of rubric: holistic, analytic, or custom';
COMMENT ON COLUMN frq_questions.max_points IS 'Maximum points possible for this FRQ';

-- Notification for completion
DO $$ 
BEGIN 
    RAISE NOTICE 'FRQ Types schema update completed successfully!';
    RAISE NOTICE 'Added columns: frq_type, frq_type_config, class_specific_data, rubric_type, max_points';
    RAISE NOTICE 'Created table: frq_type_templates';
    RAISE NOTICE 'Updated view: frq_questions_with_parts';
    RAISE NOTICE 'Inserted sample templates for major AP classes';
END $$;
