
import React, { useEffect, useRef } from "react";
import { Message } from "@/lib/therapist-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), "h:mm a");
  };
  
  // Filter messages for the current conversation
  const conversationMessages = messages.filter((message) => 
    message.senderId === currentUserId || message.recipientId === currentUserId
  );

  return (
    <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-450px)] px-4 py-4">
      <div className="space-y-4">
        {conversationMessages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId;
          
          return (
            <div 
              key={message.id} 
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[75%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${message.senderId}`} alt={message.senderName} />
                    <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div 
                    className={`rounded-lg p-3 ${
                      isCurrentUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div 
                    className={`flex mt-1 text-xs text-muted-foreground ${
                      isCurrentUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{formatMessageTime(message.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {conversationMessages.length === 0 && (
          <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
