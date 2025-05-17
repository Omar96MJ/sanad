
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface Test {
  id: string;
  name: string;
  icon: string;
}

interface TestQuestionsProps {
  selectedTest: string;
  tests: Test[];
  currentQuestion: number;
  questions: string[];
  onAnswer: (score: number) => void;
}

const TestQuestions: React.FC<TestQuestionsProps> = ({
  selectedTest,
  tests,
  currentQuestion,
  questions,
  onAnswer,
}) => {
  const { t } = useLanguage();

  if (currentQuestion >= questions.length) return null;

  const currentQ = questions[currentQuestion];

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{tests.find(t => t.id === selectedTest)?.name}</CardTitle>
        <CardDescription>
          {t('question')} {currentQuestion + 1} {t('of')} {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-6">{currentQ}</p>
        <div className="flex flex-col space-y-2">
          <Button variant="outline" onClick={() => onAnswer(0)}>{t('not_at_all')}</Button>
          <Button variant="outline" onClick={() => onAnswer(1)}>{t('several_days')}</Button>
          <Button variant="outline" onClick={() => onAnswer(2)}>{t('more_than_half_days')}</Button>
          <Button variant="outline" onClick={() => onAnswer(3)}>{t('nearly_every_day')}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestQuestions;
