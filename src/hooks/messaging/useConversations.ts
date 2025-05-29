
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConversationWithParticipants } from "./types";

export const useConversations = (user: any) => {
  const [conversations, setConversations] = useState<ConversationWithParticipants[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) {
      console.log("No user found, skipping conversation fetch");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching conversations for user:", user.id);
      
      // Get conversations where the current user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id, unread_count')
        .eq('user_id', user.id);
        
      if (participantError) {
        console.error("Error fetching participant data:", participantError);
        setConversations([]);
        setIsLoading(false);
        return;
      }
      
      console.log("Participant data:", participantData);
      
      if (!participantData || participantData.length === 0) {
        console.log("No conversations found for user");
        setConversations([]);
        setIsLoading(false);
        return;
      }
      
      const conversationIds = participantData.map(p => p.conversation_id);
      console.log("Conversation IDs:", conversationIds);
      
      // Get conversation details
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });
        
      if (conversationError) {
        console.error("Error fetching conversation details:", conversationError);
        setConversations([]);
        setIsLoading(false);
        return;
      }
      
      console.log("Conversation data:", conversationData);
      
      // Get all participants for these conversations
      const { data: allParticipants, error: allParticipantsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id, user_id')
        .in('conversation_id', conversationIds);
        
      if (allParticipantsError) {
        console.error("Error fetching all participants:", allParticipantsError);
        setConversations([]);
        setIsLoading(false);
        return;
      }
      
      console.log("All participants data:", allParticipants);
      
      // Build conversations with participant IDs
      const conversationsWithParticipants: ConversationWithParticipants[] = conversationData?.map(conv => {
        const participants = allParticipants
          ? allParticipants
              .filter(p => p.conversation_id === conv.id)
              .map(p => p.user_id)
          : [user.id];
          
        const unreadCount = participantData.find(p => p.conversation_id === conv.id)?.unread_count || 0;
        
        return {
          id: conv.id,
          participantIds: participants,
          lastMessageTimestamp: conv.updated_at,
          unreadCount
        };
      }) || [];
      
      console.log("Final conversations:", conversationsWithParticipants);
      setConversations(conversationsWithParticipants);
    } catch (error) {
      console.error("Error in conversation fetch:", error);
      setConversations([]);
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
  }, [user?.id]);

  return {
    conversations,
    isLoading,
    fetchConversations,
    updateConversationTimestamp,
    setConversations
  };
};
