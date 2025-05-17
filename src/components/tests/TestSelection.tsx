
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface Test {
  id: string;
  name: string;
  icon: string;
}

interface TestSelectionProps {
  tests: Test[];
  selectedTest: string | null;
  onSelectTest: (testId: string) => void;
  onStartTest: () => void;
  onBack: () => void;
  testQuestions: Record<string, string[]>;
}

const TestSelection: React.FC<TestSelectionProps> = ({
  tests,
  selectedTest,
  onSelectTest,
  onStartTest,
  onBack,
  testQuestions,
}) => {
  const { t } = useLanguage();

  if (selectedTest) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{tests.find(t => t.id === selectedTest)?.name}</CardTitle>
          <CardDescription>
            {t('This test will help assess potential symptoms. Results are not a diagnosis.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            {t('The test consists of')} {testQuestions[selectedTest]?.length || 5} {t('questions and will take approximately')} {testQuestions[selectedTest]?.length || 5} {t('minutes to complete.')}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {t('Please answer each question honestly for the most accurate results.')}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>{t('Back')}</Button>
          <Button onClick={onStartTest}>{t('Start Test')}</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
      {tests.map((test) => (
        <Card key={test.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectTest(test.id)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{test.icon}</span> {test.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('Take this test to assess your')} {test.name.toLowerCase()}.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">{t('Select')}</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TestSelection;
