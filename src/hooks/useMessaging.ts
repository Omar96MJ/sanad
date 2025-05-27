
import { useState, useEffect } from "react";
import { Message, Conversation } from "@/lib/therapist-types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

export const useMessaging = (isTherapist: boolean = true) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch conversations and messages
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
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
        const conversationsWithParticipants: Conversation[] = conversationData.map(conv => {
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
        
        // If we have at least one conversation, set it as active
        if (conversationsWithParticipants.length > 0 && !activeConversationId) {
          setActiveConversationId(conversationsWithParticipants[0].id);
        }
      } catch (error) {
        console.error("Error in conversation fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchUsers = async () => {
      try {
        const userRole = isTherapist ? 'patient' : 'doctor';
        
        // Fetch users based on role
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('role', userRole)
          .order('name');
          
        if (error) {
          console.error(`Error fetching ${userRole}s:`, error);
          return;
        }
        
        if (data) {
          setPatients(data.map(user => ({
            id: user.id,
            name: user.name || `Unknown ${userRole}`
          })));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    
    fetchConversations();
    fetchUsers();
    
    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        payload => {
          const newMessage = payload.new as any;
          
          // Only add message to state if it's for the active conversation
          if (newMessage.conversation_id === activeConversationId) {
            // Convert to our Message type
            const formattedMessage: Message = {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              senderName: newMessage.sender_id === user.id ? (user.name || "You") : "Unknown",
              senderRole: newMessage.sender_id === user.id ? (user.role || "unknown") : "unknown",
              recipientId: "", // We'll determine this from conversation participants
              content: newMessage.content,
              timestamp: newMessage.created_at,
              isRead: true // New messages are considered read if they're in the active conversation
            };
            
            setMessages(prevMessages => [...prevMessages, formattedMessage]);
          }
          
          // Update conversation last timestamp
          updateConversationTimestamp(newMessage.conversation_id);
        }
      )
      .subscribe();
      
    // Subscribe to conversation updates
    const conversationsChannel = supabase
      .channel('public:conversations')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'conversations' }, 
        () => {
          // Refresh conversations when updated
          fetchConversations();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, isTherapist, activeConversationId]);

  // Update conversation timestamp when messages are sent
  const updateConversationTimestamp = (conversationId: string) => {
    // Update local state
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, lastMessageTimestamp: new Date().toISOString() }
          : conv
      )
    );
  };
  
  // Fetch messages for active conversation
  useEffect(() => {
    if (!user || !activeConversationId) return;
    
    const fetchMessages = async () => {
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
            id: msg.id,
            senderId: msg.sender_id,
            senderName: msg.sender_id === user.id ? (user.name || "You") : "Unknown",
            senderRole: msg.sender_id === user.id ? (user.role || "unknown") : "unknown",
            recipientId: "", // Will be determined from conversation participants
            content: msg.content,
            timestamp: msg.created_at,
            isRead: true // All fetched messages are considered read
          }));
          
          // Get user profiles to populate sender names
          const userIds = Array.from(
            new Set(formattedMessages.map(msg => msg.senderId))
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
              senderName: userProfiles[msg.senderId]?.name || 'Unknown',
              senderRole: userProfiles[msg.senderId]?.role || 'unknown'
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
    
    fetchMessages();
  }, [user, activeConversationId]);

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const startNewConversation = async (participantId: string) => {
    if (!user) return;
    
    // Check if conversation already exists
    const existingConversation = conversations.find(c => 
      c.participantIds.includes(participantId) && 
      c.participantIds.includes(user.id)
    );

    if (existingConversation) {
      setActiveConversationId(existingConversation.id);
      return existingConversation.id;
    }
    
    try {
      // Create new conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();
        
      if (conversationError) {
        console.error("Error creating conversation:", conversationError);
        toast.error(t('failed_create_conversation') || "Failed to start new conversation");
        return null;
      }
      
      // Add participants
      const participantsToAdd = [
        { conversation_id: conversationData.id, user_id: user.id },
        { conversation_id: conversationData.id, user_id: participantId }
      ];
      
      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert(participantsToAdd);
        
      if (participantError) {
        console.error("Error adding participants:", participantError);
        toast.error(t('failed_add_participants') || "Failed to add participants to conversation");
        return null;
      }
      
      // Create new conversation object for state
      const newConversation: Conversation = {
        id: conversationData.id,
        participantIds: [user.id, participantId],
        lastMessageTimestamp: new Date().toISOString(),
        unreadCount: 0
      };
      
      // Update state
      setConversations([newConversation, ...conversations]);
      setActiveConversationId(newConversation.id);
      toast.success(t('conversation_started') || "New conversation started");
      return newConversation.id;
    } catch (error) {
      console.error("Error in starting conversation:", error);
      toast.error(t('failed_start_conversation') || "Failed to start conversation");
      return null;
    }
  };

  const handleSendMessage = async (content: string): Promise<boolean> => {
    if (!user || !activeConversationId) return false;
    
    try {
      // Insert message into database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          conversation_id: activeConversationId,
          content
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error sending message:", error);
        toast.error(t('failed_send_message') || "Failed to send message");
        return false;
      }
      
      // Message will be added to state via subscription
      console.log("Message sent:", data);
      return true;
    } catch (error) {
      console.error("Error in send message:", error);
      toast.error(t('failed_send_message') || "Failed to send message");
      return false;
    }
  };

  return {
    messages,
    conversations,
    patients,
    activeConversationId,
    isLoading,
    handleSelectConversation,
    startNewConversation,
    handleSendMessage,
    currentUser: user,
  };
};
