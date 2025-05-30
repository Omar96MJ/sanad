import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from "sonner";
import TestSelection from '@/components/tests/TestSelection';
import TestQuestions from '@/components/tests/TestQuestions';
import TestResults from '@/components/tests/TestResults';
import { useTestData, PsychTest } from '../hooks/useTestData'; // TestQuestion, ResponseOption not directly needed here

const TestContent = () => {
  const { t } = useLanguage();
  const { tests } = useTestData();

  useEffect(() => {
    console.log("TestContent mounted. Tests from useTestData:", tests);
  }, [tests]);

  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [resultText, setResultText] = useState('');

  const currentTestData: PsychTest | undefined = useMemo(() => {
    console.log("TestContent: Recalculating currentTestData. selectedTestId:", selectedTestId);
    const foundTest = tests.find(test => test.id === selectedTestId);
    console.log("TestContent: currentTestData resolved to:", foundTest ? foundTest.id : 'undefined');
    return foundTest;
  }, [selectedTestId, tests]);

  const handleSelectTest = (testId: string) => {
    console.log("TestContent: handleSelectTest called with ID:", testId);
    setSelectedTestId(testId);
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultText('');
  };

  const startTest = () => {
    console.log("TestContent: startTest called.");
    if (!currentTestData) {
      console.error("TestContent: startTest called but no currentTestData! selectedTestId:", selectedTestId);
      return;
    }
    console.log("TestContent: Starting test - ", currentTestData.id);
    setTestStarted(true);
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleAnswer = (originalScore: number) => { // Renamed to originalScore for clarity
    console.log("TestContent: handleAnswer called with original score:", originalScore);
    if (!currentTestData || !currentTestData.questions[currentQuestionIndex]) {
      console.error("TestContent: handleAnswer called but no currentTestData or question!");
      return;
    }

    const currentQuestionData = currentTestData.questions[currentQuestionIndex];
    let scoreToStore = originalScore;

    if (currentQuestionData.reverseScored) {
      // Assuming responseOptions scores are 0-indexed (e.g., 0, 1, 2, 3, 4 for a 5-point scale)
      const maxScoreValue = currentTestData.responseOptions.length - 1;
      scoreToStore = maxScoreValue - originalScore;
      console.log(`TestContent: Question ${currentQuestionData.id} reverse scored. Original: ${originalScore}, Stored: ${scoreToStore}`);
    }

    const newAnswers = [...answers, scoreToStore];
    setAnswers(newAnswers);

    if (currentQuestionIndex < currentTestData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("TestContent: All questions answered. Calculating result.");
      calculateResult(newAnswers, currentTestData);
    }
  };

  const calculateResult = (finalAnswers: number[], testData: PsychTest) => {
    const sum = finalAnswers.reduce((a, b) => a + b, 0);
    let calculatedResultKey = 'result_default_consult';
    console.log(`TestContent: Calculating result for ${testData.id}. Sum of adjusted scores: ${sum}, Answers:`, finalAnswers);

    // Ensure thresholds are sorted by upperBound if not already guaranteed
    const sortedThresholds = [...testData.scoringThresholds].sort((a,b) => a.upperBound - b.upperBound);

    for (const threshold of sortedThresholds) {
      if (sum <= threshold.upperBound) {
        calculatedResultKey = threshold.resultKey;
        break;
      }
    }
    console.log("TestContent: Result key:", calculatedResultKey, "Translated:", t(calculatedResultKey));
    setResultText(t(calculatedResultKey));
    setTestCompleted(true);
    toast.success(t('test_completed_toast'));
  };

  const restartTest = () => {
    console.log("TestContent: restartTest called.");
    if (!currentTestData) return;
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultText('');
    // Keep testStarted true to go back to the first question
    setTestStarted(true); 
  };

  const chooseAnotherTest = () => {
    console.log("TestContent: chooseAnotherTest called.");
    setSelectedTestId(null);
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultText('');
  };

  const questionsForComponent: string[] | undefined = useMemo(() =>
    currentTestData?.questions.map(q => t(q.textKey)),
    [currentTestData, t]
  );

  const responseOptionsForComponent: { text: string; score: number }[] | undefined = useMemo(() =>
    currentTestData?.responseOptions.map(opt => ({ ...opt, text: t(opt.textKey) })),
    [currentTestData, t]
  );
  
  useEffect(() => {
    console.log("TestContent RENDER CHECK: selectedTestId:", selectedTestId, "testStarted:", testStarted, "testCompleted:", testCompleted, "currentTestData:", currentTestData ? currentTestData.id : "none");
  }, [selectedTestId, testStarted, testCompleted, currentTestData]);


  if (currentTestData && testStarted && !testCompleted) {
    console.log("TestContent: Rendering TestQuestions for", currentTestData.id);
    const currentQText = questionsForComponent ? questionsForComponent[currentQuestionIndex] : '';
    if (currentQText === undefined) { // Additional safety check
        console.error("TestContent: currentQuestionText is undefined before rendering TestQuestions!");
        return <p>{t('test_load_error') || 'Error loading question data.'}</p>; 
    }
    return (
      <TestQuestions
        testName={t(currentTestData.nameKey)}
        currentQuestionIndex={currentQuestionIndex}
        // Pass the specific question data for more robust handling in TestQuestions if needed in future
        // currentQuestionFullData={currentTestData.questions[currentQuestionIndex]} 
        questionText={currentQText}
        totalQuestions={currentTestData.questions.length}
        responseOptions={responseOptionsForComponent || []}
        onAnswer={handleAnswer}
      />
    );
  }

  if (testCompleted && currentTestData) {
    console.log("TestContent: Rendering TestResults for", currentTestData.id);
    return (
      <TestResults
        testName={t(currentTestData.nameKey)}
        result={resultText}
        onRestart={restartTest}
        onChooseAnother={chooseAnotherTest}
      />
    );
  }

  console.log("TestContent: Rendering TestSelection.");
  return (
    <TestSelection
      tests={tests.map(test => ({
        id: test.id,
        name: t(test.nameKey),
        icon: test.icon,
        description: t(test.descriptionKey),
        // Example for passing question count and duration for the detail view in TestSelection
        // questionCount: test.questions.length,
        // typicalDurationMinutes: Math.ceil(test.questions.length * 0.5) 
      }))}
      selectedTestId={selectedTestId}
      onSelectTest={handleSelectTest}
      onStartTest={startTest}
      onBack={chooseAnotherTest} 
    />
  );
};

export default TestContent;
