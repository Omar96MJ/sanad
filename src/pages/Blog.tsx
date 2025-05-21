
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogList from "@/components/blog/BlogList";
import { mockBlogs } from "@/data/mockBlogs";
import { getAllUniqueTags } from "@/utils/blogUtils";

const Blog = () => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filteredBlogs, setFilteredBlogs] = useState(mockBlogs);
  const [isVisible, setIsVisible] = useState(false);

  // Get all unique tags
  const allTags = getAllUniqueTags(mockBlogs, language);

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

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 pb-16">
        <BlogSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          tags={allTags}
          activeTag={activeTag}
          onTagClick={handleTagClick}
        />

        <div className="container-custom">
          <BlogList blogs={filteredBlogs} isVisible={isVisible} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
