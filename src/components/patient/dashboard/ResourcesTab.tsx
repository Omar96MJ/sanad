
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "@/lib/types";

interface ResourcesTabProps {
  articles: BlogPost[];
}

export const ResourcesTab = ({ articles }: ResourcesTabProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-8">
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>{t('mental_health_resources')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-accent rounded-lg p-6 hover:shadow-md transition-all">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6.25278V19.2528M18.5 12.7528H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('emergency_help')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('access_immediate_support')}
              </p>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                {t('view_resources')} →
              </a>
            </div>
            
            <div className="bg-accent rounded-lg p-6 hover:shadow-md transition-all">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                  <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                  <path d="M9 9H9.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                  <path d="M15 9H15.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('self_help_tools')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('explore_exercises')}
              </p>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                {t('access_tools')} →
              </a>
            </div>
            
            <div className="bg-accent rounded-lg p-6 hover:shadow-md transition-all">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                  <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('educational_material')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('learn_about_mental_health')}
              </p>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                {t('start_learning')} →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>{t('recommended_articles')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <BlogCard key={article.id} blog={article} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
