// src/pages/PsychologicalTests/components/TestContent.tsx:
import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect for logging
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from "sonner";
import TestSelection from '@/components/tests/TestSelection'; 
import TestQuestions from '@/components/tests/TestQuestions'; 
import TestResults from '@/components/tests/TestResults';   
import { useTestData, PsychTest } from '../hooks/useTestData'; // Removed unused TestQuestion, ResponseOption imports here

const TestContent = () => {
  const { t } = useLanguage(); 
  const { tests } = useTestData(); 
  
  // DEBUG: Log if tests are loaded correctly from the hook
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
    // DEBUG: Log when this memo recalculates
    console.log("TestContent: Recalculating currentTestData. selectedTestId:", selectedTestId);
    const foundTest = tests.find(test => test.id === selectedTestId);
    console.log("TestContent: currentTestData resolved to:", foundTest ? foundTest.id : 'undefined');
    return foundTest;
  }, [selectedTestId, tests]);

  const handleSelectTest = (testId: string) => {
    console.log("TestContent: handleSelectTest called with ID:", testId); // DEBUG
    setSelectedTestId(testId);
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultText('');
  };

  const startTest = () => {
    console.log("TestContent: startTest called."); // DEBUG
    if (!currentTestData) {
      console.error("TestContent: startTest called but no currentTestData! selectedTestId might be wrong or tests not loaded. selectedTestId:", selectedTestId); // DEBUG
      return;
    }
    console.log("TestContent: Starting test - ", currentTestData.id); // DEBUG
    setTestStarted(true);
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleAnswer = (score: number) => {
    console.log("TestContent: handleAnswer called with score:", score); // DEBUG
    if (!currentTestData) {
      console.error("TestContent: handleAnswer called but no currentTestData!"); // DEBUG
      return;
    }
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestionIndex < currentTestData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("TestContent: All questions answered. Calculating result."); // DEBUG
      calculateResult(newAnswers, currentTestData);
    }
  };

  const calculateResult = (finalAnswers: number[], testData: PsychTest) => {
    const sum = finalAnswers.reduce((a, b) => a + b, 0);
    let calculatedResultKey = 'result_default_consult'; 
    console.log(`TestContent: Calculating result for ${testData.id}. Sum: ${sum}, Answers:`, finalAnswers); // DEBUG

    for (const threshold of testData.scoringThresholds) {
      if (sum <= threshold.upperBound) {
        calculatedResultKey = threshold.resultKey;
        break;
      }
    }
    console.log("TestContent: Result key:", calculatedResultKey, "Translated:", t(calculatedResultKey)); // DEBUG
    setResultText(t(calculatedResultKey));
    setTestCompleted(true);
    toast.success(t('test_completed_toast')); 
  };

  const restartTest = () => {
    console.log("TestContent: restartTest called."); // DEBUG
    if (!currentTestData) return; 
    // setTestStarted(true); // Keep them in the question view if restarting the same test
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultText('');
  };

  const chooseAnotherTest = () => {
    console.log("TestContent: chooseAnotherTest called."); // DEBUG
    setSelectedTestId(null); // This will hide details/questions and show TestSelection list
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
  
  // DEBUG: Log what view should be rendered
  useEffect(() => {
    console.log("TestContent RENDER CHECK: selectedTestId:", selectedTestId, "testStarted:", testStarted, "testCompleted:", testCompleted, "currentTestData:", currentTestData ? currentTestData.id : "none");
  }, [selectedTestId, testStarted, testCompleted, currentTestData]);


  if (currentTestData && testStarted && !testCompleted) {
    console.log("TestContent: Rendering TestQuestions for", currentTestData.id); // DEBUG
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
    console.log("TestContent: Rendering TestResults for", currentTestData.id); // DEBUG
    return (
      <TestResults
        testName={t(currentTestData.nameKey)}
        result={resultText}
        onRestart={restartTest}
        onChooseAnother={chooseAnotherTest}
      />
    );
  }

  console.log("TestContent: Rendering TestSelection."); // DEBUG
  return (
    <TestSelection
      tests={tests.map(test => ({
        id: test.id,
        name: t(test.nameKey),
        icon: test.icon,
        description: t(test.descriptionKey),
        // If you want questionCount in TestSelection's detail view, you'd add:
        // questionCount: test.questions.length, 
        // typicalDurationMinutes: Math.ceil(test.questions.length * 0.5) // Example duration
      }))}
      selectedTestId={selectedTestId}
      onSelectTest={handleSelectTest}
      onStartTest={startTest}
      onBack={chooseAnotherTest} // Pass chooseAnotherTest as onBack
    />
  );
};

export default TestContent;
