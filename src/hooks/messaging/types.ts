
export interface MessagingHookReturn {
  messages: any[];
  conversations: any[];
  patients: any[];
  activeConversationId: string | null;
  isLoading: boolean;
  handleSelectConversation: (conversationId: string) => void;
  startNewConversation: (participantId: string) => Promise<string | null>;
  handleSendMessage: (content: string) => Promise<boolean>;
  currentUser: any;
}

export interface ConversationWithParticipants {
  id: string;
  participantIds: string[];
  lastMessageTimestamp: string;
  unreadCount: number;
}
