-- Chat History Database Setup for Supabase
-- This script creates tables for storing chat sessions and messages

-- Enable RLS on existing tables if they exist
ALTER TABLE IF EXISTS chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_attachments ENABLE ROW LEVEL SECURITY;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS chat_attachments CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;

-- Create Chat Sessions table (Master)
CREATE TABLE chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Chat',
    subject TEXT, -- e.g., "AP Biology", "AP Calculus"
    topic TEXT,   -- e.g., "Cell Division", "Derivatives"
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE
);

-- Create Chat Messages table (Detail)
CREATE TABLE chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_user BOOLEAN NOT NULL,
    message_order INTEGER NOT NULL, -- For guaranteed ordering
    tokens_used INTEGER, -- For usage tracking
    response_time_ms INTEGER, -- For performance analytics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, message_order)
);

-- Create Chat Attachments table (for future image support)
CREATE TABLE chat_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_chat_sessions_user_updated ON chat_sessions(user_id, updated_at DESC);
CREATE INDEX idx_chat_sessions_user_archived ON chat_sessions(user_id, is_archived);
CREATE INDEX idx_chat_sessions_user_favorite ON chat_sessions(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX idx_chat_messages_session_order ON chat_messages(session_id, message_order);
CREATE INDEX idx_chat_messages_content_search ON chat_messages USING gin(to_tsvector('english', content));
CREATE INDEX idx_chat_attachments_message ON chat_attachments(message_id);

-- Function to update session metadata when messages are added/removed
CREATE OR REPLACE FUNCTION update_chat_session_metadata()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update message count and last message time
        UPDATE chat_sessions 
        SET 
            message_count = message_count + 1,
            last_message_at = NEW.created_at,
            updated_at = NOW()
        WHERE id = NEW.session_id;
        
        -- Auto-update title from first user message if still default
        IF NEW.is_user = TRUE AND NEW.message_order = 1 THEN
            UPDATE chat_sessions 
            SET title = CASE 
                WHEN LENGTH(NEW.content) > 50 
                THEN LEFT(NEW.content, 50) || '...'
                ELSE NEW.content
            END
            WHERE id = NEW.session_id AND title = 'New Chat';
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Update message count
        UPDATE chat_sessions 
        SET 
            message_count = GREATEST(message_count - 1, 0),
            updated_at = NOW()
        WHERE id = OLD.session_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic session metadata updates
CREATE TRIGGER chat_message_metadata_trigger
    AFTER INSERT OR DELETE ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_chat_session_metadata();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_chat_sessions_updated_at 
    BEFORE UPDATE ON chat_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_chat_updated_at_column();

-- RLS Policies for Chat Sessions
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON chat_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions" ON chat_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Chat Messages
CREATE POLICY "Users can view messages from own sessions" ON chat_messages
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM chat_sessions WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages to own sessions" ON chat_messages
    FOR INSERT WITH CHECK (
        session_id IN (
            SELECT id FROM chat_sessions WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update messages in own sessions" ON chat_messages
    FOR UPDATE USING (
        session_id IN (
            SELECT id FROM chat_sessions WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete messages from own sessions" ON chat_messages
    FOR DELETE USING (
        session_id IN (
            SELECT id FROM chat_sessions WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for Chat Attachments
CREATE POLICY "Users can view attachments from own messages" ON chat_attachments
    FOR SELECT USING (
        message_id IN (
            SELECT cm.id FROM chat_messages cm
            JOIN chat_sessions cs ON cm.session_id = cs.id
            WHERE cs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert attachments to own messages" ON chat_attachments
    FOR INSERT WITH CHECK (
        message_id IN (
            SELECT cm.id FROM chat_messages cm
            JOIN chat_sessions cs ON cm.session_id = cs.id
            WHERE cs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete attachments from own messages" ON chat_attachments
    FOR DELETE USING (
        message_id IN (
            SELECT cm.id FROM chat_messages cm
            JOIN chat_sessions cs ON cm.session_id = cs.id
            WHERE cs.user_id = auth.uid()
        )
    );

-- Create view for easy session retrieval with message previews
CREATE OR REPLACE VIEW chat_sessions_with_preview AS
SELECT 
    cs.*,
    cm_first.content as first_message,
    LEFT(cm_last.content, 100) as last_message_preview
FROM chat_sessions cs
LEFT JOIN LATERAL (
    SELECT content FROM chat_messages 
    WHERE session_id = cs.id AND is_user = true 
    ORDER BY message_order LIMIT 1
) cm_first ON true
LEFT JOIN LATERAL (
    SELECT content FROM chat_messages 
    WHERE session_id = cs.id 
    ORDER BY message_order DESC LIMIT 1
) cm_last ON true;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON chat_sessions_with_preview TO anon, authenticated;
GRANT ALL ON chat_sessions, chat_messages, chat_attachments TO authenticated;

-- Notification for completion
DO $$ 
BEGIN 
    RAISE NOTICE 'Chat history database setup completed successfully!';
    RAISE NOTICE 'Created tables: chat_sessions, chat_messages, chat_attachments';
    RAISE NOTICE 'Created view: chat_sessions_with_preview';
    RAISE NOTICE 'Created indexes and RLS policies';
    RAISE NOTICE 'Created triggers for automatic metadata updates';
END $$;
