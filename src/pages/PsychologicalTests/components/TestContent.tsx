
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from "sonner";
import TestSelection from '@/components/tests/TestSelection';
import TestQuestions from '@/components/tests/TestQuestions';
import TestResults from '@/components/tests/TestResults';
import { useTestData } from '../hooks/useTestData';

const TestContent = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [result, setResult] = useState('');
  
  const { tests, testQuestions } = useTestData();

  const handleSelectTest = (testId: string) => {
    setSelectedTest(testId);
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult('');
  };

  const startTest = () => {
    if (!selectedTest) return;
    setTestStarted(true);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (selectedTest && currentQuestion < testQuestions[selectedTest as keyof typeof testQuestions].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    const sum = finalAnswers.reduce((a, b) => a + b, 0);
    const max = finalAnswers.length * 3;
    const percentage = (sum / max) * 100;

    let resultText = '';
    if (selectedTest === 'depression') {
      if (percentage < 25) resultText = t('depression_result_minimal');
      else if (percentage < 50) resultText = t('depression_result_mild');
      else if (percentage < 75) resultText = t('depression_result_moderate');
      else resultText = t('depression_result_severe');
    } else if (selectedTest === 'anxiety') {
      if (percentage < 25) resultText = t('anxiety_result_minimal');
      else if (percentage < 50) resultText = t('anxiety_result_mild');
      else if (percentage < 75) resultText = t('anxiety_result_moderate');
      else resultText = t('anxiety_result_severe');
    } else {
      resultText = t('your_score_is') + ` ${percentage.toFixed(1)}%. ` + t('consult_professional');
    }

    setResult(resultText);
    setTestCompleted(true);
    toast.success(t('test_completed'));
  };

  const restartTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult('');
  };

  if (selectedTest && testStarted && !testCompleted) {
    return (
      <TestQuestions 
        selectedTest={selectedTest}
        tests={tests}
        currentQuestion={currentQuestion}
        questions={testQuestions[selectedTest as keyof typeof testQuestions]}
        onAnswer={handleAnswer}
      />
    );
  }

  if (testCompleted) {
    return (
      <TestResults 
        selectedTest={selectedTest}
        tests={tests}
        result={result}
        onRestart={restartTest}
        onChooseAnother={() => setSelectedTest(null)}
      />
    );
  }

  return (
    <TestSelection 
      tests={tests}
      selectedTest={selectedTest}
      onSelectTest={handleSelectTest}
      onStartTest={startTest}
      onBack={() => setSelectedTest(null)}
      testQuestions={testQuestions}
    />
  );
};

export default TestContent;
