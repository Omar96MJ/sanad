
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  // Sample PsyToolkit tests - these would typically come from an API
  const psyToolkitTests: PsyToolkitTest[] = [
    {
      id: "stroop",
      name: "Stroop Test",
      description: "The Stroop test measures your ability to focus on relevant information and ignore irrelevant information.",
      embedUrl: "https://www.psytoolkit.org/embed/?test=stroop",
      category: "cognitive"
    },
    {
      id: "memory",
      name: "Visual Memory Test",
      description: "Test your visual memory capacity and recall abilities.",
      embedUrl: "https://www.psytoolkit.org/embed/?test=memory",
      category: "cognitive"
    },
    {
      id: "reaction",
      name: "Reaction Time Test",
      description: "Measure your reaction time to visual stimuli.",
      embedUrl: "https://www.psytoolkit.org/embed/?test=RT",
      category: "cognitive"
    },
    {
      id: "bigfive",
      name: "Big Five Personality Test",
      description: "Assess your personality across five major dimensions: openness, conscientiousness, extraversion, agreeableness, and neuroticism.",
      embedUrl: "https://www.psytoolkit.org/embed/?survey=big5",
      category: "personality"
    },
    {
      id: "anxiety",
      name: "Anxiety Assessment",
      description: "Evaluate your current anxiety levels with this standardized assessment.",
      embedUrl: "https://www.psytoolkit.org/embed/?survey=anxiety",
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
  };

  const handleBackToTests = () => {
    setActiveTest(null);
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
                  <Button onClick={() => handleSelectTest(test)}>{t('take_test')}</Button>
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
            <CardContent className="p-0 h-[600px]">
              <iframe
                src={activeTest.embedUrl}
                title={activeTest.name}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </CardContent>
          </Card>
          
          <div className="text-sm text-muted-foreground">
            <p>{t('psytoolkit_attribution')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PsyToolkitTests;
