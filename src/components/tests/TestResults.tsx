// src/components/tests/TestResults.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface TestResultsProps {
  testName: string;
  result: string; // This is the translated result text
  onRestart: () => void;
  onChooseAnother: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({
  testName, // Correctly destructured
  result,
  onRestart,
  onChooseAnother,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="w-full max-w-lg animate-fade-in"> {/* Added a simple animation class example */}
      <CardHeader>
        <CardTitle>{t('test_results')}</CardTitle>
        <CardDescription>{testName}</CardDescription> {/* Use the testName prop directly */}
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4 whitespace-pre-line">{result}</p> {/* Allow newlines in result text */}
        <p className="text-sm text-muted-foreground mb-4">
          {t('test_disclaimer')}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3"> {/* Improved layout for buttons */}
        <Button variant="outline" onClick={onRestart} className="w-full sm:w-auto">
          {t('restart_test')}
        </Button>
        <Button onClick={onChooseAnother} className="w-full sm:w-auto">
          {t('choose_another_test')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestResults;
