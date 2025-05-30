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
  responseOptions: Array<{ text: string; score: number }>; // Received from TestContent with translated text
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

  // Basic check, though TestContent should ideally prevent rendering this component
  // if questionText or responseOptions are not ready.
  if (!questionText || !responseOptions || responseOptions.length === 0) {
    return <p>{t('loading_test') || 'Loading question...'}</p>;
  }

  return (
    <Card className="w-full max-w-lg animate-fade-in">
      <CardHeader>
        <CardTitle>{testName}</CardTitle>
        <CardDescription>
          {t('question')} {currentQuestionIndex + 1} {t('of')} {totalQuestions}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-6 min-h-[3em]">{questionText}</p> {/* Added min-height for layout consistency */}
        <div className="flex flex-col space-y-3"> {/* Increased space slightly */}
          {responseOptions.map((option) => (
            <Button
              key={`${option.score}-${option.text}`} // More unique key
              variant="outline"
              className="justify-start text-left py-3 px-4 whitespace-normal h-auto hover:bg-accent focus:bg-accent" // Improved styling for readability
              onClick={() => {
                // console.log("TestQuestions: Answered with score:", option.score); // Optional: for debugging
                onAnswer(option.score);
              }}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestQuestions;
