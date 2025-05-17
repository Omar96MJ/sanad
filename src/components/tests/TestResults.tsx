
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface Test {
  id: string;
  name: string;
}

interface TestResultsProps {
  selectedTest: string | null;
  tests: Test[];
  result: string;
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
        <CardTitle>{t('Test Results')}</CardTitle>
        <CardDescription>{tests.find(t => t.id === selectedTest)?.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">{result}</p>
        <p className="text-sm text-muted-foreground mb-4">
          {t('This test is for educational purposes only and should not be used for self-diagnosis. Please consult with a mental health professional for proper diagnosis and treatment.')}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onRestart}>{t('Restart Test')}</Button>
        <Button onClick={onChooseAnother}>{t('Choose Another Test')}</Button>
      </CardFooter>
    </Card>
  );
};

export default TestResults;
