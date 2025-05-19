
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Phone, MessageSquare, LifeBuoy, HelpingHand } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/Footer';

const CrisisSupport = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container-custom py-12" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-red-100 text-red-600 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('crisis_support_title')}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('crisis_support_subtitle')}
            </p>
          </div>
          
          {/* Emergency Contact Section */}
          <Card className="p-6 mb-8 border border-red-200 bg-red-50">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4 text-red-800">
              <Phone className="h-10 w-10 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold">{t('emergency_contact')}</h2>
                <p className="text-base">{t('emergency_contact_desc')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <EmergencyNumberCard 
                number="911" 
                label={t('emergency_services')} 
                description={t('emergency_services_desc')}
              />
              <EmergencyNumberCard 
                number="988" 
                label={t('suicide_prevention')} 
                description={t('suicide_prevention_desc')}
              />
              <EmergencyNumberCard 
                number="211" 
                label={t('crisis_hotline')} 
                description={t('crisis_hotline_desc')}
              />
            </div>
          </Card>
          
          {/* Support Resources Section */}
          <h2 className="text-2xl font-bold mb-6">{t('support_resources')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <SupportResourceCard 
              icon={<MessageSquare className="h-6 w-6" />}
              title={t('text_support')}
              description={t('text_support_desc')}
              contactInfo={t('text_support_contact')}
            />
            <SupportResourceCard 
              icon={<LifeBuoy className="h-6 w-6" />}
              title={t('online_chat')}
              description={t('online_chat_desc')}
              contactInfo={t('online_chat_contact')}
            />
          </div>
          
          {/* Crisis Information Section */}
          <h2 className="text-2xl font-bold mb-6">{t('recognizing_crisis')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('warning_signs')}</h3>
              <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                <li>{t('warning_sign_1')}</li>
                <li>{t('warning_sign_2')}</li>
                <li>{t('warning_sign_3')}</li>
                <li>{t('warning_sign_4')}</li>
                <li>{t('warning_sign_5')}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('how_to_help')}</h3>
              <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                <li>{t('help_tip_1')}</li>
                <li>{t('help_tip_2')}</li>
                <li>{t('help_tip_3')}</li>
                <li>{t('help_tip_4')}</li>
                <li>{t('help_tip_5')}</li>
              </ul>
            </div>
          </div>
          
          {/* Resources Section */}
          <h2 className="text-2xl font-bold mb-6">{t('additional_resources')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ResourceCard 
              title={t('resource_1_title')}
              description={t('resource_1_desc')}
            />
            <ResourceCard 
              title={t('resource_2_title')}
              description={t('resource_2_desc')}
            />
            <ResourceCard 
              title={t('resource_3_title')}
              description={t('resource_3_desc')}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Helper components
const EmergencyNumberCard = ({ number, label, description }: { number: string; label: string; description: string }) => (
  <div className="bg-white p-4 rounded-lg border border-red-100 flex flex-col">
    <span className="text-2xl font-bold text-red-600">{number}</span>
    <span className="font-semibold">{label}</span>
    <span className="text-sm text-muted-foreground">{description}</span>
  </div>
);

const SupportResourceCard = ({ 
  icon, 
  title, 
  description, 
  contactInfo 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  contactInfo: string;
}) => (
  <Card className="p-6">
    <div className="flex items-center gap-3 mb-3">
      <div className="bg-primary/10 p-2 rounded-full text-primary">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-muted-foreground mb-3">{description}</p>
    <Separator className="my-3" />
    <div className="font-medium">{contactInfo}</div>
  </Card>
);

const ResourceCard = ({ title, description }: { title: string; description: string }) => (
  <Card className="p-6">
    <div className="flex items-center gap-2 mb-3">
      <HelpingHand className="h-5 w-5 text-primary" />
      <h3 className="font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Card>
);

export default CrisisSupport;
