
import { BlogPost } from "@/lib/types";
import { mockBlogs } from "@/data/mockBlogs";

// Type definition for blog post display data
export interface BlogPostData {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  excerpt: string;
  excerptAr?: string;
  content: string;
  contentAr?: string;
  imageUrl: string;
  date: string;
  author: {
    name: string;
    nameAr?: string;
    avatar: string;
    role: string;
    roleAr?: string;
  };
  categories: string[];
  categoriesAr?: string[];
  readTime: number;
}

// Convert mockBlogs to the format needed for BlogPostPage
export const getBlogPostsData = (): BlogPostData[] => {
  return mockBlogs.map(blog => ({
    id: blog.id,
    title: blog.title,
    titleAr: blog.titleAr,
    slug: blog.id,
    excerpt: blog.excerpt,
    excerptAr: blog.excerptAr,
    content: blog.content || 'Content coming soon...',
    contentAr: blog.contentAr,
    imageUrl: blog.imageUrl,
    date: blog.publishedDate,
    author: {
      name: blog.author,
      nameAr: blog.authorAr,
      avatar: "/placeholder.svg",
      role: blog.authorRole === 'doctor' ? 'Clinical Psychologist' : 'Writer',
      roleAr: blog.authorRole === 'doctor' ? 'أخصائي نفسي سريري' : 'كاتب'
    },
    categories: blog.tags,
    categoriesAr: blog.tagsAr,
    readTime: Math.max(5, Math.ceil((blog.content?.length || 0) / 2000)) // Calculate read time based on content length, minimum 5 minutes
  }));
};

// Format date based on user's language
export const formatDate = (dateString: string, language: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', options);
};

// Get unique tags from blog posts
export const getAllUniqueTags = (blogs: BlogPost[], language: string): string[] => {
  return Array.from(
    new Set(blogs.flatMap(blog => 
      language === 'ar' && blog.tagsAr ? blog.tagsAr : blog.tags
    ))
  ).sort();
};

// Find related posts by tag intersection
export const getRelatedPosts = (currentPost: BlogPostData, allPosts: BlogPostData[], limit: number = 2): BlogPostData[] => {
  return allPosts
    .filter(post => 
      post.id !== currentPost.id && 
      post.categories.some(category => currentPost.categories.includes(category))
    )
    .slice(0, limit);
};
