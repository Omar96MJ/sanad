
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/lib/types';
import BlogCard from './BlogCard';
import { useLanguage } from '@/hooks/useLanguage';

// Mock blog data including the requested topics
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
];

const FeaturedContent = () => {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(document.getElementById('featured-content') as Element);

    return () => observer.disconnect();
  }, []);

  // Filter the blogs to show only the first 3 or 6 depending on screen size
  const featuredBlogs = mockBlogs.slice(0, 6);

  return (
    <section 
      id="featured-content" 
      className="py-20 bg-gradient-to-b from-background to-accent/20"
    >
      <div className="container-custom">
        <div className="text-center mb-12">
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-block bg-secondary/10 text-secondary-foreground font-medium rounded-full px-4 py-1 mb-4">
              {t('latest_resources')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('featured_mental_health_articles')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('explore_latest_articles')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBlogs.map((blog, index) => (
            <div 
              key={blog.id}
              className={`transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>

        <div 
          className={`flex justify-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link to="/blog">
            <Button variant="outline" size="lg" className="rounded-full">
              {t('view_all_articles')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;
