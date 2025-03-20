
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

interface PsyToolkitTest {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  category: string;
}

const PsyToolkitTests = () => {
  const { t } = useLanguage();
  const [activeTest, setActiveTest] = useState<PsyToolkitTest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  // PsyToolkit tests with correct embed URLs
  const psyToolkitTests: PsyToolkitTest[] = [
    {
      id: "stroop",
      name: "Stroop Test",
      description: "The Stroop test measures your ability to focus on relevant information and ignore irrelevant information.",
      embedUrl: "https://www.psytoolkit.org/cgi-bin/psy2.8.1/survey?s=vxHEA6",
      category: "cognitive"
    },
    {
      id: "memory",
      name: "Visual Memory Test",
      description: "Test your visual memory capacity and recall abilities.",
      embedUrl: "https://www.psytoolkit.org/cgi-bin/psy2.8.1/survey?s=C6Qv9s",
      category: "cognitive"
    },
    {
      id: "reaction",
      name: "Reaction Time Test",
      description: "Measure your reaction time to visual stimuli.",
      embedUrl: "https://www.psytoolkit.org/cgi-bin/psy2.8.1/survey?s=QXajxJ",
      category: "cognitive"
    },
    {
      id: "bigfive",
      name: "Big Five Personality Test",
      description: "Assess your personality across five major dimensions: openness, conscientiousness, extraversion, agreeableness, and neuroticism.",
      embedUrl: "https://www.psytoolkit.org/cgi-bin/psy2.8.1/survey?s=TPFK8d",
      category: "personality"
    },
    {
      id: "anxiety",
      name: "Anxiety Assessment",
      description: "Evaluate your current anxiety levels with this standardized assessment.",
      embedUrl: "https://www.psytoolkit.org/cgi-bin/psy2.8.1/survey?s=LRNuAP",
      category: "clinical"
    },
    {
      id: "depression",
      name: "Depression Questionnaire (PHQ-9)",
      description: "A standardized screening tool for depression symptoms.",
      embedUrl: "https://www.psytoolkit.org/cgi-bin/psy2.8.1/survey?s=Z9kXE7",
      category: "clinical"
    },
    {
      id: "stress",
      name: "Perceived Stress Scale",
      description: "Measure your perception of stress in your life.",
      embedUrl: "https://www.psytoolkit.org/cgi-bin/psy2.8.1/survey?s=8SrFGQ",
      category: "clinical"
    }
  ];

  const filteredTests = psyToolkitTests.filter(test => 
    (category === "all" || test.category === category) &&
    (test.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     test.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectTest = (test: PsyToolkitTest) => {
    setActiveTest(test);
    setIframeLoading(true);
    toast.info(t('loading_test'));
  };

  const handleBackToTests = () => {
    setActiveTest(null);
    setIframeLoading(false);
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
    toast.success(t('test_loaded'));
  };

  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {!activeTest ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Input
              placeholder={t('search_tests')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Tabs defaultValue="all" value={category} onValueChange={setCategory}>
              <TabsList>
                <TabsTrigger value="all">{t('all_tests')}</TabsTrigger>
                <TabsTrigger value="cognitive">{t('cognitive')}</TabsTrigger>
                <TabsTrigger value="personality">{t('personality')}</TabsTrigger>
                <TabsTrigger value="clinical">{t('clinical')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map((test) => (
              <Card key={test.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{test.name}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => handleSelectTest(test)} className="w-full">{t('take_test')}</Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredTests.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p>{t('no_tests_found')}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{activeTest.name}</h2>
            <Button variant="outline" onClick={handleBackToTests}>{t('back_to_tests')}</Button>
          </div>
          
          <Card>
            <CardContent className="p-0 h-[600px] relative">
              {iframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p>{t('loading_test')}</p>
                  </div>
                </div>
              )}
              <iframe
                src={activeTest.embedUrl}
                title={activeTest.name}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleIframeLoad}
              ></iframe>
            </CardContent>
          </Card>
          
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <p>{t('psytoolkit_attribution')}</p>
            <a 
              href="https://www.psytoolkit.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center hover:underline"
            >
              PsyToolkit <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PsyToolkitTests;
