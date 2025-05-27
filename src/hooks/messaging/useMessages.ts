
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/lib/therapist-types";

export const useMessages = (user: any, activeConversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    if (!user || !activeConversationId) return;
    
    try {
      // Get all messages for this conversation
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeConversationId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }
      
      if (data) {
        const formattedMessages: Message[] = data.map(msg => ({
          // Database fields
          id: msg.id,
          conversation_id: msg.conversation_id,
          sender_id: msg.sender_id,
          content: msg.content,
          created_at: msg.created_at,
          read: true,
          // Frontend fields
          senderId: msg.sender_id,
          senderName: msg.sender_id === user.id ? (user.name || "You") : "Unknown",
          senderRole: msg.sender_id === user.id ? (user.role || "unknown") : "unknown",
          recipientId: "", // Will be determined from conversation participants
          timestamp: msg.created_at,
          isRead: true // All fetched messages are considered read
        }));
        
        // Get user profiles to populate sender names
        const userIds = Array.from(
          new Set(formattedMessages.map(msg => msg.sender_id))
        );
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, role')
          .in('id', userIds);
          
        if (!profilesError && profilesData) {
          const userProfiles = Object.fromEntries(
            profilesData.map(profile => [profile.id, { name: profile.name || 'Unknown', role: profile.role || 'unknown' }])
          );
          
          const messagesWithUserInfo = formattedMessages.map(msg => ({
            ...msg,
            senderName: userProfiles[msg.sender_id]?.name || 'Unknown',
            senderRole: userProfiles[msg.sender_id]?.role || 'unknown'
          }));
          
          setMessages(messagesWithUserInfo);
        } else {
          setMessages(formattedMessages);
        }
      }
    } catch (error) {
      console.error("Error in message fetch:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user, activeConversationId]);

  return {
    messages,
    setMessages,
    fetchMessages
  };
};
