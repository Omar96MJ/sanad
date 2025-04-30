
import React from 'react';
import { PsyToolkitTest } from '@/data/psyToolkitTests';
import TestCard from './TestCard';
import { useLanguage } from '@/hooks/useLanguage';

interface TestListProps {
  tests: PsyToolkitTest[];
  onSelectTest: (test: PsyToolkitTest) => void;
}

const TestList: React.FC<TestListProps> = ({ tests, onSelectTest }) => {
  const { t } = useLanguage();

  if (tests.length === 0) {
    return (
      <div className="col-span-full text-center py-8">
        <p>{t('no_tests_found')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tests.map((test) => (
        <TestCard key={test.id} test={test} onSelect={onSelectTest} />
      ))}
    </div>
  );
};

export default TestList;
