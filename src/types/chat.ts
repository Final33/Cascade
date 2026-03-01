// Chat History TypeScript Interfaces

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  subject?: string;
  topic?: string;
  message_count: number;
  created_at: Date;
  updated_at: Date;
  last_message_at: Date;
  is_archived: boolean;
  is_favorite: boolean;
  messages?: ChatMessage[]; // For eager loading
}

export interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  is_user: boolean;
  message_order: number;
  tokens_used?: number;
  response_time_ms?: number;
  created_at: Date;
  attachments?: ChatAttachment[];
  question_data?: string; // JSON string of question data for generated questions
}

export interface ChatAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: Date;
}

// For database operations
export interface CreateChatSessionRequest {
  title?: string;
  subject?: string;
  topic?: string;
}

export interface CreateChatMessageRequest {
  session_id: string;
  content: string;
  is_user: boolean;
  tokens_used?: number;
  response_time_ms?: number;
  metadata?: any; // For storing additional data like question information
}

export interface UpdateChatSessionRequest {
  title?: string;
  subject?: string;
  topic?: string;
  is_archived?: boolean;
  is_favorite?: boolean;
}

// For API responses
export interface ChatSessionsResponse {
  sessions: ChatSession[];
  total: number;
  page: number;
  limit: number;
}

export interface ChatSessionWithMessages extends ChatSession {
  messages: ChatMessage[];
}

// For search functionality
export interface ChatSearchFilters {
  subject?: string;
  topic?: string;
  archived?: boolean;
  favorite?: boolean;
  dateRange?: [Date, Date];
}

export interface ChatSearchResult {
  sessions: ChatSession[];
  messages: ChatMessage[];
  total: number;
}

// For analytics (future feature)
export interface ChatAnalytics {
  total_sessions: number;
  total_messages: number;
  total_tokens_used: number;
  average_session_length: number;
  most_discussed_subjects: Array<{
    subject: string;
    count: number;
  }>;
  daily_usage: Array<{
    date: string;
    sessions: number;
    messages: number;
  }>;
}

// For migration from localStorage
export interface LegacyChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface LegacyChatSession {
  id: string;
  title: string;
  messages: LegacyChatMessage[];
  createdAt: Date;
}

// Error types
export class ChatHistoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ChatHistoryError';
  }
}

// Service response types
export interface ServiceResponse<T> {
  data?: T;
  error?: ChatHistoryError;
  success: boolean;
}

// Pagination types
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
