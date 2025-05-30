// src/translations/en/tests.ts
const testsTranslations = {
  // --- General Test UI & Page Titles ---
  'psychological_tests_title': 'Psychological Tests',
  'psychological_tests_description': 'Take one of our psychological tests to learn more about your mental well-being.',
  'test_completed_toast': 'Test completed successfully!',
  'self_assessment': 'Self-Assessment',
  // ... (keep other general UI keys from your previous full version) ...
  'question': 'Question',
  'of': 'of',
  'test_results': 'Test Results',
  'restart_test': 'Restart Test',
  'choose_another_test': 'Choose Another Test',
  'back_to_tests': 'Back to Test List',
  'start_test': 'Start Test',
  'loading_test': 'Loading test...',
  'test_disclaimer': 'These tests are screening tools for educational and informational purposes only. They are not intended for self-diagnosis and do not replace consultation with a qualified mental health professional for accurate diagnosis and appropriate treatment.',
  'answer_honestly': 'Please answer each question honestly for the most accurate results.',
  'your_score_is': 'Your score is',
  'consult_professional': 'Please consult a professional for interpretation.',
  'result_default_consult': 'We encourage you to discuss these results with a mental health professional for a deeper understanding.',

  // --- Standardized Response Options ---
  'option_not_at_all': 'Not at all',
  'option_several_days': 'Several days',
  'option_more_than_half_days': 'More than half the days',
  'option_nearly_every_day': 'Nearly every day',

  // PSS-10 Specific Response Options
  'option_pss_never': 'Never',
  'option_pss_almost_never': 'Almost Never',
  'option_pss_sometimes': 'Sometimes',
  'option_pss_fairly_often': 'Fairly Often',
  'option_pss_very_often': 'Very Often',

  // --- PHQ-9 Depression Test ---
  'phq9_test_name': 'PHQ-9 Depression Screening',
  'phq9_description': 'A 9-question screening tool to assess the severity of depression symptoms.',
  'phq9_q1_text': 'Little interest or pleasure in doing things',
  'phq9_q2_text': 'Feeling down, depressed, or hopeless',
  'phq9_q3_text': 'Trouble falling or staying asleep, or sleeping too much',
  'phq9_q4_text': 'Feeling tired or having little energy',
  'phq9_q5_text': 'Poor appetite or overeating',
  'phq9_q6_text': 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
  'phq9_q7_text': 'Trouble concentrating on things, such as reading the newspaper or watching television',
  'phq9_q8_text': 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
  'phq9_q9_text': 'Thoughts that you would be better off dead, or of hurting yourself in some way',
  'phq9_result_minimal': 'Minimal or no depressive symptoms. Your score suggests you are likely not experiencing depression, or it is very mild.',
  'phq9_result_mild': 'Mild depression. Watchful waiting may be appropriate; reassess at follow-up.',
  'phq9_result_moderate': 'Moderate depression. Treatment, such as a treatment plan, counseling, and/or medication may be appropriate.',
  'phq9_result_moderately_severe': 'Moderately severe depression. Treatment with medication and/or psychotherapy is typically recommended.',
  'phq9_result_severe': 'Severe depression. Treatment with medication and psychotherapy is strongly recommended.',

  // --- GAD-7 Anxiety Test ---
  'gad7_test_name': 'GAD-7 Anxiety Screening',
  'gad7_description': 'A 7-question screening tool to assess the severity of anxiety symptoms.',
  'gad7_q1_text': 'Feeling nervous, anxious, or on edge',
  'gad7_q2_text': 'Not being able to stop or control worrying',
  'gad7_q3_text': 'Worrying too much about different things',
  'gad7_q4_text': 'Trouble relaxing',
  'gad7_q5_text': 'Being so restless that it is hard to sit still',
  'gad7_q6_text': 'Becoming easily annoyed or irritable',
  'gad7_q7_text': 'Feeling afraid as if something awful might happen',
  'gad7_result_minimal': 'Minimal or no anxiety symptoms. Your score suggests you are likely not experiencing significant anxiety.',
  'gad7_result_mild': 'Mild anxiety. Monitoring symptoms may be appropriate; reassess later.',
  'gad7_result_moderate': 'Moderate anxiety. Considering a treatment plan or counseling may be appropriate.',
  'gad7_result_severe': 'Severe anxiety. Treatment, which may include psychotherapy and/or medication, is typically recommended.',

  // --- Perceived Stress Scale (PSS-10) ---
  'pss10_test_name': 'Perceived Stress Scale (PSS-10)',
  'pss10_description': 'A 10-question scale to measure the perception of stress over the last month.',
  'pss10_q1_text': 'In the last month, how often have you been upset because of something that happened unexpectedly?',
  'pss10_q2_text': 'In the last month, how often have you felt that you were unable to control the important things in your life?',
  'pss10_q3_text': 'In the last month, how often have you felt nervous and stressed?',
  'pss10_q4_text': 'In the last month, how often have you felt confident about your ability to handle your personal problems?',
  'pss10_q5_text': 'In the last month, how often have you felt that things were going your way?',
  'pss10_q6_text': 'In the last month, how often have you found that you could not cope with all the things that you had to do?',
  'pss10_q7_text': 'In the last month, how often have you been able to control irritations in your life?',
  'pss10_q8_text': 'In the last month, how often have you felt that you were on top of things?',
  'pss10_q9_text': 'In the last month, how often have you been angered because of things that were outside of your control?',
  'pss10_q10_text': 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?',
  'pss10_result_low_stress': 'Low perceived stress. Your stress levels appear to be relatively low.',
  'pss10_result_moderate_stress': 'Moderate perceived stress. You are experiencing a moderate level of stress.',
  'pss10_result_high_stress': 'High perceived stress. Your stress levels appear to be high, and you may benefit from stress management strategies.',

  // Remove Stress Screener specific translations
  // 'stress_screener_name': 'Stress Level Screener',
  // 'stress_screener_description': 'A quick assessment of your current stress levels.',
  // 'stress_q1_text': 'Do you feel overwhelmed by your responsibilities?',
  // 'stress_q2_text': 'Do you find it difficult to cope with daily pressures?',
  // 'stress_result_low': 'Your stress level appears to be low.',
  // 'stress_result_moderate': 'Your stress level appears to be moderate. You might benefit from stress management techniques.',
  // 'stress_result_high': 'Your stress level appears to be high. It is important to find strategies to reduce stress and potentially seek support.',

  // ... (Keep other existing sections like "Mental Health Info", "Therapy Types", "Blog", etc. from your previous full version) ...
  // Make sure to merge this new content with your existing English translation file carefully.
};

export default testsTranslations;
