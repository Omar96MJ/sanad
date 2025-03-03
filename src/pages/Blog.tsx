
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

// Mock blog data
const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'فهم القلق: الأسباب والأعراض والعلاجات',
    excerpt: 'اضطرابات القلق هي أكثر مشاكل الصحة النفسية شيوعًا. تعرف على الأسباب والأعراض والعلاجات الفعالة.',
    content: '',
    author: 'د. سارة جونسون',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    tags: ['القلق', 'الصحة النفسية', 'العلاج']
  },
  {
    id: '2',
    title: 'قوة اليقظة الذهنية في الحياة اليومية',
    excerpt: 'اكتشف كيف يمكن لممارسة اليقظة الذهنية أن تقلل التوتر وتحسن التركيز وتعزز صحتك النفسية بشكل عام.',
    content: '',
    author: 'د. ميشيل لي',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tags: ['اليقظة الذهنية', 'التأمل', 'إدارة التوتر']
  },
  {
    id: '3',
    title: 'الاكتئاب في العصر الرقمي: التنقل في الصحة النفسية عبر الإنترنت',
    excerpt: 'كيف تؤثر وسائل التواصل الاجتماعي والتكنولوجيا الرقمية على الاكتئاب، واستراتيجيات للمشاركة الصحية عبر الإنترنت.',
    content: '',
    author: 'د. إيميلي وونغ',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-10-05',
    imageUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    tags: ['الاكتئاب', 'الرفاهية الرقمية', 'وسائل التواصل الاجتماعي']
  },
  {
    id: '4',
    title: 'بناء المرونة: كيفية التعافي من المحن',
    excerpt: 'تعلم استراتيجيات عملية لبناء المرونة العاطفية والتكيف في مواجهة الصدمات والمآسي والضغوط الكبيرة.',
    content: '',
    author: 'د. سارة جونسون',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-09-28',
    imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    tags: ['المرونة', 'مهارات التأقلم', 'الصحة النفسية']
  },
  {
    id: '5',
    title: 'النوم والصحة النفسية: الارتباط الحاسم',
    excerpt: 'افهم العلاقة المتبادلة بين النوم والصحة النفسية، وكيف يمكن لتحسين أحدهما أن يؤثر إيجابًا على الآخر.',
    content: '',
    author: 'د. ميشيل لي',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-09-20',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    tags: ['النوم', 'الصحة النفسية', 'الرفاهية']
  },
  {
    id: '6',
    title: 'الصحة النفسية للمراهقين: علامات يجب على الآباء مراقبتها',
    excerpt: 'دليل للآباء حول التعرف على علامات مشاكل الصحة النفسية لدى المراهقين وكيفية تقديم الدعم.',
    content: '',
    author: 'د. إيميلي وونغ',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-09-15',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tags: ['الأبوة والأمومة', 'الصحة النفسية للمراهقين', 'الدعم']
  }
];

const Blog = () => {
  const { t } = useLanguage();
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
              <h3 className="text-xl font-medium mb-4">{t('no_articles_found')}</h3>
              <p className="text-muted-foreground">
                {t('try_adjusting_search')}
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
