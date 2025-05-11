
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, Baby } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const TherapyTypes = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
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
            <Link to={selectedType ? "/book-session" : "#"}>
              <Button 
                size="lg"
                className="px-8"
                disabled={!selectedType}
              >
                {isRTL ? 'المتابعة' : 'Continue'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TherapyTypes;
