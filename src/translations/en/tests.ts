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

  // --- Stress Screener (Example Test) ---
  'stress_screener_name': 'Stress Level Screener',
  'stress_screener_description': 'A quick assessment of your current stress levels.',
  'stress_q1_text': 'Do you feel overwhelmed by your responsibilities?',
  'stress_q2_text': 'Do you find it difficult to cope with daily pressures?',
  'stress_result_low': 'Your stress level appears to be low.',
  'stress_result_moderate': 'Your stress level appears to be moderate. You might benefit from stress management techniques.',
  'stress_result_high': 'Your stress level appears to be high. It is important to find strategies to reduce stress and potentially seek support.',

  // --- Keys from user's original English file - some are general, some are for old tests ---
  // Keeping them for now as they might be used in other UI parts or for legacy reference.
  // Consider removing translations for tests you've definitively replaced if they are not used elsewhere.

  'psychologicaltests': 'Psychological Tests', // Older general title
  'testssubtitle': 'Self-assessment tools for better understanding', // Older subtitle

  // Categories (already covered above with 'all_tests', etc., but keeping these specific ones if used)
  'anxietytests': 'Anxiety Tests',
  'depressiontests': 'Depression Tests',
  'personalitytests': 'Personality Tests', // This is a category, the old 'personality_test' was a specific test
  'wellbeingtests': 'Well-being Tests', // Older category name

  'testduration': 'Duration', // Label
  'testquestions': 'Questions', // Label
  'minutes': 'minutes', // Unit
  'testdescription': 'Description', // Label

  // Old Test Names (Can be differentiated if listed alongside standardized versions)
  'depression_test': 'Depression Test (Simple)',
  'anxiety_test': 'Anxiety Test (Simple)',
  'personality_test': 'Personality Profile (Simple)', // Example name for the old personality test
  'adhd_test': 'ADHD Symptoms Checklist (Simple)',
  'children_test': 'Children\'s Well-being Checklist (Simple)',
  'jealousy_test': 'Jealousy Scale (Simple)',
  'love_test': 'Love Quiz (Simple)',
  'passion_test': 'Passion Indicator (Simple)',

  // Old Depression test questions
  'depression_q1': 'I feel sad or depressed most of the day (Simple Test)',
  'depression_q2': 'I have lost interest in activities I used to enjoy (Simple Test)',
  'depression_q3': 'I have trouble sleeping or sleep a lot (Simple Test)',
  'depression_q4': 'I feel tired or lack of energy (Simple Test)',
  'depression_q5': 'I have a weak appetite or overeat (Simple Test)',
  'depression_result_minimal': 'Minimal or No Depression (Simple Test)',
  'depression_result_mild': 'Mild Depression (Simple Test)',
  'depression_result_moderate': 'Moderate Depression (Simple Test)',
  'depression_result_severe': 'Severe Depression (Simple Test)',

  // Old Anxiety test questions
  'anxiety_q1': 'I feel stressed or anxious (Simple Test)',
  'anxiety_q2': 'I worry a lot about different things (Simple Test)',
  'anxiety_q3': 'I have trouble relaxing (Simple Test)',
  'anxiety_q4': 'I feel restless and have difficulty sitting still (Simple Test)',
  'anxiety_q5': 'I get upset or provoked easily (Simple Test)',
  'anxiety_result_minimal': 'Minimal or No Anxiety (Simple Test)',
  'anxiety_result_mild': 'Mild Anxiety (Simple Test)',
  'anxiety_result_moderate': 'Moderate Anxiety (Simple Test)',
  'anxiety_result_severe': 'Severe Anxiety (Simple Test)',

  // Old Personality test questions
  'personality_q1': 'I enjoy being the center of attention',
  'personality_q2': 'I prefer quiet, solitary activities',
  'personality_q3': 'I consider myself organized and detail-oriented',
  'personality_q4': 'I feel comfortable in new social situations',
  'personality_q5': 'I am more practical than creative',

  // Old ADHD test questions
  'adhd_q1': 'I have trouble staying focused',
  'adhd_q2': 'I get easily distracted',
  'adhd_q3': 'I struggle to complete tasks',
  'adhd_q4': 'I often lose things necessary for tasks',
  'adhd_q5': 'I often fidget or feel restless',

  // Old Children test questions
  'children_q1': 'My child has difficulty concentrating', // Assuming "My child..." for context
  'children_q2': 'My child appears anxious or stressed',
  'children_q3': 'My child suffers from frequent mood swings',
  'children_q4': 'My child has difficulty making friends',
  'children_q5': 'My child has lost interest in activities that he/she used to enjoy',

  // Old Jealousy test questions
  'jealousy_q1': 'I worry a lot about my partner cheating on me',
  'jealousy_q2': 'I check my partner\'s phone or his social media',
  'jealousy_q3': 'I feel uncomfortable when my partner talks to others',
  'jealousy_q4': 'I get angry when my partner gives attention to others',
  'jealousy_q5': 'I often need reassurance from my partner',

  // Old Love test questions
  'love_q1': 'I think about this person constantly',
  'love_q2': 'I feel happy when I am with this person',
  'love_q3': 'I prioritize this person\'s needs over my own',
  'love_q4': 'I can see a future with this person',
  'love_q5': 'I accept this person\'s faults',

  // Old Passion test questions
  'passion_q1': 'I lose track of time when I am busy with this activity',
  'passion_q2': 'I feel energized when I do this activity',
  'passion_q3': 'I constantly want to improve in this field',
  'passion_q4': 'I think about this activity even when I\'m not doing it',
  'passion_q5': 'I will engage in this activity even if I do not receive payment or recognition for it',

  // --- Other content sections (Mental Health Info, Therapy, Blog, etc.) ---
  // These sections are preserved as they were in your original file.

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
