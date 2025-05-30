import { useLanguage } from '@/hooks/useLanguage';

// Define the structure for a response option
export interface ResponseOption {
  textKey: string; // Translation key for the option's text
  score: number;
}

// Define the structure for a test question
export interface TestQuestion {
  id: string; // Unique ID for the question (e.g., 'phq9_q1')
  textKey: string; // Translation key for the question text
}

// Define the structure for scoring thresholds
export interface ScoringThreshold {
  upperBound: number;
  resultKey: string; // Translation key for the result text (e.g., 'phq9_result_mild')
}

// Define the structure for a psychological test
export interface PsychTest {
  id: string; // e.g., 'phq9', 'gad7'
  nameKey: string; // Translation key for the test name
  icon: string; // Emoji or icon representation
  descriptionKey: string; // Translation key for a brief description
  questions: TestQuestion[];
  responseOptions: ResponseOption[];
  scoringThresholds: ScoringThreshold[]; // Ordered by upper bound
}

export const useTestData = () => {
  const { t } = useLanguage(); // Assuming t function is available for translations

  // Common response options for PHQ-9 and GAD-7
  const commonLikertOptions: ResponseOption[] = [
    { textKey: 'option_not_at_all', score: 0 },
    { textKey: 'option_several_days', score: 1 },
    { textKey: 'option_more_than_half_days', score: 2 },
    { textKey: 'option_nearly_every_day', score: 3 },
  ];

  const tests: PsychTest[] = [
    {
      id: 'phq9',
      nameKey: 'phq9_test_name', // e.g., "PHQ-9 Depression Test"
      icon: '📝',
      descriptionKey: 'phq9_description', // e.g., "Screens for symptoms of depression."
      questions: [
        { id: 'phq9_q1', textKey: 'phq9_q1_text' }, // "Little interest or pleasure in doing things"
        { id: 'phq9_q2', textKey: 'phq9_q2_text' }, // "Feeling down, depressed, or hopeless"
        { id: 'phq9_q3', textKey: 'phq9_q3_text' }, // "Trouble falling or staying asleep, or sleeping too much"
        { id: 'phq9_q4', textKey: 'phq9_q4_text' }, // "Feeling tired or having little energy"
        { id: 'phq9_q5', textKey: 'phq9_q5_text' }, // "Poor appetite or overeating"
        { id: 'phq9_q6', textKey: 'phq9_q6_text' }, // "Feeling bad about yourself - or that you are a failure or have let yourself or your family down"
        { id: 'phq9_q7', textKey: 'phq9_q7_text' }, // "Trouble concentrating on things, such as reading the newspaper or watching television"
        { id: 'phq9_q8', textKey: 'phq9_q8_text' }, // "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual"
        { id: 'phq9_q9', textKey: 'phq9_q9_text' }, // "Thoughts that you would be better off dead, or of hurting yourself in some way"
      ],
      responseOptions: commonLikertOptions,
      scoringThresholds: [ // Total score 0-27
        { upperBound: 4, resultKey: 'phq9_result_minimal' }, // Minimal depression
        { upperBound: 9, resultKey: 'phq9_result_mild' },    // Mild depression
        { upperBound: 14, resultKey: 'phq9_result_moderate' },// Moderate depression
        { upperBound: 19, resultKey: 'phq9_result_moderately_severe' }, // Moderately severe depression
        { upperBound: 27, resultKey: 'phq9_result_severe' }, // Severe depression
      ],
    },
    {
      id: 'gad7',
      nameKey: 'gad7_test_name', // e.g., "GAD-7 Anxiety Test"
      icon: '😟',
      descriptionKey: 'gad7_description', // e.g., "Screens for symptoms of generalized anxiety disorder."
      questions: [
        { id: 'gad7_q1', textKey: 'gad7_q1_text' }, // "Feeling nervous, anxious, or on edge"
        { id: 'gad7_q2', textKey: 'gad7_q2_text' }, // "Not being able to stop or control worrying"
        { id: 'gad7_q3', textKey: 'gad7_q3_text' }, // "Worrying too much about different things"
        { id: 'gad7_q4', textKey: 'gad7_q4_text' }, // "Trouble relaxing"
        { id: 'gad7_q5', textKey: 'gad7_q5_text' }, // "Being so restless that it is hard to sit still"
        { id: 'gad7_q6', textKey: 'gad7_q6_text' }, // "Becoming easily annoyed or irritable"
        { id: 'gad7_q7', textKey: 'gad7_q7_text' }, // "Feeling afraid as if something awful might happen"
      ],
      responseOptions: commonLikertOptions,
      scoringThresholds: [ // Total score 0-21
        { upperBound: 4, resultKey: 'gad7_result_minimal' },  // Minimal anxiety
        { upperBound: 9, resultKey: 'gad7_result_mild' },     // Mild anxiety
        { upperBound: 14, resultKey: 'gad7_result_moderate' }, // Moderate anxiety
        { upperBound: 21, resultKey: 'gad7_result_severe' },   // Severe anxiety
      ],
    },
    // Example: Adding another (fictional) simple test
    {
      id: 'stress_screener',
      nameKey: 'stress_screener_name',
      icon: '🤯',
      descriptionKey: 'stress_screener_description',
      questions: [
        { id: 'stress_q1', textKey: 'stress_q1_text' },
        { id: 'stress_q2', textKey: 'stress_q2_text' },
      ],
      responseOptions: [ // Could have different options
        { textKey: 'option_never', score: 0 },
        { textKey: 'option_sometimes', score: 1 },
        { textKey: 'option_often', score: 2 },
        { textKey: 'option_always', score: 3 },
      ],
      scoringThresholds: [
        { upperBound: 2, resultKey: 'stress_result_low' },
        { upperBound: 4, resultKey: 'stress_result_moderate' },
        { upperBound: 6, resultKey: 'stress_result_high' },
      ],
    }
    // Add more standardized tests here following the PsychTest structure
  ];

  return { tests, t }; // Exposing 't' can be helpful for components if they need to translate option texts directly
};
