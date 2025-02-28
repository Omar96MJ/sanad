
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock blog data
const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: Causes, Symptoms, and Treatments',
    excerpt: 'Anxiety disorders are the most common mental health concern in the United States. Learn about the causes, symptoms, and effective treatments.',
    content: '',
    author: 'Dr. Sarah Johnson',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    tags: ['Anxiety', 'Mental Health', 'Therapy']
  },
  {
    id: '2',
    title: 'The Power of Mindfulness in Daily Life',
    excerpt: 'Discover how practicing mindfulness can reduce stress, improve focus, and enhance your overall mental wellbeing.',
    content: '',
    author: 'Dr. Michael Lee',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tags: ['Mindfulness', 'Meditation', 'Stress Management']
  },
  {
    id: '3',
    title: 'Depression in the Digital Age: Navigating Mental Health Online',
    excerpt: 'How social media and digital technology impact depression, and strategies for healthy online engagement.',
    content: '',
    author: 'Dr. Emily Wong',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-10-05',
    imageUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    tags: ['Depression', 'Digital Wellbeing', 'Social Media']
  },
  {
    id: '4',
    title: 'Building Resilience: How to Bounce Back from Adversity',
    excerpt: 'Learn practical strategies to build emotional resilience and adapt in the face of trauma, tragedy, and significant stress.',
    content: '',
    author: 'Dr. Sarah Johnson',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-09-28',
    imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    tags: ['Resilience', 'Coping Skills', 'Mental Health']
  },
  {
    id: '5',
    title: 'Sleep and Mental Health: The Critical Connection',
    excerpt: 'Understand the bidirectional relationship between sleep and mental health, and how improving one can positively impact the other.',
    content: '',
    author: 'Dr. Michael Lee',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-09-20',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    tags: ['Sleep', 'Mental Health', 'Wellbeing']
  },
  {
    id: '6',
    title: 'Teenage Mental Health: Signs Parents Should Watch For',
    excerpt: 'A guide for parents on recognizing signs of mental health issues in teenagers and how to provide support.',
    content: '',
    author: 'Dr. Emily Wong',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-09-15',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tags: ['Parenting', 'Teen Mental Health', 'Support']
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>(mockBlogs);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Trigger animation after component mounts
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  useEffect(() => {
    let result = mockBlogs;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by active tag
    if (activeTag) {
      result = result.filter(blog => 
        blog.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
      );
    }
    
    setFilteredBlogs(result);
  }, [searchTerm, activeTag]);

  // Get all unique tags
  const allTags = Array.from(
    new Set(mockBlogs.flatMap(blog => blog.tags))
  ).sort();

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 pb-16">
        <div className="bg-muted/30 py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center slide-up">
              <div className="inline-block bg-primary/10 text-primary font-medium rounded-full px-4 py-1 mb-4">
                Mental Health Resources
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Explore Our Mental Health Blog
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Discover insights, advice, and the latest research on mental health from our expert professionals.
              </p>
              <Input
                type="search"
                placeholder="Search articles..."
                className="max-w-md mx-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="container-custom mt-12">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={activeTag === tag ? "default" : "outline"}
                className="rounded-full cursor-pointer transition-custom py-1 px-4"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <div 
                  key={blog.id}
                  className={`transition-all duration-700 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-4">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
