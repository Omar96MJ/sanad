
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConversationWithParticipants } from "./types";

export const useConversations = (user: any) => {
  const [conversations, setConversations] = useState<ConversationWithParticipants[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get conversations where the current user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id, unread_count')
        .eq('user_id', user.id);
        
      if (participantError) {
        console.error("Error fetching conversations:", participantError);
        return;
      }
      
      if (!participantData || participantData.length === 0) {
        setIsLoading(false);
        return;
      }
      
      const conversationIds = participantData.map(p => p.conversation_id);
      
      // Get conversation details
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });
        
      if (conversationError) {
        console.error("Error fetching conversation details:", conversationError);
        return;
      }
      
      // Get all participants for these conversations
      const { data: allParticipants, error: allParticipantsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id, user_id')
        .in('conversation_id', conversationIds);
        
      if (allParticipantsError) {
        console.error("Error fetching all participants:", allParticipantsError);
        return;
      }
      
      // Build conversations with participant IDs
      const conversationsWithParticipants: ConversationWithParticipants[] = conversationData.map(conv => {
        const participants = allParticipants
          .filter(p => p.conversation_id === conv.id)
          .map(p => p.user_id);
          
        const unreadCount = participantData.find(p => p.conversation_id === conv.id)?.unread_count || 0;
        
        return {
          id: conv.id,
          participantIds: participants,
          lastMessageTimestamp: conv.updated_at,
          unreadCount
        };
      });
      
      setConversations(conversationsWithParticipants);
    } catch (error) {
      console.error("Error in conversation fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversationTimestamp = (conversationId: string) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, lastMessageTimestamp: new Date().toISOString() }
          : conv
      )
    );
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
