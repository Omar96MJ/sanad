
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Calendar } from 'lucide-react';

interface BlogCardProps {
  blog: BlogPost;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const { language, t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  // Use Arabic title and excerpt if available and language is Arabic
  const title = language === 'ar' && blog.titleAr ? blog.titleAr : blog.title;
  const excerpt = language === 'ar' && blog.excerptAr ? blog.excerptAr : blog.excerpt;
  const author = language === 'ar' && blog.authorAr ? blog.authorAr : blog.author;

  return (
    <Link to={`/blog/${blog.id}`}>
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md border-border/40 rounded-xl">
        <div className="relative aspect-[16/9] overflow-hidden">
          <div className={`absolute inset-0 bg-muted animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}></div>
          <img
            src={blog.imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>
        <CardContent className="pt-5">
          <div className="flex flex-wrap gap-2 mb-2">
            {blog.tags.slice(0, 2).map((tag, index) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal px-2 py-0.5 rounded-md bg-secondary/30">
                {language === 'ar' && blog.tagsAr && blog.tagsAr[index] ? blog.tagsAr[index] : tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-lg font-medium mb-2 line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 mb-3 text-sm">
            {excerpt}
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground border-t border-border/30 pt-3 pb-4 flex items-center justify-between">
          <span className="font-medium">{author}</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(blog.publishedDate)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
