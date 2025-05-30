
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

const PrivacyPolicy = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container-custom py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'آخر تحديث' : 'Last Updated'}
              </h2>
              <p className="text-muted-foreground">
                {isRTL ? 'تم آخر تحديث لهذه السياسة في مايو 2025' : 'This Privacy Policy was last updated in May 2025'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'مقدمة' : 'Introduction'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'مرحباً بك في سند. نحن ملتزمون بحماية خصوصيتك وضمان أمان معلوماتك الشخصية. تشرح هذه السياسة كيف نجمع ونستخدم ونحمي المعلومات التي تقدمها لنا عند استخدام خدماتنا للصحة النفسية.'
                  : 'Welcome to Sanad. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and protect the information you provide when using our mental health services.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'المعلومات التي نجمعها' : 'Information We Collect'}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRTL 
                      ? 'نجمع المعلومات التي تقدمها طوعاً، مثل: الاسم، البريد الإلكتروني، رقم الهاتف، تاريخ الميلاد، والمعلومات الطبية ذات الصلة بصحتك النفسية.'
                      : 'We collect information you voluntarily provide, such as: name, email address, phone number, date of birth, and medical information relevant to your mental health.'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isRTL ? 'معلومات الاستخدام' : 'Usage Information'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRTL 
                      ? 'نجمع معلومات حول كيفية استخدامك لموقعنا وخدماتنا، بما في ذلك عنوان IP، نوع المتصفح، وأوقات الوصول.'
                      : 'We collect information about how you use our website and services, including IP address, browser type, and access times.'
                    }
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'كيف نستخدم معلوماتك' : 'How We Use Your Information'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{isRTL ? 'تقديم الخدمات النفسية والعلاجية' : 'Providing mental health and therapeutic services'}</li>
                <li>{isRTL ? 'جدولة المواعيد والتواصل معك' : 'Scheduling appointments and communicating with you'}</li>
                <li>{isRTL ? 'تحسين خدماتنا وتجربة المستخدم' : 'Improving our services and user experience'}</li>
                <li>{isRTL ? 'الامتثال للمتطلبات القانونية والتنظيمية' : 'Complying with legal and regulatory requirements'}</li>
                <li>{isRTL ? 'إرسال تحديثات مهمة حول الخدمة' : 'Sending important service updates'}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'حماية المعلومات' : 'Information Protection'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'نتخذ إجراءات أمنية صارمة لحماية معلوماتك الشخصية، بما في ذلك التشفير، والوصول المحدود، والمراقبة المستمرة لأنظمتنا. جميع البيانات الطبية محمية وفقاً للمعايير الدولية للخصوصية الطبية.'
                  : 'We implement strict security measures to protect your personal information, including encryption, limited access, and continuous monitoring of our systems. All medical data is protected according to international medical privacy standards.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'مشاركة المعلومات' : 'Information Sharing'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية: بموافقتك الصريحة، لتقديم الخدمات المطلوبة، أو عند الضرورة القانونية.'
                  : 'We do not sell, rent, or share your personal information with third parties except in the following cases: with your explicit consent, to provide requested services, or when legally required.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'حقوقك' : 'Your Rights'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{isRTL ? 'الوصول إلى معلوماتك الشخصية' : 'Access to your personal information'}</li>
                <li>{isRTL ? 'تصحيح أو تحديث المعلومات' : 'Correcting or updating information'}</li>
                <li>{isRTL ? 'حذف معلوماتك (في حدود القانون)' : 'Deleting your information (within legal limits)'}</li>
                <li>{isRTL ? 'الانسحاب من التسويق' : 'Opting out of marketing communications'}</li>
                <li>{isRTL ? 'نقل بياناتك' : 'Transferring your data'}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'ملفات تعريف الارتباط' : 'Cookies'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربة استخدام الموقع وتذكر تفضيلاتك. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.'
                  : 'We use cookies to improve your website experience and remember your preferences. You can control cookie settings through your browser.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'التغييرات على هذه السياسة' : 'Changes to This Policy'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'قد نقوم بتحديث هذه السياسة من وقت لآخر. سنقوم بإشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على موقعنا.'
                  : 'We may update this policy from time to time. We will notify you of any material changes via email or a notice on our website.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'اتصل بنا' : 'Contact Us'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'إذا كانت لديك أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا على:'
                  : 'If you have questions about this Privacy Policy, please contact us at:'
                }
              </p>
              <div className="mt-4 space-y-2 text-muted-foreground">
                <p>{isRTL ? 'البريد الإلكتروني:' : 'Email:'} sanadmentalcare@gmail.com</p>
                <p>{isRTL ? 'الهاتف:' : 'Phone:'} +249 99 141 XXXX</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
