
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

// Extended blog data with full content - this is moved to the BlogPost.tsx component
// and will be kept in sync between the two files
const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'فهم الاكتئاب: الأسباب والأعراض والعلاجات',
    excerpt: 'اضطرابات الاكتئاب تؤثر على ملايين الأشخاص حول العالم. تعرف على الأسباب والأعراض والعلاجات المتاحة.',
    content: '',
    author: 'د. سارة القحطاني',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    tags: ['الاكتئاب', 'الصحة النفسية', 'العلاج']
  },
  {
    id: '2',
    title: 'كيفية التغلب على القلق الاجتماعي',
    excerpt: 'إذا كنت تعاني من القلق الاجتماعي، فأنت لست وحدك. اكتشف استراتيجيات فعالة للتغلب على القلق في المواقف الاجتماعية.',
    content: '',
    author: 'د. أحمد الشمري',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    tags: ['القلق الاجتماعي', 'إدارة التوتر', 'الصحة النفسية']
  },
  {
    id: '3',
    title: 'العلاقة بين الصدمة والصحة النفسية',
    excerpt: 'تؤثر الصدمات النفسية على صحتنا العقلية بطرق عديدة. تعرف على كيفية التعافي من الصدمات وبناء المرونة النفسية.',
    content: '',
    author: 'د. نورة العتيبي',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-09-25',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    tags: ['الصدمة النفسية', 'التعافي', 'المرونة النفسية']
  },
  {
    id: '4',
    title: 'تقنيات العلاج المعرفي السلوكي للتعامل مع الأفكار السلبية',
    excerpt: 'العلاج المعرفي السلوكي هو أحد أكثر طرق العلاج النفسي فعالية. اكتشف كيف يمكن أن يساعدك في تغيير أنماط التفكير السلبية.',
    content: '',
    author: 'د. محمد السالم',
    authorId: '5',
    authorRole: 'doctor',
    publishedDate: '2023-09-15',
    imageUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
    tags: ['العلاج المعرفي السلوكي', 'التفكير الإيجابي', 'العلاج النفسي']
  },
  {
    id: '5',
    title: 'كيفية التعامل مع الضغوط في الحياة اليومية',
    excerpt: 'الضغط النفسي يؤثر على صحتنا الجسدية والعقلية. تعلم استراتيجيات فعالة للتعامل مع الضغوط اليومية وتحسين جودة الحياة.',
    content: '',
    author: 'د. ليلى المالكي',
    authorId: '6',
    authorRole: 'doctor',
    publishedDate: '2023-09-05',
    imageUrl: 'https://images.unsplash.com/photo-1485546784815-e380f3c5a786',
    tags: ['إدارة الضغط', 'الاسترخاء', 'الصحة النفسية']
  },
  {
    id: '6',
    title: 'تأثير النوم على الصحة النفسية',
    excerpt: 'النوم الجيد ضروري للصحة النفسية. اكتشف العلاقة بين النوم والصحة العقلية وكيفية تحسين عادات النوم.',
    content: '',
    author: 'د. سارة القحطاني',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-08-28',
    imageUrl: 'https://images.unsplash.com/photo-1522621032211-ac0031dfbddc',
    tags: ['النوم', 'الصحة النفسية', 'الراحة']
  },
  {
    id: '7',
    title: 'الصحة النفسية في مكان العمل: كيفية الحفاظ على توازن صحي',
    excerpt: 'يقضي معظمنا وقتًا طويلاً في العمل. تعرف على كيفية الحفاظ على صحتك النفسية في بيئة العمل وتجنب الإرهاق.',
    content: '',
    author: 'د. أحمد الشمري',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-08-14',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    tags: ['الصحة النفسية', 'بيئة العمل', 'التوازن']
  },
  {
    id: '8',
    title: 'التأمل واليقظة الذهنية: فوائدهما للصحة النفسية',
    excerpt: 'التأمل واليقظة الذهنية لهما فوائد عديدة للصحة النفسية. تعرف على كيفية دمجهما في حياتك اليومية لتحسين الصحة العقلية.',
    content: '',
    author: 'د. نورة العتيبي',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-07-30',
    imageUrl: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200',
    tags: ['التأمل', 'اليقظة الذهنية', 'الاسترخاء']
  },
  {
    id: '9',
    title: 'العلاقة بين الغذاء والمزاج: كيف يؤثر ما نأكله على صحتنا النفسية',
    excerpt: 'الغذاء له تأثير كبير على مزاجنا وصحتنا النفسية. اكتشف الأطعمة التي يمكن أن تحسن مزاجك والأطعمة التي يجب تجنبها.',
    content: '',
    author: 'د. محمد السالم',
    authorId: '5',
    authorRole: 'doctor',
    publishedDate: '2023-07-15',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    tags: ['التغذية', 'الصحة النفسية', 'الصحة الجسدية']
  },
  {
    id: '10',
    title: 'العلاقات الصحية: أسس بناء علاقات إيجابية',
    excerpt: 'العلاقات الصحية ضرورية لرفاهيتنا النفسية. تعرف على أسس بناء وحفاظ على علاقات إيجابية مع الآخرين.',
    content: '',
    author: 'د. ليلى المالكي',
    authorId: '6',
    authorRole: 'doctor',
    publishedDate: '2023-07-05',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tags: ['العلاقات', 'التواصل', 'الصحة النفسية']
  },
  {
    id: '11',
    title: 'التعامل مع الخسارة والحزن',
    excerpt: 'الخسارة والحزن جزء من الحياة. تعلم كيفية التعامل مع الفقدان والتعافي من الحزن بطريقة صحية.',
    content: '',
    author: 'د. سارة القحطاني',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-06-20',
    imageUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    tags: ['الحزن', 'الخسارة', 'التعافي']
  },
  {
    id: '12',
    title: 'تقدير الذات: كيفية بناء صورة إيجابية عن نفسك',
    excerpt: 'تقدير الذات الصحي أساسي للصحة النفسية. اكتشف استراتيجيات لتعزيز احترامك لذاتك وتحسين ثقتك بنفسك.',
    content: '',
    author: 'د. أحمد الشمري',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-06-10',
    imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    tags: ['تقدير الذات', 'الثقة بالنفس', 'الصحة النفسية']
  }
];

const Blog = () => {
  const { t, language } = useLanguage();
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
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
