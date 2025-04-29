import { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
  const initialLanguage: 'en' | 'ar' = (storedLanguage === 'en' || storedLanguage === 'ar') ? storedLanguage : 'ar';
  
  const [language, setLanguage] = useState<'en' | 'ar'>(initialLanguage);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    }
  }, [language]);

const translations = {
  en: {
    // General UI elements
    "Home": "Home",
    "Blog": "Blog",
    "Psychological Tests": "Psychological Tests",
    "Login": "Login",
    "Register": "Register",
    "Patient Dashboard": "Patient Dashboard",
    "Admin Dashboard": "Admin Dashboard",
    "Settings": "Settings",
    "Language": "Language",
    "Theme": "Theme",
    "english": "English",
    "arabic": "Arabic",
    "login": "Log in",
    "signup": "Sign up",
    "my_account": "My Account",
    "admin_panel": "Admin Panel",
    "profile": "Profile",
    "logout": "Log out",
    "dashboard": "Dashboard",
    "providing_mental_health_care": "Providing compassionate mental health care and resources to support your wellbeing journey.",
    "quick_links": "Quick Links",
    "resources": "Resources",
    "mental_health_guide": "Mental Health Guide",
    "crisis_support": "Crisis Support",
    "self_care_tips": "Self Care Tips",
    "faq": "FAQ",
    "contact": "Contact",
    "address": "123 Wellness Street, Mindful City, MC 12345",
    "sanad_copyright": "Sanad. All rights reserved.",
    "privacy_policy": "Privacy Policy",
    "terms_of_service": "Terms of Service",
    "cookie_policy": "Cookie Policy",
    
    // Blog and articles
    "mental_health_resources": "Mental Health Resources",
    "explore_mental_health_blog": "Explore Our Mental Health Blog",
    "discover_insights": "Discover insights, tips, and information to support your mental wellbeing journey",
    "search_articles": "Search articles...",
    "no_articles_found": "No articles found",
    "try_adjusting_search": "Try adjusting your search or removing filters",
    "latest_resources": "Latest Resources",
    "featured_mental_health_articles": "Featured Mental Health Articles",
    "explore_latest_articles": "Explore the latest articles and resources to support your mental health journey",
    "view_all_articles": "View All Articles",
    
    // Psychological tests
    "psychological_tests": "Psychological Tests",
    "take_test_description": "Take one of our psychological tests to learn more about yourself.",
    "test_completed": "Test completed!",
    
    // Test names
    "depression_test": "Depression Test",
    "anxiety_test": "Anxiety Test",
    "personality_test": "Personality Test",
    "adhd_test": "ADHD Test",
    "children_test": "Psychological State Test for Children",
    "jealousy_test": "Jealousy Test",
    "love_test": "Love Test",
    "passion_test": "Passion Test",
    
    // Test interface
    "question": "Question",
    "of": "of",
    "test_results": "Test Results",
    "restart_test": "Restart Test",
    "choose_another_test": "Choose Another Test",
    "back": "Back",
    "start_test": "Start Test",
    "select": "Select",
    "take_this_test": "Take this test to assess your",
    "not_at_all": "Not at all",
    "several_days": "Several days",
    "more_than_half_days": "More than half the days",
    "nearly_every_day": "Nearly every day",
    "test_disclaimer": "This test is for educational purposes only and should not be used for self-diagnosis. Please consult with a mental health professional for proper diagnosis and treatment.",
    "test_consists_of": "The test consists of",
    "questions_and_will_take": "questions and will take approximately",
    "minutes_to_complete": "minutes to complete.",
    "answer_honestly": "Please answer each question honestly for the most accurate results.",
    "your_score_is": "Your score is",
    "consult_professional": "Please consult with a professional for interpretation.",
    
    // Depression test questions
    "depression_q1": "I feel sad or down most of the day",
    "depression_q2": "I have lost interest in activities I used to enjoy",
    "depression_q3": "I have trouble sleeping or sleep too much",
    "depression_q4": "I feel tired or have little energy",
    "depression_q5": "I have poor appetite or am overeating",
    
    // Depression results
    "depression_result_minimal": "Minimal or no depression",
    "depression_result_mild": "Mild depression",
    "depression_result_moderate": "Moderate depression",
    "depression_result_severe": "Severe depression",
    
    // Anxiety test questions
    "anxiety_q1": "I feel nervous or anxious",
    "anxiety_q2": "I worry too much about different things",
    "anxiety_q3": "I have trouble relaxing",
    "anxiety_q4": "I feel restless and have trouble sitting still",
    "anxiety_q5": "I am easily annoyed or irritable",
    
    // Anxiety results
    "anxiety_result_minimal": "Minimal or no anxiety",
    "anxiety_result_mild": "Mild anxiety",
    "anxiety_result_moderate": "Moderate anxiety",
    "anxiety_result_severe": "Severe anxiety",
    
    // Personality test questions
    "personality_q1": "I enjoy being the center of attention",
    "personality_q2": "I prefer quiet, solitary activities",
    "personality_q3": "I consider myself organized and detail-oriented",
    "personality_q4": "I am comfortable in new social situations",
    "personality_q5": "I am more practical than creative",
    
    // ADHD test questions
    "adhd_q1": "I have difficulty maintaining attention",
    "adhd_q2": "I am easily distracted",
    "adhd_q3": "I struggle to follow through on tasks",
    "adhd_q4": "I frequently lose things necessary for tasks",
    "adhd_q5": "I often fidget or feel restless",
    
    // Children test questions
    "children_q1": "The child has difficulty concentrating",
    "children_q2": "The child seems worried or anxious",
    "children_q3": "The child has frequent mood swings",
    "children_q4": "The child has trouble making friends",
    "children_q5": "The child has lost interest in activities they used to enjoy",
    
    // Jealousy test questions
    "jealousy_q1": "I often worry about my partner being unfaithful",
    "jealousy_q2": "I check my partner's phone or social media",
    "jealousy_q3": "I feel uncomfortable when my partner talks to others",
    "jealousy_q4": "I get upset when my partner gives attention to others",
    "jealousy_q5": "I often need reassurance from my partner",
    
    // Love test questions
    "love_q1": "I think about this person constantly",
    "love_q2": "I feel happy when I'm with this person",
    "love_q3": "I prioritize this person's needs over my own",
    "love_q4": "I can see a future with this person",
    "love_q5": "I accept this person's flaws",
    
    // Passion test questions
    "passion_q1": "I lose track of time when engaged in this activity",
    "passion_q2": "I feel energized when doing this activity",
    "passion_q3": "I constantly want to improve in this area",
    "passion_q4": "I think about this activity even when not doing it",
    "passion_q5": "I would do this activity even if I wasn't paid or recognized for it",

    // About Us page translations
    "About Sanad": "About Sanad",
    "We are a mental health care platform committed to providing support and resources to help you on your journey to mental wellness.": "We are a mental health care platform committed to providing support and resources to help you on your journey to mental wellness.",
    "Our Mission": "Our Mission",
    "At Sanad, our mission is to make mental health care accessible, affordable, and stigma-free for everyone. We believe that every person deserves the support and resources to overcome mental health challenges and achieve holistic well-being.": "At Sanad, our mission is to make mental health care accessible, affordable, and stigma-free for everyone. We believe that every person deserves the support and resources to overcome mental health challenges and achieve holistic well-being.",
    "Our Vision": "Our Vision",
    "We envision a world where access to high-quality mental health care is a fundamental right, and where every person can thrive mentally and emotionally. We strive to build a supportive community where mental health challenges are addressed with compassion, understanding, and expert care.": "We envision a world where access to high-quality mental health care is a fundamental right, and where every person can thrive mentally and emotionally. We strive to build a supportive community where mental health challenges are addressed with compassion, understanding, and expert care.",
    "Our Core Values": "Our Core Values",
    "Compassion": "Compassion",
    "We treat each person with care, understanding, and empathy, recognizing that every mental health journey is unique.": "We treat each person with care, understanding, and empathy, recognizing that every mental health journey is unique.",
    "Accessibility": "Accessibility",
    "We strive to remove barriers to mental health care, whether they are financial, geographical, or cultural.": "We strive to remove barriers to mental health care, whether they are financial, geographical, or cultural.",
    "Excellence": "Excellence",
    "We are committed to delivering high-quality services, evidence-based practices, and an exceptional user experience.": "We are committed to delivering high-quality services, evidence-based practices, and an exceptional user experience.",
    "Inclusivity": "Inclusivity",
    "We welcome people of all backgrounds, identities, and experiences, believing in equitable care for all.": "We welcome people of all backgrounds, identities, and experiences, believing in equitable care for all.",
    "Anti-Stigma": "Anti-Stigma",
    "We actively work against the stigma surrounding mental health through education, awareness, and advocacy.": "We actively work against the stigma surrounding mental health through education, awareness, and advocacy.",
    "Empowerment": "Empowerment",
    "We aim to empower individuals with knowledge, tools, and support to be active participants in their wellness journey.": "We aim to empower individuals with knowledge, tools, and support to be active participants in their wellness journey.",
    "Our Team": "Our Team",
    "Get in Touch": "Get in Touch",
    "Contact Information": "Contact Information",
    "Office Hours": "Office Hours",
    "Monday - Friday": "Monday - Friday",
    "Saturday": "Saturday",
    "Sunday": "Sunday",
    "Closed": "Closed",
    "Send Us a Message": "Send Us a Message",
    "Name": "Name",
    "Email": "Email",
    "Message": "Message",
    "Send Message": "Send Message",

    // Book a Session translations
    "Book a Session": "Book a Session",
    "Schedule a session with one of our qualified therapists and start your healing journey.": "Schedule a session with one of our qualified therapists and start your healing journey.",
    "Schedule a New Session": "Schedule a New Session",
    "Select your preferred therapist, date, and time": "Select your preferred therapist, date, and time",
    "Therapist": "Therapist",
    "Select a therapist": "Select a therapist",
    "patients": "patients",
    "years of experience": "years of experience",
    "Session Type": "Session Type",
    "Select session type": "Select session type",
    "Initial Consultation (60 min)": "Initial Consultation (60 min)",
    "Follow-up Session (45 min)": "Follow-up Session (45 min)",
    "Emergency Session (30 min)": "Emergency Session (30 min)",
    "Date": "Date",
    "Time": "Time",
    "Select a time": "Select a time",
    "Additional Notes (optional)": "Additional Notes (optional)",
    "Add any additional information that might help your therapist": "Add any additional information that might help your therapist",
    "Confirm Booking": "Confirm Booking",
    "Booking...": "Booking...",
    "Your session has been booked successfully! We'll send you a confirmation email.": "Your session has been booked successfully! We'll send you a confirmation email.",
    "Please fill in all required fields": "Please fill in all required fields",
  },
  ar: {
    "Home": "الرئيسية",
    "Blog": "مدونة",
    "Psychological Tests": "الاختبارات النفسية",
    "Login": "تسجيل الدخول",
    "Register": "تسجيل",
    "Patient Dashboard": "لوحة معلومات المريض",
    "Admin Dashboard": "لوحة تحكم المسؤول",
    "Settings": "إعدادات",
    "Language": "لغة",
    "Theme": "مظهر",
    "english": "الإنجليزية",
    "arabic": "العربية",
    "login": "تسجيل الدخول",
    "signup": "تسجيل",
    "my_account": "حسابي",
    "admin_panel": "لوحة الإدارة",
    "profile": "الملف الشخصي",
    "logout": "تسجيل الخروج",
    "dashboard": "لوحة القيادة",
    "providing_mental_health_care": "تقديم رعاية صحية نفسية وموارد تدعم رحلة العافية الخاصة بك.",
    "quick_links": "روابط سريعة",
    "resources": "الموارد",
    "mental_health_guide": "دليل الصحة النفسية",
    "crisis_support": "دعم الأزمات",
    "self_care_tips": "نصائح للعناية الذاتية",
    "faq": "الأسئلة الشائعة",
    "contact": "اتصل بنا",
    "address": "123 شارع العافية، مدينة اليقظة، 12345",
    "sanad_copyright": "سند. جميع الحقوق محفوظة.",
    "privacy_policy": "سياسة الخصوصية",
    "terms_of_service": "شروط الخدمة",
    "cookie_policy": "سياسة ملفات تعريف الارتباط",
    
    "mental_health_resources": "موارد الصحة النفسية",
    "explore_mental_health_blog": "استكشف مدونة الصحة النفسية",
    "discover_insights": "اكتشف الرؤى والنصائح والمعلومات لدعم رحلة صحتك النفسية",
    "search_articles": "البحث في المقالات...",
    "no_articles_found": "لم يتم العثور على مقالات",
    "try_adjusting_search": "حاول تعديل البحث أو إزالة الفلاتر",
    "latest_resources": "أحدث الموارد",
    "featured_mental_health_articles": "مقالات مميزة في الصحة النفسية",
    "explore_latest_articles": "استكشف أحدث المقالات والموارد لدعم رحلة الصحة النفسية الخاصة بك",
    "view_all_articles": "عرض جميع المقالات",
    
    "psychological_tests": "الاختبارات النفسية",
    "take_test_description": "قم بإجراء أحد اختباراتنا النفسية لمعرفة المزيد عن نفسك.",
    "test_completed": "تم إكمال الاختبار!",
    
    "depression_test": "اختبار الاكتئاب",
    "anxiety_test": "اختبار القلق",
    "personality_test": "اختبار الشخصية",
    "adhd_test": "اختبار فرط الحركة ونقص الانتباه",
    "children_test": "اختبار الحالة النفسية للأطفال",
    "jealousy_test": "اختبار الغيرة",
    "love_test": "اختبار الحب",
    "passion_test": "اختبار الشغف",
    
    "question": "سؤال",
    "of": "من",
    "test_results": "نتائج الاختبار",
    "restart_test": "إعادة الاختبار",
    "choose_another_test": "اختيار اختبار آخر",
    "back": "رجوع",
    "start_test": "ابدأ الاختبار",
    "select": "اختر",
    "take_this_test": "قم بإجراء هذا الاختبار لتقييم",
    "not_at_all": "ليس على الإطلاق",
    "several_days": "عدة أيام",
    "more_than_half_days": "أكثر من نصف الأيام",
    "nearly_every_day": "تقريبًا كل يوم",
    "test_disclaimer": "هذا الاختبار لأغراض تعليمية فقط ولا ينبغي استخدامه للتشخيص الذاتي. يرجى استشارة أخصائي الصحة النفسية للتشخيص والعلاج المناسبين.",
    "test_consists_of": "يتكون الاختبار من",
    "questions_and_will_take": "أسئلة وسيستغرق تقريبًا",
    "minutes_to_complete": "دقائق لإكماله.",
    "answer_honestly": "يرجى الإجابة على كل سؤال بصدق للحصول على أدق النتائج.",
    "your_score_is": "درجتك هي",
    "consult_professional": "يرجى استشارة متخصص للتفسير.",
    
    "depression_q1": "أشعر بالحزن أو الاكتئاب معظم اليوم",
    "depression_q2": "فقدت الاهتمام بالأنشطة التي كنت أستمتع بها",
    "depression_q3": "أعاني من صعوبة في النوم أو أنام كثيرًا",
    "depression_q4": "أشعر بالتعب أو قلة الطاقة",
    "depression_q5": "لدي شهية ضعيفة أو أفرط في تناول الطعام",
    
    "depression_result_minimal": "اكتئاب بسيط أو لا يوجد",
    "depression_result_mild": "اكتئاب خفيف",
    "depression_result_moderate": "اكتئاب متوسط",
    "depression_result_severe": "اكتئاب شديد",
    
    "anxiety_q1": "أشعر بالتوتر أو القلق",
    "anxiety_q2": "أقلق كثيرًا بشأن أمور مختلفة",
    "anxiety_q3": "أواجه صعوبة في الاسترخاء",
    "anxiety_q4": "أشعر بعدم الراحة وصعوبة في الجلوس ساكنًا",
    "anxiety_q5": "أنزعج أو أستفز بسهولة",
    
    "anxiety_result_minimal": "قلق بسيط أو لا يوجد",
    "anxiety_result_mild": "قلق خفيف",
    "anxiety_result_moderate": "قلق متوسط",
    "anxiety_result_severe": "قلق شديد",
    
    "personality_q1": "أستمتع بكوني محور الاهتمام",
    "personality_q2": "أفضل الأنشطة الهادئة والمنعزلة",
    "personality_q3": "أعتبر نفسي منظمًا ومهتمًا بالتفاصيل",
    "personality_q4": "أشعر بالراحة في المواقف الاجتماعية الجديدة",
    "personality_q5": "أنا أكثر عملية من إبداعية",
    
    "adhd_q1": "أواجه صعوبة في الحفاظ على التركيز",
    "adhd_q2": "أتشتت بسهولة",
    "adhd_q3": "أكافح لإتمام المهام",
    "adhd_q4": "غالبًا ما أفقد الأشياء الضرورية للمهام",
    "adhd_q5": "غالبًا ما أتململ أو أشعر بعدم الراحة",
    
    "children_q1": "يواجه الطفل صعوبة في التركيز",
    "children_q2": "يبدو الطفل قلقًا أو متوترًا",
    "children_q3": "يعاني الطفل من تقلبات مزاجية متكررة",
    "children_q4": "يواجه الطفل صعوبة في تكوين صداقات",
    "children_q5": "فقد الطفل الاهتمام بالأنشطة التي كان يستمتع بها",
    
    "jealousy_q1": "أقلق كثيرًا بشأن خيانة شريكي لي",
    "jealousy_q2": "أتفقد هاتف شريكي أو وسائل التواصل الاجتماعي الخاصة به",
    "jealousy_q3": "أشعر بعدم الارتياح عندما يتحدث شريكي مع الآخرين",
    "jealousy_q4": "أغضب عندما يعطي شريكي اهتمامًا للآخرين",
    "jealousy_q5": "غالبًا ما أحتاج إلى تطمين من شريكي",
    
    "love_q1": "أفكر في هذا الشخص باستمرار",
    "love_q2": "أشعر بالسعادة عندما أكون مع هذا الشخص",
    "love_q3": "أعطي أولوية لاحتياجات هذا الشخص على احتياجاتي",
    "love_q4": "أستطيع أن أرى مستقبلًا مع هذا الشخص",
    "love_q5": "أتقبل عيوب هذا الشخص",
    
    "passion_q1": "أفقد الإحساس بالوقت عندما أنشغل بهذا النشاط",
    "passion_q2": "أشعر بالنشاط عند ممارسة هذا النشاط",
    "passion_q3": "أرغب باستمرار في التحسن في هذا المجال",
    "passion_q4": "أفكر في هذا النشاط حتى عندما لا أمارسه",
    "passion_q5": "سأمارس هذا النشاط حتى لو لم أتلقى أجرًا أو تقديرًا عليه",

    // About Us page translations
    "About Sanad": "عن سند",
    "We are a mental health care platform committed to providing support and resources to help you on your journey to mental wellness.": "نحن منصة رعاية صحية نفسية ملتزمة بتوفير الدعم والموارد للمساعدة في رحلتك نحو الرفاهية النفسية.",
    "Our Mission": "مهمتنا",
    "At Sanad, our mission is to make mental health care accessible, affordable, and stigma-free for everyone. We believe that every person deserves the support and resources to overcome mental health challenges and achieve holistic well-being.": "في سند، مهمتنا هي جعل الرعاية الصحية النفسية متاحة وميسورة التكلفة وخالية من الوصمة للجميع. نحن نؤمن بأن كل شخص يستحق الدعم والموارد للتغلب على التحديات النفسية وتحقيق الرفاهية الشاملة.",
    "Our Vision": "رؤيتنا",
    "We envision a world where access to high-quality mental health care is a fundamental right, and where every person can thrive mentally and emotionally. We strive to build a supportive community where mental health challenges are addressed with compassion, understanding, and expert care.": "نتصور عالمًا يكون فيه الوصول إلى الرعاية الصحية النفسية عالية الجودة حقًا أساسيًا، وحيث يمكن لكل شخص أن يزدهر عقليًا وعاطفيًا. نحن نسعى جاهدين لبناء مجتمع داعم حيث تتم معالجة التحديات النفسية بالتعاطف والفهم والرعاية الخبيرة.",
    "Our Core Values": "قيمنا الأساسية",
    "Compassion": "التعاطف",
    "We treat each person with care, understanding, and empathy, recognizing that every mental health journey is unique.": "نتعامل مع كل شخص بالرعاية والتفهم والتعاطف، مدركين أن كل رحلة صحية نفسية هي فريدة من نوعها.",
    "Accessibility": "الوصول",
    "We strive to remove barriers to mental health care, whether they are financial, geographical, or cultural.": "نسعى جاهدين لإزالة الحواجز أمام الرعاية الصحية النفسية، سواء كانت مالية أو جغرافية أو ثقافية.",
    "Excellence": "التميز",
    "We are committed to delivering high-quality services, evidence-based practices, and an exceptional user experience.": "نلتزم بتقديم خدمات ذات جودة عالية وممارسات قائمة على الأدلة وتجربة مستخدم استثنائية.",
    "Inclusivity": "الشمولية",
    "We welcome people of all backgrounds, identities, and experiences, believing in equitable care for all.": "نرحب بالأشخاص من جميع الخلفيات والهويات والتجارب، ونؤمن بالمساواة في الرعاية للجميع.",
    "Anti-Stigma": "مكافحة الوصم",
    "We actively work against the stigma surrounding mental health through education, awareness, and advocacy.": "نعمل بنشاط على مكافحة الوصم المحيط بالصحة النفسية من خلال التعليم والتوعية والمناصرة.",
    "Empowerment": "التمكين",
    "We aim to empower individuals with knowledge, tools, and support to be active participants in their wellness journey.": "نهدف إلى تمكين الأفراد بالمعرفة والأدوات والدعم ليكونوا مشاركين نشطين في رحلتهم نحو العافية.",
    "Our Team": "فريقنا",
    "Get in Touch": "تواصل معنا",
    "Contact Information": "معلومات الاتصال",
    "Office Hours": "ساعات العمل",
    "Monday - Friday": "الإثنين - الجمعة",
    "Saturday": "السبت",
    "Sunday": "الأحد",
    "Closed": "مغلق",
    "Send Us a Message": "أرسل لنا رسالة",
    "Name": "الاسم",
    "Email": "البريد الإلكتروني",
    "Message": "الرسالة",
    "Send Message": "إرسال",

    // Book a Session translations
    "Book a Session": "حجز جلسة",
    "Schedule a session with one of our qualified therapists and start your healing journey.": "احجز جلسة مع أحد معالجينا المؤهلين وابدأ رحلة الشفاء الخاصة بك.",
    "Schedule a New Session": "حجز جلسة جديدة",
    "Select your preferred therapist, date, and time": "اختر المعالج والتاريخ والوقت المناسب لك",
    "Therapist": "المعالج",
    "Select a therapist": "اختر معالج",
    "patients": "مريض",
    "years of experience": "سنوات خبرة",
    "Session Type": "نوع الجلسة",
    "Select session type": "اختر نوع الجلسة",
    "Initial Consultation (60 min)": "جلسة استشارية أولى (60 دقيقة)",
    "Follow-up Session (45 min)": "جلسة متابعة (45 دقيقة)",
    "Emergency Session (30 min)": "جلسة طارئة (30 دقيقة)",
    "Date": "التاريخ",
    "Time": "الوقت",
    "Select a time": "اختر وقتًا",
    "Additional Notes (optional)": "ملاحظات إضافية (اختياري)",
    "Add any additional information that might help your therapist": "أضف أي معلومات إضافية قد تساعد المعالج",
    "Confirm Booking": "تأكيد الحجز",
    "Booking...": "جاري الحجز...",
    "Your session has been booked successfully! We'll send you a confirmation email.": "تم حجز جلستك بنجاح! سنرسل لك تأكيدًا عبر البريد الإلكتروني.",
    "Please fill in all required fields": "يرجى تعبئة جميع الحقول المطلوبة",
  },
};

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
