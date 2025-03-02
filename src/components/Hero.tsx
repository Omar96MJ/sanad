
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

const Hero = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center">
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-gentle"></div>
      </div>
      
      <div className="container-custom flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div 
          className={`w-full lg:w-1/2 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-block bg-primary/10 text-primary font-medium rounded-full px-4 py-1 mb-6">
            {t('mental_health_matters')}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t('journey_better_mental_health')}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            {t('connect_with_therapists')}
          </p>
          <div className="flex flex-wrap gap-4">
            {!user ? (
              <>
                <Link to="/register">
                  <Button className="btn-primary" size="lg">
                    {t('get_started')}
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg" className="rounded-full">
                    {t('explore_resources')}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}>
                  <Button className="btn-primary" size="lg">
                    {t('go_to_dashboard')}
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg" className="rounded-full">
                    {t('browse_articles')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div 
          className={`w-full lg:w-1/2 transition-all duration-700 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative bg-background rounded-3xl p-2 shadow-custom">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
                alt={t('peaceful_scene')}
                className="w-full h-[500px] object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-background rounded-2xl p-4 shadow-custom">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16Z" fill="currentColor" className="text-primary" />
                    <path d="M19 16C20.1046 16 21 15.1046 21 14C21 12.8954 20.1046 12 19 12C17.8954 12 17 12.8954 17 14C17 15.1046 17.8954 16 19 16Z" fill="currentColor" className="text-primary" />
                    <path d="M5 16C6.10457 16 7 15.1046 7 14C7 12.8954 6.10457 12 5 12C3.89543 12 3 12.8954 3 14C3 15.1046 3.89543 16 5 16Z" fill="currentColor" className="text-primary" />
                    <path d="M12 9C13.1046 9 14 8.10457 14 7C14 5.89543 13.1046 5 12 5C10.8954 5 10 5.89543 10 7C10 8.10457 10.8954 9 12 9Z" fill="currentColor" className="text-primary" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{t('peace_of_mind')}</p>
                  <p className="text-sm text-muted-foreground">{t('find_your_calm')}</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 bg-background rounded-2xl p-4 shadow-custom">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 rounded-full p-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" className="text-secondary/80" />
                    <path d="M8 14C9.10457 14 10 13.1046 10 12C10 10.8954 9.10457 10 8 10C6.89543 10 6 10.8954 6 12C6 13.1046 6.89543 14 8 14Z" fill="white" />
                    <path d="M16 14C17.1046 14 18 13.1046 18 12C18 10.8954 17.1046 10 16 10C14.8954 10 14 10.8954 14 12C14 13.1046 14.8954 14 16 14Z" fill="white" />
                    <path d="M15.5 17C15.5 17 14.5 19 12 19C9.5 19 8.5 17 8.5 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{t('expert_support')}</p>
                  <p className="text-sm text-muted-foreground">{t('professional_care')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
