
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import mustafaImage from "../images/Eng-mustafa.jpg";
import omerMahgoubImage from "../images/Eng-omer-Mahgoub.jpg";
 

const AboutUs = () => {
  const { language, t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = language === 'ar' ? 'سند - من نحن' : 'Sanad - About Us';
  }, [language]);

  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-background to-secondary/5">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {isRTL ? 'من نحن' : 'About Sanad'}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {isRTL 
                  ? 'نحن منصة رعاية صحية نفسية ملتزمة بتوفير الدعم والموارد للمساعدة في رحلتك نحو الرفاهية النفسية.'
                  : 'We are a mental health care platform committed to providing support and resources to help you on your journey to mental wellness.'}
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-background">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                  alt={isRTL ? "مهمتنا" : "Our Mission"} 
                  className="rounded-2xl shadow-md w-full object-cover aspect-video"
                />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                  {isRTL ? 'مهمتنا' : 'Our Mission'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {isRTL
                    ? 'في سند، مهمتنا هي جعل الرعاية الصحية النفسية متاحة وميسورة التكلفة وخالية من الوصمة للجميع. نحن نؤمن بأن كل شخص يستحق الدعم والموارد للتغلب على التحديات النفسية وتحقيق الرفاهية الشاملة.'
                    : 'At Sanad, our mission is to make mental health care accessible, affordable, and stigma-free for everyone. We believe that every person deserves the support and resources to overcome mental health challenges and achieve holistic well-being.'}
                </p>

                <h2 className="text-2xl md:text-3xl font-semibold mb-6 mt-10">
                  {isRTL ? 'رؤيتنا' : 'Our Vision'}
                </h2>
                <p className="text-muted-foreground">
                  {isRTL
                    ? 'نتصور عالمًا يكون فيه الوصول إلى الرعاية الصحية النفسية عالية الجودة حقًا أساسيًا، وحيث يمكن لكل شخص أن يزدهر عقليًا وعاطفيًا. نحن نسعى جاهدين لبناء مجتمع داعم حيث تتم معالجة التحديات النفسية بالتعاطف والفهم والرعاية الخبيرة.'
                    : 'We envision a world where access to high-quality mental health care is a fundamental right, and where every person can thrive mentally and emotionally. We strive to build a supportive community where mental health challenges are addressed with compassion, understanding, and expert care.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-secondary/5">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
              {isRTL ? 'قيمنا الأساسية' : 'Our Core Values'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: isRTL ? 'التعاطف' : 'Compassion',
                  description: isRTL 
                    ? 'نتعامل مع كل شخص بالرعاية والتفهم والتعاطف، مدركين أن كل رحلة صحية نفسية هي فريدة من نوعها.'
                    : 'We treat each person with care, understanding, and empathy, recognizing that every mental health journey is unique.'
                },
                {
                  title: isRTL ? 'الوصول' : 'Accessibility',
                  description: isRTL 
                    ? 'نسعى جاهدين لإزالة الحواجز أمام الرعاية الصحية النفسية، سواء كانت مالية أو جغرافية أو ثقافية.'
                    : 'We strive to remove barriers to mental health care, whether they are financial, geographical, or cultural.'
                },
                {
                  title: isRTL ? 'التميز' : 'Excellence',
                  description: isRTL 
                    ? 'نلتزم بتقديم خدمات ذات جودة عالية وممارسات قائمة على الأدلة وتجربة مستخدم استثنائية.'
                    : 'We are committed to delivering high-quality services, evidence-based practices, and an exceptional user experience.'
                },
                {
                  title: isRTL ? 'الشمولية' : 'Inclusivity',
                  description: isRTL 
                    ? 'نرحب بالأشخاص من جميع الخلفيات والهويات والتجارب، ونؤمن بالمساواة في الرعاية للجميع.'
                    : 'We welcome people of all backgrounds, identities, and experiences, believing in equitable care for all.'
                },
                {
                  title: isRTL ? 'مكافحة الوصم' : 'Anti-Stigma',
                  description: isRTL 
                    ? 'نعمل بنشاط على مكافحة الوصم المحيط بالصحة النفسية من خلال التعليم والتوعية والمناصرة.'
                    : 'We actively work against the stigma surrounding mental health through education, awareness, and advocacy.'
                },
                {
                  title: isRTL ? 'التمكين' : 'Empowerment',
                  description: isRTL 
                    ? 'نهدف إلى تمكين الأفراد بالمعرفة والأدوات والدعم ليكونوا مشاركين نشطين في رحلتهم نحو العافية.'
                    : 'We aim to empower individuals with knowledge, tools, and support to be active participants in their wellness journey.'
                },
              ].map((value, index) => (
                <div key={index} className="bg-background p-6 rounded-xl shadow-sm border">
                  <h3 className="text-xl font-medium mb-3 text-primary">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-background">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
              {isRTL ? 'فريقنا' : 'Our Team'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: isRTL ? 'م. مصطفى هاشم' : 'Eng. Mustafa Hashim',
                  role: isRTL ? 'الرئيس التنفيذي & مهندس برمجيات' : 'CEO & Software Engineer',
                  bio: isRTL 
                    ? 'خريج هندسة البرمجيات جامعة السودان للعلوم والتكنولوجيا.'
                    : 'Graduate in Software Engineering, Sudan University of Science and Technology.',
                  image: mustafaImage
                },
                {
                  name: isRTL ? 'م. عمر عباس' : 'Eng. Omar Abbas',
                  role: isRTL ? 'نائب الرئيس التنفيذي & مهندس برمجيات' : 'EVP & Software Engineer',
                  bio: isRTL 
                    ? 'خريج هندسة البرمجيات جامعة السودان للعلوم والتكنولوجيا.'
                    : 'Graduate in Software Engineering, Sudan University of Science and Technology.',
                  image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a'
                },
                {
                  name: isRTL ? 'م. عمر محجوب' : 'Eng. Omar Mahgoub',
                  role: isRTL ? 'المؤسس & مهندس برمجيات' : 'Founder & Software Engineer',
                  bio: isRTL 
                    ? 'خريج هندسة البرمجيات جامعة السودان للعلوم والتكنولوجيا.'
                    : 'Graduate in Software Engineering, Sudan University of Science and Technology.',
                  image: omerMahgoubImage
                },
                {
                  name: isRTL ? 'م. رمزي محمد' : 'Eng. Ramzi Mohamed',
                  role: isRTL ? 'مهندس برمجيات' : 'Software Engineer',
                  bio: isRTL 
                    ? 'خريج هندسة البرمجيات جامعة السودان للعلوم والتكنولوجيا.'
                    : 'Graduate in Software Engineering, Sudan University of Science and Technology.',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
                },
                {
                  name: isRTL ? 'نور الهاشمي' : 'Noor Al-Hashimi',
                  role: isRTL ? 'أخصائية اجتماعية' : 'Social Worker',
                  bio: isRTL 
                    ? 'مكرسة لمساعدة الأفراد في التنقل في تحديات الحياة والعثور على موارد دعم مجتمعية.'
                    : 'Dedicated to helping individuals navigate life challenges and find community support resources.',
                  image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df'
                },
                {
                  name: isRTL ? 'فيصل العمري' : 'Faisal Al-Omari',
                  role: isRTL ? 'مدير التكنولوجيا' : 'Technology Director',
                  bio: isRTL 
                    ? 'يقود تطوير منصتنا الرقمية لجعل الرعاية الصحية النفسية أكثر سهولة وإمكانية الوصول إليها.'
                    : 'Leads the development of our digital platform to make mental health care easier and more accessible.',
                  image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7'
                }
              ].map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4">
                  <div className="h-40 w-40 rounded-full overflow-hidden mb-4">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium">{member.name}</h3>
                  <p className="text-primary mb-2">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-secondary/5">
          <div className="container-custom max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
              {isRTL ? 'تواصل معنا' : 'Get in Touch'}
            </h2>
            <div className="bg-background p-8 rounded-xl shadow-sm border">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium mb-4">
                    {isRTL ? 'معلومات الاتصال' : 'Contact Information'}
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>sanadmentalcare@gmail.com</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+249 99 141 XXXX</span>
                    </li>
                    {/* Address for future use
                      <li className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>
                          {isRTL 
                            ? ''
                            : ''}
                        </span>
                      </li>
                      */}
                  </ul>
                  
                  <Separator className="my-6" />

                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4">
                    {isRTL ? 'أرسل لنا رسالة' : 'Send Us a Message'}
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {isRTL ? 'الاسم' : 'Name'}
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border rounded-md bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {isRTL ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-2 border rounded-md bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {isRTL ? 'الرسالة' : 'Message'}
                      </label>
                      <textarea 
                        className="w-full px-4 py-2 border rounded-md bg-background min-h-[120px]"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md transition-colors"
                    >
                      {isRTL ? 'إرسال' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
