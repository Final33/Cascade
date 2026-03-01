import { createSupabaseBrowserClient } from './browser-client';
import type {
  ChatSession,
  ChatMessage,
  ChatAttachment,
  CreateChatSessionRequest,
  CreateChatMessageRequest,
  UpdateChatSessionRequest,
  ChatSessionsResponse,
  ChatSessionWithMessages,
  ChatSearchFilters,
  ChatSearchResult,
  ChatAnalytics,
  ChatHistoryError,
  ServiceResponse,
  PaginationOptions,
  PaginatedResponse,
  LegacyChatSession
} from '@/types/chat';

export class ChatHistoryService {
  private supabase = createSupabaseBrowserClient();

  /**
   * Create a new chat session
   */
  async createChatSession(
    request: CreateChatSessionRequest = {}
  ): Promise<ServiceResponse<ChatSession>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        throw new ChatHistoryError('User not authenticated', 'AUTH_ERROR');
      }

      const { data, error } = await this.supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: request.title || 'New Chat',
          subject: request.subject,
          topic: request.topic
        })
        .select()
        .single();

      if (error) {
        throw new ChatHistoryError(
          `Failed to create chat session: ${error.message}`,
          'CREATE_SESSION_ERROR',
          error
        );
      }

      return {
        data: {
          ...data,
          created_at: new Date(data.created_at),
          updated_at: new Date(data.updated_at),
          last_message_at: new Date(data.last_message_at)
        },
        success: true
      };
    } catch (error) {
      return {
        error: error instanceof ChatHistoryError 
          ? error 
          : new ChatHistoryError('Unknown error creating session', 'UNKNOWN_ERROR', error),
        success: false
      };
    }
  }

  /**
   * Get user's chat sessions with pagination
   */
  async getUserChatSessions(
    options: PaginationOptions & ChatSearchFilters = {}
  ): Promise<ServiceResponse<ChatSessionsResponse>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        throw new ChatHistoryError('User not authenticated', 'AUTH_ERROR');
      }

      const {
        page = 1,
        limit = 20,
        archived = false,
        favorite,
        subject,
        topic,
        dateRange
      } = options;

      let query = this.supabase
        .from('chat_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_archived', archived)
        .order('updated_at', { ascending: false });

      // Apply filters
      if (favorite !== undefined) {
        query = query.eq('is_favorite', favorite);
      }
      
      if (subject) {
        query = query.eq('subject', subject);
      }
      
      if (topic) {
        query = query.eq('topic', topic);
      }
      
      if (dateRange) {
        query = query
          .gte('created_at', dateRange[0].toISOString())
          .lte('created_at', dateRange[1].toISOString());
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new ChatHistoryError(
          `Failed to fetch chat sessions: ${error.message}`,
          'FETCH_SESSIONS_ERROR',
          error
        );
      }

      const sessions = (data || []).map(session => ({
        ...session,
        created_at: new Date(session.created_at),
        updated_at: new Date(session.updated_at),
        last_message_at: new Date(session.last_message_at)
      }));

      return {
        data: {
          sessions,
          total: count || 0,
          page,
          limit
        },
        success: true
      };
    } catch (error) {
      return {
        error: error instanceof ChatHistoryError 
          ? error 
          : new ChatHistoryError('Unknown error fetching sessions', 'UNKNOWN_ERROR', error),
        success: false
      };
    }
  }

  /**
   * Get specific session with all messages
   */
  async getChatSessionWithMessages(
    sessionId: string
  ): Promise<ServiceResponse<ChatSessionWithMessages>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        throw new ChatHistoryError('User not authenticated', 'AUTH_ERROR');
      }

      // Get session
      const { data: sessionData, error: sessionError } = await this.supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (sessionError) {
        throw new ChatHistoryError(
          `Failed to fetch chat session: ${sessionError.message}`,
          'FETCH_SESSION_ERROR',
          sessionError
        );
      }

      // Get messages
      const { data: messagesData, error: messagesError } = await this.supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('message_order', { ascending: true });

      if (messagesError) {
        throw new ChatHistoryError(
          `Failed to fetch chat messages: ${messagesError.message}`,
          'FETCH_MESSAGES_ERROR',
          messagesError
        );
      }

      const session: ChatSessionWithMessages = {
        ...sessionData,
        created_at: new Date(sessionData.created_at),
        updated_at: new Date(sessionData.updated_at),
        last_message_at: new Date(sessionData.last_message_at),
        messages: (messagesData || []).map(message => ({
          ...message,
          created_at: new Date(message.created_at)
        }))
      };

      return {
        data: session,
        success: true
      };
    } catch (error) {
      return {
        error: error instanceof ChatHistoryError 
          ? error 
          : new ChatHistoryError('Unknown error fetching session', 'UNKNOWN_ERROR', error),
        success: false
      };
    }
  }

  /**
   * Add message to session
   */
  async addMessageToSession(
    request: CreateChatMessageRequest
  ): Promise<ServiceResponse<ChatMessage>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        throw new ChatHistoryError('User not authenticated', 'AUTH_ERROR');
      }

      // Verify session ownership
      const { data: session } = await this.supabase
        .from('chat_sessions')
        .select('id')
        .eq('id', request.session_id)
        .eq('user_id', user.id)
        .single();

      if (!session) {
        throw new ChatHistoryError('Session not found or access denied', 'SESSION_NOT_FOUND');
      }

      // Get next message order
      const { data: lastMessage } = await this.supabase
        .from('chat_messages')
        .select('message_order')
        .eq('session_id', request.session_id)
        .order('message_order', { ascending: false })
        .limit(1)
        .single();

      const nextOrder = (lastMessage?.message_order || 0) + 1;

      const { data, error } = await this.supabase
        .from('chat_messages')
        .insert({
          session_id: request.session_id,
          content: request.content,
          is_user: request.is_user,
          message_order: nextOrder,
          tokens_used: request.tokens_used,
          response_time_ms: request.response_time_ms
        })
        .select()
        .single();

      if (error) {
        throw new ChatHistoryError(
          `Failed to add message: ${error.message}`,
          'ADD_MESSAGE_ERROR',
          error
        );
      }

      return {
        data: {
          ...data,
          created_at: new Date(data.created_at)
        },
        success: true
      };
    } catch (error) {
      return {
        error: error instanceof ChatHistoryError 
          ? error 
          : new ChatHistoryError('Unknown error adding message', 'UNKNOWN_ERROR', error),
        success: false
      };
    }
  }

  /**
   * Update session metadata
   */
  async updateChatSession(
    sessionId: string,
    updates: UpdateChatSessionRequest
  ): Promise<ServiceResponse<ChatSession>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        throw new ChatHistoryError('User not authenticated', 'AUTH_ERROR');
      }

      const { data, error } = await this.supabase
        .from('chat_sessions')
        .update(updates)
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw new ChatHistoryError(
          `Failed to update session: ${error.message}`,
          'UPDATE_SESSION_ERROR',
          error
        );
      }

      return {
        data: {
          ...data,
          created_at: new Date(data.created_at),
          updated_at: new Date(data.updated_at),
          last_message_at: new Date(data.last_message_at)
        },
        success: true
      };
    } catch (error) {
      return {
        error: error instanceof ChatHistoryError 
          ? error 
          : new ChatHistoryError('Unknown error updating session', 'UNKNOWN_ERROR', error),
        success: false
      };
    }
  }

  /**
   * Archive a chat session
   */
  async archiveChatSession(sessionId: string): Promise<ServiceResponse<void>> {
    const result = await this.updateChatSession(sessionId, { is_archived: true });
    return {
      success: result.success,
      error: result.error
    };
  }

  /**
   * Delete a chat session permanently
   */
  async deleteChatSession(sessionId: string): Promise<ServiceResponse<void>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        throw new ChatHistoryError('User not authenticated', 'AUTH_ERROR');
      }

      const { error } = await this.supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) {
        throw new ChatHistoryError(
          `Failed to delete session: ${error.message}`,
          'DELETE_SESSION_ERROR',
          error
        );
      }

      return { success: true };
    } catch (error) {
      return {
        error: error instanceof ChatHistoryError 
          ? error 
          : new ChatHistoryError('Unknown error deleting session', 'UNKNOWN_ERROR', error),
        success: false
      };
    }
  }

  /**
   * Search chat history
   */
  async searchChatHistory(
    query: string,
    filters: ChatSearchFilters = {}
  ): Promise<ServiceResponse<ChatSearchResult>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        throw new ChatHistoryError('User not authenticated', 'AUTH_ERROR');
      }

      // Search in messages
      let messageQuery = this.supabase
        .from('chat_messages')
        .select(`
          *,
          chat_sessions!inner(*)
        `)
        .eq('chat_sessions.user_id', user.id)
        .textSearch('content', query);

      // Apply filters to message search
      if (filters.subject) {
        messageQuery = messageQuery.eq('chat_sessions.subject', filters.subject);
      }
      
      if (filters.archived !== undefined) {
        messageQuery = messageQuery.eq('chat_sessions.is_archived', filters.archived);
      }

      const { data: messageResults, error: messageError } = await messageQuery;

      if (messageError) {
        throw new ChatHistoryError(
          `Failed to search messages: ${messageError.message}`,
          'SEARCH_ERROR',
          messageError
        );
      }

      // Search in session titles
      let sessionQuery = this.supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .textSearch('title', query);

      if (filters.archived !== undefined) {
        sessionQuery = sessionQuery.eq('is_archived', filters.archived);
      }

      const { data: sessionResults, error: sessionError } = await sessionQuery;

      if (sessionError) {
        throw new ChatHistoryError(
          `Failed to search sessions: ${sessionError.message}`,
          'SEARCH_ERROR',
          sessionError
        );
      }

      const messages = (messageResults || []).map(result => ({
        ...result,
        created_at: new Date(result.created_at)
      }));

      const sessions = (sessionResults || []).map(session => ({
        ...session,
        created_at: new Date(session.created_at),
        updated_at: new Date(session.updated_at),
        last_message_at: new Date(session.last_message_at)
      }));

      return {
        data: {
          sessions,
          messages,
          total: sessions.length + messages.length
        },
        success: true
      };
    } catch (error) {
      return {
        error: error instanceof ChatHistoryError 
          ? error 
          : new ChatHistoryError('Unknown error searching', 'UNKNOWN_ERROR', error),
        success: false
      };
    }
  }

  /**
   * Migrate localStorage chat history to Supabase
   */
  async migrateChatHistoryFromLocalStorage(): Promise<ServiceResponse<{ migratedSessions: number }>> {
    try {
      const localSessions = localStorage.getItem('askPearsonSessions');
      if (!localSessions) {
        return {
          data: { migratedSessions: 0 },
          success: true
        };
      }

      const sessions: LegacyChatSession[] = JSON.parse(localSessions);
      let migratedCount = 0;

      for (const session of sessions) {
        // Create session in Supabase
        const sessionResult = await this.createChatSession({
          title: session.title
        });

        if (!sessionResult.success || !sessionResult.data) {
          console.error('Failed to migrate session:', session.title, sessionResult.error);
          continue;
        }

        // Add all messages
        for (const [index, message] of session.messages.entries()) {
          const messageResult = await this.addMessageToSession({
            session_id: sessionResult.data.id,
            content: message.content,
            is_user: message.isUser
          });

          if (!messageResult.success) {
            console.error('Failed to migrate message:', messageResult.error);
          }
        }

        migratedCount++;
      }

      // Clear localStorage after successful migration
      localStorage.removeItem('askPearsonSessions');

      return {
        data: { migratedSessions: migratedCount },
        success: true
      };
    } catch (error) {
      return {
        error: new ChatHistoryError('Migration failed', 'MIGRATION_ERROR', error),
        success: false
      };
    }
  }
}

// Export singleton instance
export const chatHistoryService = new ChatHistoryService();
