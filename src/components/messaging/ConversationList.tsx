
import React from "react";
import { Conversation, Message } from "@/lib/therapist-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  messages: Message[];
  patients: { id: string; name: string }[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  messages,
  patients,
  activeConversationId,
  onSelectConversation,
  currentUserId,
  searchQuery,
  setSearchQuery,
}) => {
  // Helper function to get the other participant in a conversation
  const getOtherParticipant = (conversation: Conversation) => {
    const otherParticipantId = conversation.participantIds.find(id => id !== currentUserId);
    return patients.find(patient => patient.id === otherParticipantId) || { id: "", name: "Unknown User" };
  };

  // Get the last message for a conversation
  const getLastMessage = (conversation: Conversation) => {
    // Filter messages for this conversation
    const conversationMessages = messages.filter(m => 
      conversation.participantIds.includes(m.senderId) && 
      conversation.participantIds.includes(m.recipientId)
    );
    
    if (conversationMessages.length === 0) {
      return null;
    }
    
    // Sort by timestamp descending and get the first one (most recent)
    return conversationMessages.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = getOtherParticipant(conv);
    return otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Sort conversations by last message timestamp
  const sortedConversations = [...filteredConversations].sort((a, b) => 
    new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime()
  );

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {sortedConversations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No conversations yet
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-350px)] pr-4">
          <div className="space-y-2 mt-2">
            {sortedConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const lastMessage = getLastMessage(conversation);
              const isActive = activeConversationId === conversation.id;
              
              return (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive 
                      ? "bg-primary/10 hover:bg-primary/15" 
                      : "hover:bg-accent"
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${otherParticipant.id}`} alt={otherParticipant.name} />
                      <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium text-sm truncate">{otherParticipant.name}</h4>
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      {lastMessage ? (
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground truncate">
                            {lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge 
                              variant="destructive" 
                              className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                            >
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          No messages yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </>
  );
};

export default ConversationList;
