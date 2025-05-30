import { useLanguage } from '@/hooks/useLanguage';

// Define the structure for a response option
export interface ResponseOption {
  textKey: string; // Translation key for the option's text
  score: number;
}

// Updated: Define the structure for a test question
export interface TestQuestion {
  id: string; // Unique ID for the question (e.g., 'phq9_q1')
  textKey: string; // Translation key for the question text
  reverseScored?: boolean; // Optional: True if this question's score should be reversed
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
  const { t } = useLanguage();

  const commonLikertOptionsPHQGAD: ResponseOption[] = [
    { textKey: 'option_not_at_all', score: 0 },
    { textKey: 'option_several_days', score: 1 },
    { textKey: 'option_more_than_half_days', score: 2 },
    { textKey: 'option_nearly_every_day', score: 3 },
  ];

  const pss10ResponseOptions: ResponseOption[] = [
    { textKey: 'option_pss_never', score: 0 },           // 0 - Never
    { textKey: 'option_pss_almost_never', score: 1 }, // 1 - Almost Never
    { textKey: 'option_pss_sometimes', score: 2 },    // 2 - Sometimes
    { textKey: 'option_pss_fairly_often', score: 3 }, // 3 - Fairly Often
    { textKey: 'option_pss_very_often', score: 4 },   // 4 - Very Often
  ];

  const tests: PsychTest[] = [
    {
      id: 'phq9',
      nameKey: 'phq9_test_name',
      icon: '📝',
      descriptionKey: 'phq9_description',
      questions: [
        { id: 'phq9_q1', textKey: 'phq9_q1_text' },
        { id: 'phq9_q2', textKey: 'phq9_q2_text' },
        { id: 'phq9_q3', textKey: 'phq9_q3_text' },
        { id: 'phq9_q4', textKey: 'phq9_q4_text' },
        { id: 'phq9_q5', textKey: 'phq9_q5_text' },
        { id: 'phq9_q6', textKey: 'phq9_q6_text' },
        { id: 'phq9_q7', textKey: 'phq9_q7_text' },
        { id: 'phq9_q8', textKey: 'phq9_q8_text' },
        { id: 'phq9_q9', textKey: 'phq9_q9_text' },
      ],
      responseOptions: commonLikertOptionsPHQGAD,
      scoringThresholds: [
        { upperBound: 4, resultKey: 'phq9_result_minimal' },
        { upperBound: 9, resultKey: 'phq9_result_mild' },
        { upperBound: 14, resultKey: 'phq9_result_moderate' },
        { upperBound: 19, resultKey: 'phq9_result_moderately_severe' },
        { upperBound: 27, resultKey: 'phq9_result_severe' },
      ],
    },
    {
      id: 'gad7',
      nameKey: 'gad7_test_name',
      icon: '😟',
      descriptionKey: 'gad7_description',
      questions: [
        { id: 'gad7_q1', textKey: 'gad7_q1_text' },
        { id: 'gad7_q2', textKey: 'gad7_q2_text' },
        { id: 'gad7_q3', textKey: 'gad7_q3_text' },
        { id: 'gad7_q4', textKey: 'gad7_q4_text' },
        { id: 'gad7_q5', textKey: 'gad7_q5_text' },
        { id: 'gad7_q6', textKey: 'gad7_q6_text' },
        { id: 'gad7_q7', textKey: 'gad7_q7_text' },
      ],
      responseOptions: commonLikertOptionsPHQGAD,
      scoringThresholds: [
        { upperBound: 4, resultKey: 'gad7_result_minimal' },
        { upperBound: 9, resultKey: 'gad7_result_mild' },
        { upperBound: 14, resultKey: 'gad7_result_moderate' },
        { upperBound: 21, resultKey: 'gad7_result_severe' },
      ],
    },
    {
      id: 'pss10',
      nameKey: 'pss10_test_name',
      icon: '😥', // Icon for stress
      descriptionKey: 'pss10_description',
      questions: [
        { id: 'pss10_q1', textKey: 'pss10_q1_text' }, // Upset by unexpected
        { id: 'pss10_q2', textKey: 'pss10_q2_text' }, // Unable to control important things
        { id: 'pss10_q3', textKey: 'pss10_q3_text' }, // Felt nervous and stressed
        { id: 'pss10_q4', textKey: 'pss10_q4_text', reverseScored: true }, // Confident handling personal problems (R)
        { id: 'pss10_q5', textKey: 'pss10_q5_text', reverseScored: true }, // Things going your way (R)
        { id: 'pss10_q6', textKey: 'pss10_q6_text' }, // Could not cope with things to do
        { id: 'pss10_q7', textKey: 'pss10_q7_text', reverseScored: true }, // Able to control irritations (R)
        { id: 'pss10_q8', textKey: 'pss10_q8_text', reverseScored: true }, // Felt on top of things (R)
        { id: 'pss10_q9', textKey: 'pss10_q9_text' }, // Angered by things outside your control
        { id: 'pss10_q10', textKey: 'pss10_q10_text' },// Difficulties piling up
      ],
      responseOptions: pss10ResponseOptions,
      scoringThresholds: [ // Total score 0-40
        { upperBound: 13, resultKey: 'pss10_result_low_stress' },    // Low stress
        { upperBound: 26, resultKey: 'pss10_result_moderate_stress' },// Moderate stress
        { upperBound: 40, resultKey: 'pss10_result_high_stress' },    // High stress
      ],
    }
    // Removed stress_screener
  ];

  return { tests };
};
