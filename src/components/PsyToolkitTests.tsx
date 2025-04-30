
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from "sonner";
import { psyToolkitTests, PsyToolkitTest } from '@/data/psyToolkitTests';
import TestSearchFilter from './psytoolkit/TestSearchFilter';
import TestList from './psytoolkit/TestList';
import TestViewer from './psytoolkit/TestViewer';

const PsyToolkitTests = () => {
  const { language } = useLanguage();
  const [activeTest, setActiveTest] = useState<PsyToolkitTest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const filteredTests = psyToolkitTests.filter(test => 
    (category === "all" || test.category === category) &&
    (test.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     test.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectTest = (test: PsyToolkitTest) => {
    setActiveTest(test);
    toast.info(t('loading_test'));
  };

  const handleBackToTests = () => {
    setActiveTest(null);
  };

  const { t } = useLanguage();

  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {!activeTest ? (
        <div className="space-y-6">
          <TestSearchFilter 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            category={category} 
            setCategory={setCategory}
          />
          <TestList 
            tests={filteredTests} 
            onSelectTest={handleSelectTest} 
          />
        </div>
      ) : (
        <TestViewer 
          test={activeTest} 
          onBack={handleBackToTests} 
        />
      )}
    </div>
  );
};

export default PsyToolkitTests;
