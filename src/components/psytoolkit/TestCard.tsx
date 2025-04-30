
import React from 'react';
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PsyToolkitTest } from '@/data/psyToolkitTests';
import { useLanguage } from '@/hooks/useLanguage';

interface TestCardProps {
  test: PsyToolkitTest;
  onSelect: (test: PsyToolkitTest) => void;
}

const TestCard: React.FC<TestCardProps> = ({ test, onSelect }) => {
  const { t, language } = useLanguage();

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{language === 'ar' ? t(test.id + '_name') || test.name : test.name}</CardTitle>
        <CardDescription>{language === 'ar' ? t(test.id + '_description') || test.description : test.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => onSelect(test)} className="w-full">{t('take_test')}</Button>
      </CardFooter>
    </Card>
  );
};

export default TestCard;
