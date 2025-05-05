
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
  const { language } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  return (
    <Link to={`/blog/${blog.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 border border-border/50">
        <div className="relative aspect-video overflow-hidden">
          <div className={`absolute inset-0 bg-muted animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}></div>
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full font-normal text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
            {blog.title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 mb-4 text-sm">
            {blog.excerpt}
          </p>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground flex items-center justify-between pt-0 border-t border-border/30 mt-auto">
          <span className="font-medium">{blog.author}</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(blog.publishedDate)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
