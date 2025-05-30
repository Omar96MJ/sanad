
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<boolean>;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isSending) {
      setIsSending(true);
      try {
        const success = await onSendMessage(trimmedMessage);
        if (success) {
          setMessage(""); // Only clear if successful
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <div className="flex-1">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[60px] resize-none"
          disabled={isSending}
        />
      </div>
      <Button 
        size="icon" 
        className="h-[60px]" 
        onClick={handleSendMessage} 
        disabled={!message.trim() || isSending}
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default MessageInput;
