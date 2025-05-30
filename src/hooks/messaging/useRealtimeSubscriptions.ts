
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/lib/therapist-types";

export const useRealtimeSubscriptions = (
  user: any,
  activeConversationId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  updateConversationTimestamp: (conversationId: string) => void,
  fetchConversations: () => void
) => {
  useEffect(() => {
    if (!user) return;

    console.log("Setting up realtime subscriptions for user:", user.id);

    // Subscribe to new messages - listen to all messages, not just for active conversation
    const messagesChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        async payload => {
          const newMessage = payload.new as any;
          console.log("New message received:", newMessage);
          
          // Get sender profile info
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', newMessage.sender_id)
            .single();
          
          // Convert to our Message type
          const formattedMessage: Message = {
            id: newMessage.id,
            senderId: newMessage.sender_id,
            senderName: profileData?.name || "Unknown",
            senderRole: profileData?.role || "unknown",
            recipientId: "",
            content: newMessage.content,
            timestamp: newMessage.created_at,
            isRead: newMessage.sender_id === user.id // Mark own messages as read
          };
          
          console.log("Adding formatted message to state:", formattedMessage);
          
          // Only add message to state if it's for the active conversation
          if (newMessage.conversation_id === activeConversationId) {
            setMessages(prevMessages => {
              // Check if message already exists to avoid duplicates
              const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
              if (messageExists) {
                return prevMessages;
              }
              return [...prevMessages, formattedMessage];
            });
          }
          
          // Always update conversation timestamp regardless of active conversation
          updateConversationTimestamp(newMessage.conversation_id);
          
          // Refresh conversations list to update last message and timestamp
          fetchConversations();
        }
      )
      .subscribe();
      
    // Subscribe to conversation updates
    const conversationsChannel = supabase
      .channel('public:conversations')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'conversations' }, 
        () => {
          console.log("Conversation updated, refreshing list");
          fetchConversations();
        }
      )
      .subscribe();

    // Subscribe to conversation participants for new conversations
    const participantsChannel = supabase
      .channel('public:conversation_participants')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'conversation_participants' }, 
        () => {
          console.log("New participant added, refreshing conversations");
          fetchConversations();
        }
      )
      .subscribe();
      
    return () => {
      console.log("Cleaning up realtime subscriptions");
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [user, activeConversationId, setMessages, updateConversationTimestamp, fetchConversations]);
};
