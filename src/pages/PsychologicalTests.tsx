
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

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

  const renderTestSelection = () => {
    if (selectedTest && (testStarted || testCompleted)) return null;

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
              {t('The test consists of')} {testQuestions[selectedTest as keyof typeof testQuestions]?.length || 5} {t('questions and will take approximately')} {testQuestions[selectedTest as keyof typeof testQuestions]?.length || 5} {t('minutes to complete.')}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {t('Please answer each question honestly for the most accurate results.')}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedTest(null)}>{t('Back')}</Button>
            <Button onClick={startTest}>{t('Start Test')}</Button>
          </CardFooter>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        {tests.map((test) => (
          <Card key={test.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSelectTest(test.id)}>
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

  const renderQuestions = () => {
    if (!selectedTest || !testStarted || testCompleted) return null;

    const questions = testQuestions[selectedTest as keyof typeof testQuestions];
    if (!questions || currentQuestion >= questions.length) return null;

    const currentQ = questions[currentQuestion];

    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{tests.find(t => t.id === selectedTest)?.name}</CardTitle>
          <CardDescription>
            {t('Question')} {currentQuestion + 1} {t('of')} {questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6">{currentQ}</p>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" onClick={() => handleAnswer(0)}>{t('Not at all')}</Button>
            <Button variant="outline" onClick={() => handleAnswer(1)}>{t('Several days')}</Button>
            <Button variant="outline" onClick={() => handleAnswer(2)}>{t('More than half the days')}</Button>
            <Button variant="outline" onClick={() => handleAnswer(3)}>{t('Nearly every day')}</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderResult = () => {
    if (!testCompleted) return null;

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
          <Button variant="outline" onClick={restartTest}>{t('Restart Test')}</Button>
          <Button onClick={() => setSelectedTest(null)}>{t('Choose Another Test')}</Button>
        </CardFooter>
      </Card>
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
          {renderTestSelection()}
          {renderQuestions()}
          {renderResult()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PsychologicalTests;
