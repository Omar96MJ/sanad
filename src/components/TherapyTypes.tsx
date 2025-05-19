
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, Baby, Heart } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const TherapyTypes = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const therapyTypes = [
    {
      id: 'individual',
      title: isRTL ? 'العلاج الفردي' : 'Individual Therapy',
      description: isRTL ? 'للأفراد من عمر 18 وما فوق' : 'For aged 18 and over',
      icon: User,
    },
    {
      id: 'couple',
      title: isRTL ? 'علاج الأزواج' : 'Couple Therapy',
      description: isRTL ? 'لي ولشريكي' : 'For me and my partner',
      icon: Users,
    },
    {
      id: 'teenager',
      title: isRTL ? 'علاج المراهقين' : 'Teenager Therapy',
      description: isRTL ? 'للأطفال تحت سن 18 سنة' : 'For children under 18 years old',
      icon: Baby,
    },
  ];

  const handleContinue = () => {
    if (selectedType) {
      // Store the selected therapy type in localStorage to retrieve it later if needed
      localStorage.setItem('selectedTherapyType', selectedType);
      // Redirect to the register page
      navigate('/register');
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {isRTL ? 'ما نوع العلاج الذي تبحث عنه؟' : 'What type of therapy are you looking for?'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? 'اختر نوع العلاج الذي يناسب احتياجاتك لنتمكن من توصيلك بالمعالج المناسب'
              : 'Select the type of therapy that fits your needs so we can connect you with the right therapist'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <RadioGroup 
            value={selectedType || ''}
            onValueChange={setSelectedType}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {therapyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <label 
                  key={type.id}
                  className={cn(
                    "cursor-pointer group",
                    selectedType === type.id ? "ring-2 ring-primary" : ""
                  )}
                >
                  <Card className={cn(
                    "transition-all duration-300 h-full flex flex-col items-center text-center p-6",
                    "hover:border-primary/50 hover:shadow-md",
                    selectedType === type.id ? "border-primary bg-primary/5" : ""
                  )}>
                    <RadioGroupItem 
                      value={type.id} 
                      id={type.id} 
                      className="sr-only"
                    />
                    
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
                      selectedType === type.id 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <Icon size={32} />
                    </div>
                    
                    <h3 className="font-medium text-xl mb-2">{type.title}</h3>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    
                    <div className="mt-auto pt-2">
                      <div className={cn(
                        "w-4 h-4 rounded-full mx-auto border-2",
                        selectedType === type.id 
                          ? "border-4 border-primary" 
                          : "border-muted-foreground"
                      )} />
                    </div>
                  </Card>
                </label>
              );
            })}
          </RadioGroup>
          
          <div className="flex justify-center mt-8">
            <Button 
              size="lg"
              className="px-8"
              disabled={!selectedType}
              onClick={handleContinue}
            >
              {isRTL ? 'المتابعة' : 'Continue'}
            </Button>
          </div>
        </div>

        {/* Donation Section */}
        <div className="max-w-4xl mx-auto mt-16 pt-12 border-t">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-red-100 text-red-600 rounded-full mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {isRTL ? 'ساهم في دعم رسالتنا' : 'Support Our Mission'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              {isRTL 
                ? 'تبرعك يساعدنا في تقديم الدعم النفسي للمحتاجين وتوسيع خدماتنا للوصول إلى المزيد من الناس'
                : 'Your donation helps us provide mental health support to those in need and expand our services to reach more people'}
            </p>
            <Link to="/donation">
              <Button 
                size="lg" 
                className="px-10 bg-red-500 hover:bg-red-600"
              >
                {isRTL ? 'تبرع الآن' : 'Donate Now'}
                <Heart className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TherapyTypes;
