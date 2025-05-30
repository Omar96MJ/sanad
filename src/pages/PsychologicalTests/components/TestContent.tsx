import React, { useState, useMemo } from 'react';
// Removed useNavigate as it wasn't used in the provided snippet for core logic
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from "sonner";
import TestSelection from '@/components/tests/TestSelection'; // Assuming this component is adapted
import TestQuestions from '@/components/tests/TestQuestions'; // Assuming this component is adapted
import TestResults from '@/components/tests/TestResults';   // Assuming this component is adapted
import { useTestData, PsychTest, TestQuestion, ResponseOption } from '../hooks/useTestData';

const TestContent = () => {
  const { t } = useLanguage(); // Primary 't' for this component's own text
  const { tests } = useTestData(); // Get all test definitions

  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [resultText, setResultText] = useState('');

  // Memoize the currently selected test data to avoid re-calculating
  const currentTestData: PsychTest | undefined = useMemo(() => {
    return tests.find(test => test.id === selectedTestId);
  }, [selectedTestId, tests]);

  const handleSelectTest = (testId: string) => {
    setSelectedTestId(testId);
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultText('');
  };

  const startTest = () => {
    if (!currentTestData) return;
    setTestStarted(true);
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleAnswer = (score: number) => {
    if (!currentTestData) return;
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestionIndex < currentTestData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult(newAnswers, currentTestData);
    }
  };

  const calculateResult = (finalAnswers: number[], testData: PsychTest) => {
    const sum = finalAnswers.reduce((a, b) => a + b, 0);
    let calculatedResultKey = 'result_default_consult'; // Fallback translation key

    for (const threshold of testData.scoringThresholds) {
      if (sum <= threshold.upperBound) {
        calculatedResultKey = threshold.resultKey;
        break;
      }
    }
    setResultText(t(calculatedResultKey));
    setTestCompleted(true);
    toast.success(t('test_completed_toast')); // e.g., "Test completed!"
  };

  const restartTest = () => {
    if (!currentTestData) return; // Should ideally not happen if test was started
    setTestStarted(true); // Or false if you want them to see the start button again
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultText('');
     // If you want to go back to selection on restart, uncomment next line
    // setSelectedTestId(null);
  };

  const chooseAnotherTest = () => {
    setSelectedTestId(null);
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultText('');
  };

  // Prepare props for TestQuestions component
  const questionsForComponent: string[] | undefined = useMemo(() =>
    currentTestData?.questions.map(q => t(q.textKey)),
    [currentTestData, t]
  );

  const responseOptionsForComponent: { text: string; score: number }[] | undefined = useMemo(() =>
    currentTestData?.responseOptions.map(opt => ({ ...opt, text: t(opt.textKey) })),
    [currentTestData, t]
  );

  if (currentTestData && testStarted && !testCompleted) {
    return (
      <TestQuestions
        testName={t(currentTestData.nameKey)}
        currentQuestionIndex={currentQuestionIndex}
        questionText={questionsForComponent ? questionsForComponent[currentQuestionIndex] : ''}
        totalQuestions={currentTestData.questions.length}
        responseOptions={responseOptionsForComponent || []}
        onAnswer={handleAnswer}
      />
    );
  }

  if (testCompleted && currentTestData) {
    return (
      <TestResults
        testName={t(currentTestData.nameKey)}
        result={resultText}
        onRestart={restartTest}
        onChooseAnother={chooseAnotherTest}
      />
    );
  }

  return (
    <TestSelection
      tests={tests.map(test => ({
        id: test.id,
        name: t(test.nameKey),
        icon: test.icon,
        description: t(test.descriptionKey),
      }))}
      selectedTestId={selectedTestId}
      onSelectTest={handleSelectTest}
      onStartTest={startTest}
      // onBack is not defined in the original, so removed unless TestSelection uses it
      // testQuestions is not needed by TestSelection directly with this model
    />
  );
};

export default TestContent;
