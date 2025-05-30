
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/lib/therapist-types";

export const useMessages = (user: any, activeConversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    if (!user || !activeConversationId) {
      console.log("No user or conversation ID, clearing messages");
      setMessages([]);
      return;
    }
    
    try {
      console.log("Fetching messages for conversation:", activeConversationId);
      
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
      
      console.log("Raw messages data:", data);
      
      if (data) {
        // Get user profiles to populate sender names
        const userIds = Array.from(
          new Set(data.map(msg => msg.sender_id))
        );
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, role')
          .in('id', userIds);
          
        if (!profilesError && profilesData) {
          const userProfiles = Object.fromEntries(
            profilesData.map(profile => [profile.id, { name: profile.name || 'Unknown', role: profile.role || 'unknown' }])
          );
          
          const formattedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            senderId: msg.sender_id,
            senderName: userProfiles[msg.sender_id]?.name || 'Unknown',
            senderRole: userProfiles[msg.sender_id]?.role || 'unknown',
            recipientId: "", // Will be determined from conversation participants
            content: msg.content,
            timestamp: msg.created_at,
            isRead: true // All fetched messages are considered read
          }));
          
          console.log("Formatted messages with user info:", formattedMessages);
          setMessages(formattedMessages);
        } else {
          const formattedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            senderId: msg.sender_id,
            senderName: msg.sender_id === user.id ? (user.name || "You") : "Unknown",
            senderRole: msg.sender_id === user.id ? (user.role || "unknown") : "unknown",
            recipientId: "",
            content: msg.content,
            timestamp: msg.created_at,
            isRead: true
          }));
          
          console.log("Formatted messages without user info:", formattedMessages);
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
