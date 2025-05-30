// Psychological tests translations for English
const testsTranslations = {
  // --- General Test UI & Page Titles ---
  'psychological_tests_title': 'Psychological Tests', // For main page title
  'psychological_tests_description': 'Take one of our psychological tests to learn more about your mental well-being.', // For main page subtitle
  'test_completed_toast': 'Test completed successfully!', // For toast notifications
  'self_assessment': 'Self-Assessment',
  'professional_tests': 'Professional Tests', // If you categorize

  // Test categories (if you use them)
  'all_tests': 'All Tests',
  'cognitive': 'Cognitive',
  'personality': 'Personality',
  'clinical': 'Clinical',
  'wellbeing': 'Well-being', // Consistent naming

  // Test Interface & Common Actions
  'question': 'Question',
  'of': 'of', // e.g., Question 1 'of' 9
  'test_results': 'Test Results',
  'restart_test': 'Restart Test',
  'choose_another_test': 'Choose Another Test',
  'back_to_tests': 'Back to Test List',
  'start_test': 'Start Test',
  'take_test': 'Take Test', // Generic button
  'select': 'Select', // Generic select
  'loading_test': 'Loading test...',
  'test_loaded': 'Test loaded.',
  'test_load_error': 'Failed to load the test. Please try again.',
  'no_tests_found': 'No tests found.',
  'search_tests': 'Search tests...',
  'test_disclaimer': 'These tests are screening tools for educational and informational purposes only. They are not intended for self-diagnosis and do not replace consultation with a qualified mental health professional for accurate diagnosis and appropriate treatment.',
  'test_consists_of': 'This test consists of',
  'questions_and_will_take': 'questions and will take approximately',
  'minutes_to_complete': 'minutes to complete.',
  'answer_honestly': 'Please answer each question honestly for the most accurate results.',
  'your_score_is': 'Your score is', // Generic score prefix
  'consult_professional': 'Please consult a professional for interpretation.', // Generic advice
  'result_default_consult': 'We encourage you to discuss these results with a mental health professional for a deeper understanding.', // Default result text from TestContent

  // --- Standardized Response Options (CRITICAL: Match useTestData.tsx 'textKey') ---
  'option_not_at_all': 'Not at all',
  'option_several_days': 'Several days',
  'option_more_than_half_days': 'More than half the days',
  'option_nearly_every_day': 'Nearly every day',
  'option_never': 'Never',
  'option_sometimes': 'Sometimes',
  'option_often': 'Often',
  'option_always': 'Always',

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

  // Mental Health Info
  'mentalhealthtitle': 'Understanding Mental Health',
  'mentalhealthsubtitle': 'Education is the first step toward healing',
  'anxietytitle': 'Anxiety Disorders', // Note: This key is also used for old anxiety test name. Disambiguate if needed.
  'anxietydesc': 'Learn about various types of anxiety disorders and their symptoms',
  'depressiontitle': 'Depression', // Note: This key is also used for old depression test name.
  'depressiondesc': 'Understand the causes, symptoms, and treatments for depression',
  'traumatitle': 'Trauma & PTSD',
  'traumadesc': 'Information about trauma responses and recovery paths',
  'wellnesstitle': 'General Wellness',
  'wellnessdesc': 'Strategies for maintaining good mental health in daily life',
  'anxiety': 'Anxiety', // Tag or category
  'depression': 'Depression', // Tag or category
  'stress': 'Stress', // Tag or category
  'other': 'Other', // Tag or category

  // Therapy Types
  'therapytypestitle': 'Specialized Therapy Services',
  'therapytypessubtitle': 'We offer a range of evidence-based therapy options',
  'cbttitle': 'Cognitive Behavioral Therapy',
  'cbtdesc': 'Focuses on changing negative thought patterns to improve mood and behavior',
  'psychotherapytitle': 'Psychodynamic Therapy',
  'psychotherapydesc': 'Explores unconscious processes to gain insight into behavior',
  'mindfulnesstitle': 'Mindfulness-Based Therapy',
  'mindfulnessdesc': 'Incorporates meditation practices to reduce stress and anxiety',
  'familytitle': 'Family Therapy',
  'familydesc': 'Addresses issues affecting the family system and relationships',

  // Blog
  'blogtitle': 'Mental Health Blog',
  'blogsubtitle': 'Expert insights and guidance for your mental wellness journey',
  'readtime': 'min read',
  'popularposts': 'Popular Posts',
  'recentposts': 'Recent Posts',
  'categories': 'Categories',
  'tags': 'Tags',
  'author': 'Author',
  'publishedon': 'Published on',
  'share': 'Share', // General share
  'relatedposts': 'Related Posts',

  // Featured Content
  'featuredcontenttitle': 'Latest Mental Health Resources',
  'featuredcontentsubtitle': 'Articles and guides to support your mental well-being',
  'viewallposts': 'View All Posts',

  // 404 Page
  'notfound': 'Page Not Found',
  'pagenotfound': 'The page you are looking for doesn\'t exist or has been moved.',
  'gohome': 'Go to Homepage',
};

export default testsTranslations;
