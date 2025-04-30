
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguage';

interface TestSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: string;
  setCategory: (category: string) => void;
}

const TestSearchFilter: React.FC<TestSearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
  category,
  setCategory
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <Input
        placeholder={t('search_tests')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-xs"
      />
      <Tabs defaultValue="all" value={category} onValueChange={setCategory}>
        <TabsList>
          <TabsTrigger value="all">{t('all_tests')}</TabsTrigger>
          <TabsTrigger value="cognitive">{t('cognitive')}</TabsTrigger>
          <TabsTrigger value="personality">{t('personality')}</TabsTrigger>
          <TabsTrigger value="clinical">{t('clinical')}</TabsTrigger>
          <TabsTrigger value="wellbeing">{t('wellbeing')}</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TestSearchFilter;
