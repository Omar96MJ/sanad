
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
    title: 'استراتيجيات التعامل مع القلق في الحياة اليومية',
    excerpt: 'تعرف على طرق فعالة للتعامل مع القلق وكيفية تطبيقها في حياتك اليومية للحصول على راحة نفسية أفضل.',
    content: '',
    author: 'د. أحمد الشمري',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    tags: ['القلق', 'إدارة التوتر', 'الصحة النفسية']
  },
  {
    id: '3',
    title: 'تحليل أنماط الشخصية: اكتشف ذاتك الحقيقية',
    excerpt: 'كل شخصية فريدة من نوعها. اكتشف مزيدًا عن أنماط الشخصية وكيف يمكن أن تساعدك في فهم نفسك والآخرين بشكل أفضل.',
    content: '',
    author: 'د. نورة العتيبي',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-09-25',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    tags: ['الشخصية', 'علم النفس', 'التنمية الذاتية']
  },
  {
    id: '4',
    title: 'ADHD عند البالغين: كيف تتعامل مع التحديات اليومية',
    excerpt: 'اضطراب فرط الحركة ونقص الانتباه ليس فقط عند الأطفال. تعرف على كيفية التعامل مع هذا الاضطراب في مرحلة البلوغ.',
    content: '',
    author: 'د. محمد السالم',
    authorId: '5',
    authorRole: 'doctor',
    publishedDate: '2023-09-15',
    imageUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
    tags: ['ADHD', 'فرط الحركة', 'التركيز']
  },
  {
    id: '5',
    title: 'الصحة النفسية للأطفال: دليل للآباء والمعلمين',
    excerpt: 'كيفية التعرف على علامات المشاكل النفسية عند الأطفال والخطوات التي يمكن اتخاذها لدعم صحتهم النفسية.',
    content: '',
    author: 'د. ليلى المالكي',
    authorId: '6',
    authorRole: 'doctor',
    publishedDate: '2023-09-05',
    imageUrl: 'https://images.unsplash.com/photo-1485546784815-e380f3c5a786',
    tags: ['الأطفال', 'الصحة النفسية', 'التربية']
  },
  {
    id: '6',
    title: 'الغيرة في العلاقات: متى تكون صحية ومتى تصبح مشكلة',
    excerpt: 'استكشف الفرق بين الغيرة الصحية والمرضية في العلاقات وكيفية التعامل معها بطريقة بناءة.',
    content: '',
    author: 'د. سارة القحطاني',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-08-28',
    imageUrl: 'https://images.unsplash.com/photo-1522621032211-ac0031dfbddc',
    tags: ['الغيرة', 'العلاقات', 'الصحة النفسية']
  },
  {
    id: '7',
    title: 'علم نفس الحب: كيف يؤثر على عقولنا وأجسادنا',
    excerpt: 'تأثير الحب على الدماغ والهرمونات والصحة النفسية والجسدية، والفرق بين أنواع الحب المختلفة.',
    content: '',
    author: 'د. أحمد الشمري',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-08-14',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    tags: ['الحب', 'العلاقات', 'علم النفس']
  },
  {
    id: '8',
    title: 'الشغف والإبداع: كيف تجد شغفك وتطوره',
    excerpt: 'أهمية الشغف في حياتنا وكيف يمكن اكتشافه وتنميته لتحقيق الإنجاز والرضا النفسي.',
    content: '',
    author: 'د. نورة العتيبي',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-07-30',
    imageUrl: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200',
    tags: ['الشغف', 'الإبداع', 'تحقيق الذات']
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
