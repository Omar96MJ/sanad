
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

const Hero = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 w-full h-full bg-gradient-to-b from-primary/5 to-background"></div>
      </div>
      
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div 
            className={`transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex flex-col max-w-xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {isRTL 
                  ? 'الوصول إلى مساحة آمنة للدعم النفسي'
                  : 'Access a safe space for mental health support'}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {isRTL 
                  ? 'في سند، نربطك بأخصائيين نفسيين مؤهلين لمساعدتك في رحلة الصحة النفسية الخاصة بك. العلاج الميسر والسري من راحة منزلك.'
                  : 'At Sanad, we connect you with qualified mental health professionals to help you on your mental health journey. Accessible and confidential therapy from the comfort of your home.'}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {!user ? (
                  <>
                    <Link to="/register">
                      <Button className="bg-primary text-white px-8 py-3 rounded-md text-base font-medium hover:bg-primary/90">
                        {isRTL ? 'ابدأ الآن' : 'Get Started Now'}
                      </Button>
                    </Link>
                    <Link to="/blog">
                      <Button variant="outline" className="px-8 py-3 rounded-md text-base font-medium">
                        {isRTL ? 'تصفح المقالات' : 'Browse Articles'}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}>
                      <Button className="bg-primary text-white px-8 py-3 rounded-md text-base font-medium hover:bg-primary/90">
                        {isRTL ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
                      </Button>
                    </Link>
                    <Link to="/blog">
                      <Button variant="outline" className="px-8 py-3 rounded-md text-base font-medium">
                        {isRTL ? 'تصفح المقالات' : 'Browse Articles'}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-12">
                <div className="flex -space-x-4 rtl:space-x-reverse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/>
                    <circle cx="20" cy="4" r="3" fill="#4CAF50" stroke="white" stroke-width="1"/>
                  </svg>

                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">500+</span> {isRTL ? 'مستخدم نشط' : 'active users'}
                </div>
              </div>
            </div>
          </div>
          
          <div 
            className={`transition-all duration-700 ease-out delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src="/lovable-uploads/0e3cf0d5-fc00-4468-90df-ea4b401e4c9e.png" 
                alt={isRTL ? "معالج نفسي" : "Therapist"}
                className="w-full object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 19a5 5 0 0 1-1.999-9.599A5.5 5.5 0 0 1 17.001 7a4.5 4.5 0 0 1-.999 8.899"></path>
                      <path d="M12 19v.01"></path>
                      <path d="M8 15v.01"></path>
                      <path d="M16 15v.01"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{isRTL ? 'دعم موثوق' : 'Trusted Support'}</h3>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'متصل مع معالجين معتمدين' : 'Connected with certified therapists'}</p>
                  </div>
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
