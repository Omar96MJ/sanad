
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSendMessage(trimmedMessage);
      setMessage("");
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
        />
      </div>
      <Button 
        size="icon" 
        className="h-[60px]" 
        onClick={handleSendMessage} 
        disabled={!message.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MessageInput;
