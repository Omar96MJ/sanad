
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
            {t('take_this_test')} {tests.find(t => t.id === selectedTest)?.name.toLowerCase()}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            {t('test_consists_of')} {testQuestions[selectedTest]?.length || 5} {t('questions_and_will_take')} {testQuestions[selectedTest]?.length || 5} {t('minutes_to_complete')}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {t('answer_honestly')}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>{t('back')}</Button>
          <Button onClick={onStartTest}>{t('start_test')}</Button>
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
            <p>{t('take_this_test')} {test.name.toLowerCase()}.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">{t('select')}</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TestSelection;
