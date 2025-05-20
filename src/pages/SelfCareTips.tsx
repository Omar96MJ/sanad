import Navbar from "@/components/Navbar";
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/useLanguage';
import { Leaf, Smile, Heart, Waves, Brain, FlowerIcon } from 'lucide-react';
import Footer from '@/components/Footer';

const SelfCareTips = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-16 lg:py-20">
        <div className="container-custom py-10" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-600 rounded-full mb-4">
              <FlowerIcon className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('self_care_tips_title')}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('self_care_tips_subtitle')}
            </p>
          </div>

          {/* Introduction Section */}
          <div className="mb-12">
            <p className="text-lg mb-6">{t('self_care_intro_text')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <InfoCard 
                icon={<Heart className="h-6 w-6" />}
                title={t('importance_of_self_care')}
                description={t('importance_of_self_care_desc')}
                color="bg-red-100"
                textColor="text-red-600"
              />
              <InfoCard 
                icon={<Brain className="h-6 w-6" />}
                title={t('benefits_of_self_care')}
                description={t('benefits_of_self_care_desc')}
                color="bg-indigo-100"
                textColor="text-indigo-600"
              />
              <InfoCard 
                icon={<Smile className="h-6 w-6" />}
                title={t('start_small')}
                description={t('start_small_desc')}
                color="bg-amber-100"
                textColor="text-amber-600"
              />
            </div>
          </div>

          {/* Physical Self-Care */}
          <SelfCareCategory 
            title={t('physical_self_care')}
            description={t('physical_self_care_desc')}
            icon={<Waves className="h-8 w-8" />}
            color="bg-blue-100"
            textColor="text-blue-600"
            tips={[
              { title: t('physical_tip_1_title'), content: t('physical_tip_1_content') },
              { title: t('physical_tip_2_title'), content: t('physical_tip_2_content') },
              { title: t('physical_tip_3_title'), content: t('physical_tip_3_content') },
              { title: t('physical_tip_4_title'), content: t('physical_tip_4_content') },
            ]}
          />
          
          {/* Mental Self-Care */}
          <SelfCareCategory 
            title={t('mental_self_care')}
            description={t('mental_self_care_desc')}
            icon={<Brain className="h-8 w-8" />}
            color="bg-purple-100"
            textColor="text-purple-600"
            tips={[
              { title: t('mental_tip_1_title'), content: t('mental_tip_1_content') },
              { title: t('mental_tip_2_title'), content: t('mental_tip_2_content') },
              { title: t('mental_tip_3_title'), content: t('mental_tip_3_content') },
              { title: t('mental_tip_4_title'), content: t('mental_tip_4_content') },
            ]}
          />
          
          {/* Emotional Self-Care */}
          <SelfCareCategory 
            title={t('emotional_self_care')}
            description={t('emotional_self_care_desc')}
            icon={<Heart className="h-8 w-8" />}
            color="bg-pink-100"
            textColor="text-pink-600"
            tips={[
              { title: t('emotional_tip_1_title'), content: t('emotional_tip_1_content') },
              { title: t('emotional_tip_2_title'), content: t('emotional_tip_2_content') },
              { title: t('emotional_tip_3_title'), content: t('emotional_tip_3_content') },
              { title: t('emotional_tip_4_title'), content: t('emotional_tip_4_content') },
            ]}
          />
          
          {/* Social Self-Care */}
          <SelfCareCategory 
            title={t('social_self_care')}
            description={t('social_self_care_desc')}
            icon={<Smile className="h-8 w-8" />}
            color="bg-green-100"
            textColor="text-green-600"
            tips={[
              { title: t('social_tip_1_title'), content: t('social_tip_1_content') },
              { title: t('social_tip_2_title'), content: t('social_tip_2_content') },
              { title: t('social_tip_3_title'), content: t('social_tip_3_content') },
              { title: t('social_tip_4_title'), content: t('social_tip_4_content') },
            ]}
          />
          
          {/* Spiritual Self-Care */}
          <SelfCareCategory 
            title={t('spiritual_self_care')}
            description={t('spiritual_self_care_desc')}
            icon={<Leaf className="h-8 w-8" />}
            color="bg-teal-100"
            textColor="text-teal-600"
            tips={[
              { title: t('spiritual_tip_1_title'), content: t('spiritual_tip_1_content') },
              { title: t('spiritual_tip_2_title'), content: t('spiritual_tip_2_content') },
              { title: t('spiritual_tip_3_title'), content: t('spiritual_tip_3_content') },
              { title: t('spiritual_tip_4_title'), content: t('spiritual_tip_4_content') },
            ]}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Helper Component for the info cards
const InfoCard = ({ 
  icon, 
  title, 
  description, 
  color, 
  textColor 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string;
  textColor: string; 
}) => (
  <Card className="p-6">
    <div className={`inline-flex items-center justify-center p-3 ${color} ${textColor} rounded-full mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </Card>
);

// Helper Component for self-care categories
const SelfCareCategory = ({ 
  title, 
  description, 
  icon, 
  color, 
  textColor, 
  tips 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  color: string;
  textColor: string;
  tips: { title: string; content: string }[]; 
}) => (
  <div className="mb-16">
    <div className="flex items-center gap-4 mb-6">
      <div className={`${color} ${textColor} p-3 rounded-full`}>
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tips.map((tip, index) => (
        <Card key={index} className="p-6">
          <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
          <Separator className="my-2" />
          <p className="text-muted-foreground">{tip.content}</p>
        </Card>
      ))}
    </div>
  </div>
);

export default SelfCareTips;
