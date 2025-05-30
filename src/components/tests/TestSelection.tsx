// src/components/tests/TestSelection.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface TestDisplayInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  // If you added questionCount/typicalDurationMinutes to the map in TestContent, define them here:
  // questionCount?: number;
  // typicalDurationMinutes?: number;
}

interface TestSelectionProps {
  tests: TestDisplayInfo[];
  selectedTestId: string | null;
  onSelectTest: (testId: string) => void;
  onStartTest: () => void;
  onBack?: () => void; 
}

const TestSelection: React.FC<TestSelectionProps> = ({
  tests,
  selectedTestId,
  onSelectTest,
  onStartTest,
  onBack,
}) => {
  const { t } = useLanguage();
  // DEBUG: Log props received by TestSelection
  console.log("TestSelection PROPS: selectedTestId:", selectedTestId, "Number of tests:", tests.length, "onBack provided:", !!onBack);

  const currentSelectedTest = tests.find(test => test.id === selectedTestId);
  // DEBUG: Log the found selected test
  if (selectedTestId) {
    console.log("TestSelection: currentSelectedTest object:", currentSelectedTest);
  }


  if (selectedTestId && currentSelectedTest) {
    // This is the "Selected Test Detail" view
    console.log("TestSelection: Rendering DETAILED view for test:", currentSelectedTest.id); // DEBUG
    return (
      <Card className="w-full max-w-lg animate-fade-in">
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
            To display question count & duration here, you'd need TestContent to pass
            'questionCount' and 'typicalDurationMinutes' in the 'tests' prop's objects.
            Example:
            {currentSelectedTest.questionCount && (
              <p className="mb-1">
                {t('test_consists_of')} {currentSelectedTest.questionCount}{' '}
                {t('questions_and_will_take')} {currentSelectedTest.typicalDurationMinutes || 'a few'}{' '}
                {t('minutes_to_complete')}
              </p>
            )}
          */}
          <p className="text-sm text-muted-foreground mt-4">
            {t('answer_honestly')}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
          {onBack && (
            <Button variant="outline" onClick={() => {
                console.log("TestSelection: Back button clicked"); // DEBUG
                onBack();
            }} className="w-full sm:w-auto">
              {t('back_to_tests')}
            </Button>
          )}
          <Button onClick={() => {
              console.log("TestSelection: Start Test button clicked from detail view"); // DEBUG
              onStartTest();
          }} className="w-full sm:w-auto">
            {t('start_test')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // This is the "Test List" view
  console.log("TestSelection: Rendering LIST view."); // DEBUG
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl animate-fade-in">
      {tests.map((test) => (
        <Card
          key={test.id}
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out flex flex-col"
          onClick={() => {
            console.log("TestSelection: Card (list item) Clicked - ID:", test.id); // DEBUG
            onSelectTest(test.id);
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-start gap-3">
              <span className="text-3xl mt-1">{test.icon}</span>
              <span className="text-xl font-semibold">{test.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow pb-4">
            <p className="text-sm text-muted-foreground">{test.description}</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-primary hover:text-primary/90" tabIndex={-1}> 
              {t('select')}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TestSelection;
