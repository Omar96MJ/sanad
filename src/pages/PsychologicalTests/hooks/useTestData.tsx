
import { useLanguage } from '@/hooks/useLanguage';

export const useTestData = () => {
  const { t } = useLanguage();
  
  const tests = [
    { id: 'depression', name: t('depression_test'), icon: '😔' },
    { id: 'anxiety', name: t('anxiety_test'), icon: '😰' },
    { id: 'personality', name: t('personality_test'), icon: '🧠' },
    { id: 'adhd', name: t('adhd_test'), icon: '🔄' },
    { id: 'children', name: t('children_test'), icon: '👶' },
    { id: 'jealousy', name: t('jealousy_test'), icon: '😠' },
    { id: 'love', name: t('love_test'), icon: '❤️' },
    { id: 'passion', name: t('passion_test'), icon: '🔥' },
  ];

  const testQuestions = {
    depression: [
      t('depression_q1'),
      t('depression_q2'),
      t('depression_q3'),
      t('depression_q4'),
      t('depression_q5'),
    ],
    anxiety: [
      t('anxiety_q1'),
      t('anxiety_q2'),
      t('anxiety_q3'),
      t('anxiety_q4'),
      t('anxiety_q5'),
    ],
    personality: [
      t('personality_q1'),
      t('personality_q2'),
      t('personality_q3'),
      t('personality_q4'),
      t('personality_q5'),
    ],
    adhd: [
      t('adhd_q1'),
      t('adhd_q2'),
      t('adhd_q3'),
      t('adhd_q4'),
      t('adhd_q5'),
    ],
    children: [
      t('children_q1'),
      t('children_q2'),
      t('children_q3'),
      t('children_q4'),
      t('children_q5'),
    ],
    jealousy: [
      t('jealousy_q1'),
      t('jealousy_q2'),
      t('jealousy_q3'),
      t('jealousy_q4'),
      t('jealousy_q5'),
    ],
    love: [
      t('love_q1'),
      t('love_q2'),
      t('love_q3'),
      t('love_q4'),
      t('love_q5'),
    ],
    passion: [
      t('passion_q1'),
      t('passion_q2'),
      t('passion_q3'),
      t('passion_q4'),
      t('passion_q5'),
    ],
  };

  return { tests, testQuestions };
};
