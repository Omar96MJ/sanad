
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface Test {
  id: string;
  name: string;
  icon: string;
}

interface TestResultsProps {
  testName: string;
  result: string; // This is the translated result text
  onRestart: () => void;
  onChooseAnother: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({
  selectedTest,
  tests,
  result,
  onRestart,
  onChooseAnother,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{t('test_results')}</CardTitle>
        <CardDescription>{tests.find(t => t.id === selectedTest)?.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">{result}</p>
        <p className="text-sm text-muted-foreground mb-4">
          {t('test_disclaimer')}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onRestart}>{t('restart_test')}</Button>
        <Button onClick={onChooseAnother}>{t('choose_another_test')}</Button>
      </CardFooter>
    </Card>
  );
};

export default TestResults;
