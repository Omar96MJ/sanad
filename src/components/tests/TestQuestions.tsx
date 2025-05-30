// src/components/tests/TestQuestions.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface TestQuestionsProps {
  testName: string;
  currentQuestionIndex: number;
  questionText: string;
  totalQuestions: number;
  responseOptions: Array<{ text: string; score: number }>;
  onAnswer: (score: number) => void;
}

const TestQuestions: React.FC<TestQuestionsProps> = ({
  testName,
  currentQuestionIndex,
  questionText,
  totalQuestions,
  responseOptions,
  onAnswer,
}) => {
  const { t } = useLanguage();

  if (!questionText || responseOptions.length === 0) {
    // Or some other loading/error state, though TestContent should prevent this
    return <p>Error: Question data missing.</p>;
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{testName}</CardTitle>
        <CardDescription>
          {t('question')} {currentQuestionIndex + 1} {t('of')} {totalQuestions}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-6">{questionText}</p>
        <div className="flex flex-col space-y-2">
          {responseOptions.map((option) => (
            <Button
              key={option.score + option.text} // More robust key
              variant="outline"
              onClick={() => {
                console.log("TestQuestions: Answered with score:", option.score); // DEBUG
                onAnswer(option.score);
              }}
            >
              {option.text} {/* Use the translated text from the prop */}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestQuestions;
