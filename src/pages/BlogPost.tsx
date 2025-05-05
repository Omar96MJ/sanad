
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MessageSquare, Share2, ArrowLeft, Bookmark, Heart } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Type definition for blog post
interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  categories: string[];
  readTime: number;
}

// Get blog posts from Blog.tsx
// This is a simplified version to make sure we have the latest content
const getBlogPostsData = () => {
  // Import mockBlogs from Blog page
  const mockBlogsModule = require('./Blog');
  const blogPosts = mockBlogsModule.default?.mockBlogs || [];
  
  return blogPosts.map(blog => ({
    id: blog.id,
    title: blog.title,
    slug: blog.id,
    excerpt: blog.excerpt,
    content: blog.content,
    imageUrl: blog.imageUrl,
    date: blog.publishedDate,
    author: {
      name: blog.author,
      avatar: "/placeholder.svg",
      role: blog.authorRole === 'doctor' ? 'Clinical Psychologist' : 'Writer'
    },
    categories: blog.tags,
    readTime: Math.ceil(blog.content.length / 2000) // Approximate read time based on content length
  }));
};

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

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-16 md:mt-20">
        {/* Back button */}
        <Link to="/blog" className="text-primary hover:underline flex items-center mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
        </Link>

        {/* Hero image */}
        <div className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
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

        <Separator className="my-8" />

        {/* Social sharing and actions */}
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

        {/* Post content */}
        <div 
          className="prose max-w-none dark:prose-invert prose-headings:mb-4 prose-p:mb-4 prose-headings:mt-8 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Separator className="my-8" />

        {/* Author card */}
        <Card className="p-6 mb-8">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">About {post.author.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{post.author.role}</p>
              <p className="text-sm">
                An experienced healthcare professional dedicated to improving mental health outcomes 
                through evidence-based practice and compassionate care.
              </p>
            </div>
          </div>
        </Card>

        {/* Share buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-12">
          <span className="font-medium flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share this article:
          </span>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </Button>
          </div>
        </div>

        {/* Related posts */}
        <div className="mt-12 mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPostsData
              .filter(relatedPost => relatedPost.id !== post.id)
              .slice(0, 2)
              .map(relatedPost => (
                <Card key={relatedPost.id} className="overflow-hidden">
                  <Link to={`/blog/${relatedPost.id}`}>
                    <div className="h-48 overflow-hidden">
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2">{relatedPost.title}</h3>
                      <p className="text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                  </Link>
                </Card>
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
