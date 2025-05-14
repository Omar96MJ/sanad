
import React from 'react';
import { BlogPost } from '@/lib/types';
import BlogCard from '@/components/BlogCard';
import { useLanguage } from '@/hooks/useLanguage';

interface BlogListProps {
  blogs: BlogPost[];
  isVisible: boolean;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, isVisible }) => {
  const { t } = useLanguage();

  if (!blogs.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-4">{t('no_articles_found')}</h3>
        <p className="text-muted-foreground">
          {t('try_adjusting_search')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog, index) => (
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
  );
};

export default BlogList;
