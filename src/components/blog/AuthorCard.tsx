
import React from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuthorProps {
  author: {
    name: string;
    avatar: string;
    role: string;
  };
}

const AuthorCard: React.FC<AuthorProps> = ({ author }) => {
  return (
    <Card className="p-6 mb-8 bg-muted/30">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">About {author.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{author.role}</p>
          <p className="text-sm">
            An experienced healthcare professional dedicated to improving mental health outcomes 
            through evidence-based practice and compassionate care. Specializing in therapy approaches
            that are tailored to each individual's unique needs and circumstances.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AuthorCard;
