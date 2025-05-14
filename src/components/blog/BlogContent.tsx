
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { BlogPostData } from '@/utils/blogUtils';
import BlogSocialActions from './BlogSocialActions';
import AuthorCard from './AuthorCard';
import ShareSection from './ShareSection';

interface BlogContentProps {
  post: BlogPostData;
}

const BlogContent: React.FC<BlogContentProps> = ({ post }) => {
  return (
    <>
      <Separator className="my-8" />

      {/* Social sharing and actions */}
      <BlogSocialActions />

      {/* Post content */}
      <div 
        className="prose max-w-none dark:prose-invert prose-headings:mb-4 prose-p:mb-4 prose-headings:mt-8 prose-img:rounded-lg prose-headings:text-primary prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <Separator className="my-8" />

      {/* Author card */}
      <AuthorCard author={post.author} />

      {/* Share buttons */}
      <ShareSection />
    </>
  );
};

export default BlogContent;
