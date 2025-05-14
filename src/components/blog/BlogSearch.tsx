
import React from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

interface BlogSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  tags: string[];
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}

const BlogSearch: React.FC<BlogSearchProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  tags,
  activeTag,
  onTagClick
}) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="bg-muted/30 py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center slide-up">
            <div className="inline-block bg-primary/10 text-primary font-medium rounded-full px-4 py-1 mb-4">
              {t('mental_health_resources')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('explore_mental_health_blog')}
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              {t('discover_insights')}
            </p>
            <Input
              type="search"
              placeholder={t('search_articles')}
              className="max-w-md mx-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              className="rounded-full cursor-pointer transition-custom py-1 px-4"
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogSearch;
