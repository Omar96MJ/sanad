
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { BlogPostData } from '@/utils/blogUtils';

interface BlogHeaderProps {
  post: BlogPostData;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ post }) => {
  return (
    <>
      {/* Back button */}
      <Link to="/blog" className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
      </Link>

      {/* Hero image */}
      <div className="rounded-lg overflow-hidden mb-8">
        <AspectRatio ratio={16/9}>
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
      </div>

      {/* Post header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((category, index) => (
            <Badge key={index} variant="outline" className="bg-primary/10">
              {category}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogHeader;
