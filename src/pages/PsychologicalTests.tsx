
import React, { useState } from 'react';
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

  const tests = [
    { id: 'depression', name: t('Depression Test'), icon: '😔' },
    { id: 'anxiety', name: t('Anxiety Test'), icon: '😰' },
    { id: 'personality', name: t('Personality Test'), icon: '🧠' },
    { id: 'adhd', name: t('ADHD Test'), icon: '🔄' },
    { id: 'children', name: t('Psychological State Test for Children'), icon: '👶' },
    { id: 'jealousy', name: t('Jealousy Test'), icon: '😠' },
    { id: 'love', name: t('Love Test'), icon: '❤️' },
    { id: 'passion', name: t('Passion Test'), icon: '🔥' },
  ];

  // Example questions for depression test (would need proper questions for each test)
  const testQuestions = {
    depression: [
      t('I feel sad or down most of the day'),
      t('I have lost interest in activities I used to enjoy'),
      t('I have trouble sleeping or sleep too much'),
      t('I feel tired or have little energy'),
      t('I have poor appetite or am overeating'),
    ],
    anxiety: [
      t('I feel nervous or anxious'),
      t('I worry too much about different things'),
      t('I have trouble relaxing'),
      t('I feel restless and have trouble sitting still'),
      t('I am easily annoyed or irritable'),
    ],
    personality: [
      t('I enjoy being the center of attention'),
      t('I prefer quiet, solitary activities'),
      t('I consider myself organized and detail-oriented'),
      t('I am comfortable in new social situations'),
      t('I am more practical than creative'),
    ],
    adhd: [
      t('I have difficulty maintaining attention'),
      t('I am easily distracted'),
      t('I struggle to follow through on tasks'),
      t('I frequently lose things necessary for tasks'),
      t('I often fidget or feel restless'),
    ],
    children: [
      t('The child has difficulty concentrating'),
      t('The child seems worried or anxious'),
      t('The child has frequent mood swings'),
      t('The child has trouble making friends'),
      t('The child has lost interest in activities they used to enjoy'),
    ],
    jealousy: [
      t('I often worry about my partner being unfaithful'),
      t('I check my partner\'s phone or social media'),
      t('I feel uncomfortable when my partner talks to others'),
      t('I get upset when my partner gives attention to others'),
      t('I often need reassurance from my partner'),
    ],
    love: [
      t('I think about this person constantly'),
      t('I feel happy when I\'m with this person'),
      t('I prioritize this person\'s needs over my own'),
      t('I can see a future with this person'),
      t('I accept this person\'s flaws'),
    ],
    passion: [
      t('I lose track of time when engaged in this activity'),
      t('I feel energized when doing this activity'),
      t('I constantly want to improve in this area'),
      t('I think about this activity even when not doing it'),
      t('I would do this activity even if I wasn\'t paid or recognized for it'),
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
      // Test completed
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    // Simple calculation (would need proper scoring for each test)
    const sum = finalAnswers.reduce((a, b) => a + b, 0);
    const max = finalAnswers.length * 4; // max possible score
    const percentage = (sum / max) * 100;

    let resultText = '';
    if (selectedTest === 'depression') {
      if (percentage < 25) resultText = t('Minimal or no depression');
      else if (percentage < 50) resultText = t('Mild depression');
      else if (percentage < 75) resultText = t('Moderate depression');
      else resultText = t('Severe depression');
    } else if (selectedTest === 'anxiety') {
      if (percentage < 25) resultText = t('Minimal or no anxiety');
      else if (percentage < 50) resultText = t('Mild anxiety');
      else if (percentage < 75) resultText = t('Moderate anxiety');
      else resultText = t('Severe anxiety');
    } else {
      // Generic result for other tests
      resultText = t('Your score is') + ` ${percentage.toFixed(1)}%. ` + t('Please consult with a professional for interpretation.');
    }

    setResult(resultText);
    setTestCompleted(true);
    toast.success(t('Test completed!'));
  };

  const restartTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult('');
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

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{t('Psychological Tests')}</h1>
          <p className="text-muted-foreground">
            {t('Take one of our psychological tests to learn more about yourself.')}
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
