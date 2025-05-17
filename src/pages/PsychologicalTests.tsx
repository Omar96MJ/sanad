
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from "sonner";
import TestSelection from '@/components/tests/TestSelection';
import TestQuestions from '@/components/tests/TestQuestions';
import TestResults from '@/components/tests/TestResults';

const PsychologicalTests = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [result, setResult] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Trigger animation after component mounts
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const tests = [
    { id: 'depression', name: t('depression_test'), icon: '😔' },
    { id: 'anxiety', name: t('anxiety_test'), icon: '😰' },
    { id: 'personality', name: t('personality_test'), icon: '🧠' },
    { id: 'adhd', name: t('adhd_test'), icon: '🔄' },
    { id: 'children', name: t('children_test'), icon: '👶' },
    { id: 'jealousy', name: t('jealousy_test'), icon: '😠' },
    { id: 'love', name: t('love_test'), icon: '❤️' },
    { id: 'passion', name: t('passion_test'), icon: '🔥' },
  ];

  const testQuestions = {
    depression: [
      t('depression_q1'),
      t('depression_q2'),
      t('depression_q3'),
      t('depression_q4'),
      t('depression_q5'),
    ],
    anxiety: [
      t('anxiety_q1'),
      t('anxiety_q2'),
      t('anxiety_q3'),
      t('anxiety_q4'),
      t('anxiety_q5'),
    ],
    personality: [
      t('personality_q1'),
      t('personality_q2'),
      t('personality_q3'),
      t('personality_q4'),
      t('personality_q5'),
    ],
    adhd: [
      t('adhd_q1'),
      t('adhd_q2'),
      t('adhd_q3'),
      t('adhd_q4'),
      t('adhd_q5'),
    ],
    children: [
      t('children_q1'),
      t('children_q2'),
      t('children_q3'),
      t('children_q4'),
      t('children_q5'),
    ],
    jealousy: [
      t('jealousy_q1'),
      t('jealousy_q2'),
      t('jealousy_q3'),
      t('jealousy_q4'),
      t('jealousy_q5'),
    ],
    love: [
      t('love_q1'),
      t('love_q2'),
      t('love_q3'),
      t('love_q4'),
      t('love_q5'),
    ],
    passion: [
      t('passion_q1'),
      t('passion_q2'),
      t('passion_q3'),
      t('passion_q4'),
      t('passion_q5'),
    ],
  };

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
    const max = finalAnswers.length * 4;
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

  const renderContent = () => {
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

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{t('psychological_tests')}</h1>
          <p className="text-muted-foreground">
            {t('take_test_description')}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PsychologicalTests;
