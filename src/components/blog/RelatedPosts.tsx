
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BlogPostData } from '@/utils/blogUtils';

interface RelatedPostsProps {
  posts: BlogPostData[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  if (!posts.length) return null;

  return (
    <div className="mt-12 mb-12">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <Card key={post.id} className="overflow-hidden">
            <Link to={`/blog/${post.id}`}>
              <AspectRatio ratio={16/9}>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </AspectRatio>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
