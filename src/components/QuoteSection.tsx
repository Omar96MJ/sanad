
import { useState, useEffect } from 'react';

const QuoteSection = () => {
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

    observer.observe(document.getElementById('quote-section') as Element);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="quote-section" 
      className="py-24 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-20 -bottom-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-8 text-primary/50">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            
            <blockquote className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
              صحتك النفسية ليست وجهة تصل إليها، بل هي رحلة مستمرة. تذكر أن تأخذ كل يوم خطوة للأمام، حتى لو كانت صغيرة.
            </blockquote>
            
            <p className="text-muted-foreground">— د. سارة الخليفي، أخصائية نفسية</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {[
            {
              quote: "ليس من العيب طلب المساعدة. الشجاعة الحقيقية تكمن في الاعتراف بأنك تحتاج إلى دعم.",
              author: "د. أحمد الشمري"
            },
            {
              quote: "الصحة النفسية ليست مجرد غياب المرض النفسي، بل هي وجود رفاهية عاطفية ونفسية واجتماعية.",
              author: "منظمة الصحة العالمية"
            },
            {
              quote: "العناية بنفسك ليست أنانية. لا يمكنك سكب من كأس فارغة.",
              author: "د. نورة العتيبي"
            }
          ].map((item, index) => (
            <div 
              key={index}
              className={`bg-accent/10 rounded-lg p-6 border border-accent/20 transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-accent/50">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
              </svg>
              <blockquote className="text-lg mb-4">
                {item.quote}
              </blockquote>
              <p className="text-muted-foreground text-sm">{item.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
