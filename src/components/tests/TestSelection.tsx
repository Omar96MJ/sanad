// src/components/tests/TestSelection.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

// This interface now reflects what TestContent provides for the list
interface TestDisplayInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  // To display question count/duration here, TestContent would need to pass it.
  // For example, add:
  // questionCount?: number;
  // typicalDurationMinutes?: number;
}

interface TestSelectionProps {
  tests: TestDisplayInfo[]; // Updated to use TestDisplayInfo
  selectedTestId: string | null; // Renamed from selectedTest for clarity
  onSelectTest: (testId: string) => void;
  onStartTest: () => void;
  onBack?: () => void; // Optional: TestContent's chooseAnotherTest can be passed as onBack
}

const TestSelection: React.FC<TestSelectionProps> = ({
  tests,
  selectedTestId,
  onSelectTest,
  onStartTest,
  onBack, // This will be chooseAnotherTest from TestContent if passed
}) => {
  const { t } = useLanguage();

  const currentSelectedTest = tests.find(test => test.id === selectedTestId);

  if (selectedTestId && currentSelectedTest) {
    return (
      <Card className="w-full max-w-lg animate-fade-in"> {/* Added a simple animation class example */}
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{currentSelectedTest.icon}</span>
            {currentSelectedTest.name}
          </CardTitle>
          <CardDescription>
            {currentSelectedTest.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/*
            To display question count & duration here, the 'TestDisplayInfo' interface and
            the 'tests' prop from TestContent would need to include 'questionCount'
            and 'typicalDurationMinutes'. For example:
            <p className="mb-1">
              {t('test_consists_of')} {currentSelectedTest.questionCount || 'N/A'}{' '}
              {t('questions_and_will_take')} {currentSelectedTest.typicalDurationMinutes || 'a few'}{' '}
              {t('minutes_to_complete')}
            </p>
          */}
          <p className="text-sm text-muted-foreground mt-4">
            {t('answer_honestly')}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
          {onBack && ( // Only show Back button if onBack prop is provided
            <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
              {t('back_to_tests')} {/* Or a more generic 'back' key */}
            </Button>
          )}
          <Button onClick={onStartTest} className="w-full sm:w-auto">
            {t('start_test')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl animate-fade-in">
      {tests.map((test) => (
        <Card
          key={test.id}
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out flex flex-col" // Added flex for consistent footer
          onClick={() => {
            console.log("TestSelection: Card Clicked - ID:", test.id); // DEBUG: Keep for testing
            onSelectTest(test.id);
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-start gap-3"> {/* items-start for better icon align */}
              <span className="text-3xl mt-1">{test.icon}</span>
              <span className="text-xl font-semibold">{test.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow pb-4">
            <p className="text-sm text-muted-foreground">{test.description}</p>
          </CardContent>
          <CardFooter>
            {/* The entire card is clickable, this button is more of a visual cue or can be removed */}
            <Button variant="ghost" className="w-full text-primary hover:text-primary/90" tabIndex={-1}> 
              {t('select')} {/* Or "View Details" / "Prepare Test" */}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TestSelection;
