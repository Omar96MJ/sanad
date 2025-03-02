
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/lib/types';
import BlogCard from './BlogCard';
import { useLanguage } from '@/hooks/useLanguage';

// Mock blog data
const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: Causes, Symptoms, and Treatments',
    excerpt: 'Anxiety disorders are the most common mental health concern in the United States. Learn about the causes, symptoms, and effective treatments.',
    content: '',
    author: 'Dr. Sarah Johnson',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    tags: ['Anxiety', 'Mental Health', 'Therapy']
  },
  {
    id: '2',
    title: 'The Power of Mindfulness in Daily Life',
    excerpt: 'Discover how practicing mindfulness can reduce stress, improve focus, and enhance your overall mental wellbeing.',
    content: '',
    author: 'Dr. Michael Lee',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tags: ['Mindfulness', 'Meditation', 'Stress Management']
  },
  {
    id: '3',
    title: 'Depression in the Digital Age: Navigating Mental Health Online',
    excerpt: 'How social media and digital technology impact depression, and strategies for healthy online engagement.',
    content: '',
    author: 'Dr. Emily Wong',
    authorId: '4',
    authorRole: 'doctor',
    publishedDate: '2023-10-05',
    imageUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    tags: ['Depression', 'Digital Wellbeing', 'Social Media']
  }
];

const FeaturedContent = () => {
  const { t } = useLanguage();
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
          {mockBlogs.map((blog, index) => (
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
