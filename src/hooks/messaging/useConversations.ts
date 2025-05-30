
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConversationWithParticipants } from "./types";

export const useConversations = (user: any) => {
  const [conversations, setConversations] = useState<ConversationWithParticipants[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) {
      console.log("No user, clearing conversations");
      setConversations([]);
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Fetching conversations for user:", user.id);
      
      // Get conversations where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations!inner (
            id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id);
        
      if (participantError) {
        console.error("Error fetching participant data:", participantError);
        return;
      }
      
      console.log("Participant data:", participantData);
      
      if (!participantData || participantData.length === 0) {
        console.log("No conversations found for user");
        setConversations([]);
        setIsLoading(false);
        return;
      }
      
      // Get all participants for these conversations
      const conversationIds = participantData.map(p => p.conversation_id);
      
      const { data: allParticipants, error: allParticipantsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id, user_id')
        .in('conversation_id', conversationIds);
        
      if (allParticipantsError) {
        console.error("Error fetching all participants:", allParticipantsError);
        return;
      }
      
      // Group participants by conversation
      const participantsByConversation: Record<string, string[]> = {};
      allParticipants?.forEach(p => {
        if (!participantsByConversation[p.conversation_id]) {
          participantsByConversation[p.conversation_id] = [];
        }
        participantsByConversation[p.conversation_id].push(p.user_id);
      });
      
      // Get last message for each conversation
      const { data: lastMessages, error: lastMessagesError } = await supabase
        .from('messages')
        .select('conversation_id, created_at, content')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });
        
      if (lastMessagesError) {
        console.error("Error fetching last messages:", lastMessagesError);
      }
      
      // Group last messages by conversation
      const lastMessageByConversation: Record<string, any> = {};
      lastMessages?.forEach(msg => {
        if (!lastMessageByConversation[msg.conversation_id]) {
          lastMessageByConversation[msg.conversation_id] = msg;
        }
      });
      
      const formattedConversations: ConversationWithParticipants[] = participantData.map(p => {
        const conversation = p.conversations;
        const participants = participantsByConversation[p.conversation_id] || [];
        const lastMessage = lastMessageByConversation[p.conversation_id];
        
        return {
          id: conversation.id,
          participantIds: participants,
          lastMessageTimestamp: lastMessage?.created_at || conversation.updated_at || conversation.created_at,
          unreadCount: 0 // We'll implement this later if needed
        };
      });
      
      // Sort by last message timestamp
      formattedConversations.sort((a, b) => 
        new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime()
      );
      
      console.log("Formatted conversations:", formattedConversations);
      setConversations(formattedConversations);
    } catch (error) {
      console.error("Error in conversation fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversationTimestamp = (conversationId: string) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, lastMessageTimestamp: new Date().toISOString() }
          : conv
      ).sort((a, b) => 
        new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime()
      );
    });
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  return {
    conversations,
    isLoading,
    fetchConversations,
    updateConversationTimestamp,
    setConversations
  };
};
