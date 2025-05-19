
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, File, Video, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/types";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide';
  imageUrl: string;
  tags: string[];
  datePublished: string;
  author: string;
}

const Library = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isRTL = language === 'ar';

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    window.scrollTo(0, 0);
    fetchResources();
  }, [user, navigate]);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from a database
      // For now, we'll use mock data
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Understanding Anxiety Disorders',
          description: 'Learn about different types of anxiety disorders and their symptoms.',
          type: 'article',
          imageUrl: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
          tags: ['anxiety', 'mental health', 'disorders'],
          datePublished: '2023-06-15',
          author: 'Dr. Sarah Johnson'
        },
        {
          id: '2',
          title: 'Meditation Techniques for Beginners',
          description: 'A step-by-step guide to starting a meditation practice.',
          type: 'guide',
          imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=999&q=80',
          tags: ['meditation', 'mindfulness', 'self-care'],
          datePublished: '2023-07-10',
          author: 'Dr. Michael Lee'
        },
        {
          id: '3',
          title: 'Managing Depression: Therapy Approaches',
          description: 'An overview of different therapy approaches for treating depression.',
          type: 'article',
          imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1167&q=80',
          tags: ['depression', 'therapy', 'treatment'],
          datePublished: '2023-05-22',
          author: 'Dr. Emily Carter'
        },
        {
          id: '4',
          title: 'Breathing Exercises for Stress Relief',
          description: 'A video tutorial on effective breathing techniques to reduce stress.',
          type: 'video',
          imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=999&q=80',
          tags: ['stress', 'breathing', 'relaxation'],
          datePublished: '2023-08-05',
          author: 'Dr. David Williams'
        },
        {
          id: '5',
          title: 'Building Healthy Relationships',
          description: 'Learn strategies for developing and maintaining healthy relationships.',
          type: 'guide',
          imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
          tags: ['relationships', 'communication', 'social'],
          datePublished: '2023-07-28',
          author: 'Dr. Lisa Thompson'
        },
      ];

      setResources(mockResources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error(t('error_loading_resources'));
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <BookOpen className="h-4 w-4" />;
      case 'guide':
        return <File className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === "" || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = activeTab === 'all' || resource.type === activeTab;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('library')}</h1>
          <p className="text-muted-foreground">
            {t('library_description')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative md:max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_resources')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">{t('all')}</TabsTrigger>
              <TabsTrigger value="article">{t('articles')}</TabsTrigger>
              <TabsTrigger value="guide">{t('guides')}</TabsTrigger>
              <TabsTrigger value="video">{t('videos')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('no_resources_found')}</h2>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? t('no_resources_found_for_search') : t('no_resources_available')}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                {t('clear_search')}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden">
                <div 
                  className="h-48 w-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${resource.imageUrl})` }}
                />
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(resource.type)}
                    <Badge variant="secondary">{t(resource.type)}</Badge>
                  </div>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.author}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full flex items-center justify-center gap-1">
                    {t('read_now')} <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Library;
