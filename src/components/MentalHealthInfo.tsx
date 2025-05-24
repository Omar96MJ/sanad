
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';


const MentalHealthInfo = () => {
  const [isVisible, setIsVisible] = useState(false);


  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const isRTL = language === 'ar';

  
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

    observer.observe(document.getElementById('mental-health-info') as Element);

    return () => observer.disconnect();
  }, []);

  const mentalHealthCategories = [
    {
      title: isRTL
      ? "الاكتئاب"
      : "Depression",
      description: isRTL 
      ? "الاكتئاب هو حالة نفسية تتميز بالحزن المستمر وفقدان الاهتمام وصعوبة في القيام بالأنشطة اليومية. يمكن أن يسبب مجموعة واسعة من المشكلات العاطفية والجسدية."
      : "Depression is a psychological condition characterized by persistent sadness, loss of interest, and difficulty performing daily activities. It can cause a wide range of emotional and physical problems.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M8 15h8" />
          <path d="M9 9h.01" />
          <path d="M15 9h.01" />
        </svg>
      )
    },
    {
      title: isRTL
      ? "القلق"
      : "Anxiety",
      description: isRTL
      ? "اضطرابات القلق تتميز بمشاعر قوية من الخوف والقلق. يشعر الأشخاص المصابون بالقلق بالتوتر والعصبية ويمكن أن يعانوا من تغيرات جسدية مثل زيادة معدل ضربات القلب."
      : "Anxiety disorders are characterized by strong feelings of fear and anxiety. People with anxiety feel stressed and nervous and can experience physical changes such as an increased heart rate.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M8 15h.01" />
          <path d="M16 15h.01" />
          <path d="M8 9h.01" />
          <path d="M16 9h.01" />
        </svg>
      )
    },
    {
      title: isRTL
      ? "التوتر"
      : "Stress",
      description: isRTL
      ? "التوتر هو استجابة الجسم للضغوط. يمكن أن يسبب أعراضًا جسدية مثل الصداع وآلام العضلات، وأعراضًا عاطفية مثل القلق والاكتئاب، وأعراضًا سلوكية مثل تغيرات في النوم والشهية."
      : "Stress is the body's response to stress. It can cause physical symptoms such as headaches and muscle aches, emotional symptoms such as anxiety and depression, and behavioral symptoms such as changes in sleep and appetite.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M12 20v-6M12 8V2M2 12h20M17 12a5 5 0 0 1-10 0" />
        </svg>
      )
    },
    {
      title: isRTL
      ? "الصدمة النفسية"
      : "psychological Trauma",
      description: isRTL
      ? "الصدمة النفسية هي استجابة عاطفية لحدث مؤلم. يمكن أن تسبب مجموعة من ردود الفعل الجسدية والعاطفية، بما في ذلك صعوبة النوم، والذكريات المتطفلة، والتجنب."
      : "Psychological Trauma is an emotional response to a traumatic event. They can cause a range of physical and emotional reactions, including difficulty sleeping, intrusive memories, and avoidance.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="m3 8 4 2 4-5 4 5 4-2" />
          <path d="M3 17h18" />
          <path d="M3 12h5l2 5h4l2-5h5" />
        </svg>
      )
    },
    {
      title: isRTL
      ? "اضطرابات الأكل"
      : "Eating Disorders",
      description: isRTL
      ? "اضطرابات الأكل هي حالات نفسية تتميز بعادات أكل غير صحية وقلق شديد بشأن وزن الجسم أو شكله. تشمل الأنواع الشائعة فقدان الشهية العصبي والشره المرضي العصبي."
      : "Eating disorders are psychological conditions characterized by unhealthy eating habits and intense anxiety about body weight or shape. Common types include anorexia nervosa and bulimia nervosa.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M18 6h-9a6 6 0 1 0 0 12h9" />
          <path d="M10 12h10" />
        </svg>
      )
    },
    {
      title: isRTL
      ? "اضطرابات النوم"
      : "Sleep Disorders",
      description: isRTL
      ? "اضطرابات النوم هي حالات تؤثر على قدرتك على النوم بشكل جيد بانتظام. يمكن أن تؤثر اضطرابات النوم على صحتك العامة وجودة حياتك وسلامتك."
      : "Sleep disorders are conditions that affect your ability to sleep well regularly. Sleep disorders can affect your overall health, quality of life, and safety.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M12 2a7 7 0 0 0-7 7c0 1.462.473 2.814 1.277 3.91L12 21l5.723-8.09A7.003 7.003 0 0 0 19 9a7 7 0 0 0-7-7z" />
          <circle cx="12" cy="9" r="2" />
        </svg>
      )
    }
  ];

  return (
    <section id="mental-health-info" className="py-20 bg-muted/20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-block bg-primary/10 text-primary font-medium rounded-full px-4 py-1 mb-4">
              {t('understanding_mental_health')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('Your_comprehensive_guide_to_mental_health')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('learn_about_mental_health_conditions')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentalHealthCategories.map((category, index) => (
            <div 
              key={category.title}
              className={`transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Card className="h-full hover:shadow-md transition-shadow border border-muted-foreground/10">
                <CardContent className="p-6">
                  <div className="mb-4 text-primary">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div 
            className={`max-w-3xl mx-auto transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">كيف تحافظ على صحتك النفسية؟</h3>
            <p className="text-muted-foreground mb-6">
              الصحة النفسية هي جزء أساسي من الصحة العامة وتؤثر على كيفية تفكيرنا وشعورنا وتصرفنا. إليك بعض النصائح للحفاظ على صحتك النفسية:
            </p>
            <ul className="text-right space-y-3">
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span>حافظ على نشاطك البدني والتمارين المنتظمة</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span>تناول نظام غذائي متوازن ومغذي</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span>احصل على قسط كاف من النوم</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span>تعلم مهارات إدارة التوتر مثل التأمل واليوغا</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span>احتفظ بعلاقات اجتماعية إيجابية وداعمة</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span>اطلب المساعدة المهنية عندما تحتاج إليها</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentalHealthInfo;
