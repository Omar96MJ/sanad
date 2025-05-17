
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Book, BookOpen, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MentalHealthGuide = () => {
  const { language, t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container-custom py-12">
        <div className="max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">{t('mentalhealthguide')}</h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t('mentalhealthguidesubtitle')}
          </p>
          <Separator className="mb-8" />

          <section className="mb-12">
            <div className="flex items-center mb-6">
              <BookOpen className="h-8 w-8 mr-3 text-primary" />
              <h2 className="text-2xl font-semibold">{t('understandingmentalhealth')}</h2>
            </div>
            <p className="mb-4 text-muted-foreground">
              {t('mentalhealthintro')}
            </p>
            <p className="mb-6">
              {t('mentalhealthimportance')}
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>{t('anxietytitle')}</CardTitle>
                <CardDescription>{t('anxietydesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{t('anxietysymptom1')}</li>
                  <li>{t('anxietysymptom2')}</li>
                  <li>{t('anxietysymptom3')}</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('depressiontitle')}</CardTitle>
                <CardDescription>{t('depressiondesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{t('depressionsymptom1')}</li>
                  <li>{t('depressionsymptom2')}</li>
                  <li>{t('depressionsymptom3')}</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Book className="h-8 w-8 mr-3 text-primary" />
              <h2 className="text-2xl font-semibold">{t('selfcarepractices')}</h2>
            </div>
            <p className="mb-6">
              {t('selfcaredescription')}
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-medium mb-2">{t('physicalselfcare')}</h3>
                <p className="text-sm text-muted-foreground">{t('physicalselfcaredesc')}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-medium mb-2">{t('mentalselfcare')}</h3>
                <p className="text-sm text-muted-foreground">{t('mentalselfcaredesc')}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-medium mb-2">{t('socialselfcare')}</h3>
                <p className="text-sm text-muted-foreground">{t('socialselfcaredesc')}</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-6">
              <HelpCircle className="h-8 w-8 mr-3 text-primary" />
              <h2 className="text-2xl font-semibold">{t('whentoseekhelp')}</h2>
            </div>
            <p className="mb-4">
              {t('seekhelpdescription')}
            </p>
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <p className="mb-4 font-medium">{t('emergencywarning')}</p>
                <p className="text-muted-foreground">{t('emergencydescription')}</p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentalHealthGuide;
