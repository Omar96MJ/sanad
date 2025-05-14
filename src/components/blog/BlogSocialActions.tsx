
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Share2 } from "lucide-react";

const BlogSocialActions: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex gap-3">
        <Button variant="outline" size="sm" className="gap-1">
          <Heart className="h-4 w-4" /> Like
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Bookmark className="h-4 w-4" /> Save
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>
    </div>
  );
};

export default BlogSocialActions;
