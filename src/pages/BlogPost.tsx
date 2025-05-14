
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { getBlogPostsData, getRelatedPosts } from "@/utils/blogUtils";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogContent from "@/components/blog/BlogContent";
import RelatedPosts from "@/components/blog/RelatedPosts";

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const blogPostsData = getBlogPostsData();
  const post = blogPostsData.find(post => post.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <Link to="/blog" className="text-blue-500 hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
        </Link>
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(post, blogPostsData);

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-16 md:mt-20">
        <BlogHeader post={post} />
        <Separator className="my-8" />
        <BlogContent post={post} />
        <RelatedPosts posts={relatedPosts} />
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
