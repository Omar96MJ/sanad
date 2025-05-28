
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";

const CookiePolicy = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen flex flex-col bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {isRTL ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy'}
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'آخر تحديث' : 'Last Updated'}
              </h2>
              <p className="text-muted-foreground">
                {isRTL ? 'تم آخر تحديث لسياسة ملفات تعريف الارتباط في يناير 2024' : 'This Cookie Policy was last updated in January 2024'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'ما هي ملفات تعريف الارتباط؟' : 'What are Cookies?'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'ملفات تعريف الارتباط (الكوكيز) هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة موقعنا الإلكتروني. تساعدنا هذه الملفات في تحسين تجربتك وتقديم خدمات أفضل.'
                  : 'Cookies are small text files that are stored on your device when you visit our website. These files help us improve your experience and provide better services.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'أنواع ملفات تعريف الارتباط التي نستخدمها' : 'Types of Cookies We Use'}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">
                    {isRTL ? 'ملفات تعريف الارتباط الضرورية' : 'Essential Cookies'}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {isRTL 
                      ? 'هذه الملفات ضرورية لعمل موقعنا بشكل صحيح:'
                      : 'These cookies are essential for our website to function properly:'
                    }
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>{isRTL ? 'ملفات تعريف جلسة المستخدم والتوثيق' : 'User session and authentication cookies'}</li>
                    <li>{isRTL ? 'ملفات تعريف إعدادات الأمان' : 'Security settings cookies'}</li>
                    <li>{isRTL ? 'ملفات تعريف تفضيلات اللغة' : 'Language preference cookies'}</li>
                    <li>{isRTL ? 'ملفات تعريف إعدادات الموقع' : 'Site settings cookies'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">
                    {isRTL ? 'ملفات تعريف الارتباط الوظيفية' : 'Functional Cookies'}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {isRTL 
                      ? 'تساعد هذه الملفات في تحسين وظائف الموقع:'
                      : 'These cookies help improve website functionality:'
                    }
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>{isRTL ? 'تذكر تفضيلات المستخدم' : 'Remember user preferences'}</li>
                    <li>{isRTL ? 'حفظ إعدادات المظهر (فاتح/داكن)' : 'Save theme settings (light/dark)'}</li>
                    <li>{isRTL ? 'تخزين اختيارات اللغة' : 'Store language choices'}</li>
                    <li>{isRTL ? 'تحسين تجربة التنقل' : 'Improve navigation experience'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">
                    {isRTL ? 'ملفات تعريف الارتباط التحليلية' : 'Analytics Cookies'}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {isRTL 
                      ? 'تساعدنا في فهم كيفية استخدام الموقع:'
                      : 'Help us understand how the website is used:'
                    }
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>{isRTL ? 'إحصائيات الزيارات' : 'Visit statistics'}</li>
                    <li>{isRTL ? 'تحليل سلوك المستخدمين' : 'User behavior analysis'}</li>
                    <li>{isRTL ? 'قياس أداء الموقع' : 'Website performance measurement'}</li>
                    <li>{isRTL ? 'تحديد المحتوى الأكثر شعبية' : 'Identify popular content'}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'كيف نستخدم ملفات تعريف الارتباط' : 'How We Use Cookies'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{isRTL ? 'تحسين أداء وسرعة الموقع' : 'Improve website performance and speed'}</li>
                <li>{isRTL ? 'تذكر تسجيل دخولك وإعداداتك' : 'Remember your login and settings'}</li>
                <li>{isRTL ? 'تخصيص المحتوى حسب تفضيلاتك' : 'Customize content based on your preferences'}</li>
                <li>{isRTL ? 'توفير خدمات أمان محسنة' : 'Provide enhanced security features'}</li>
                <li>{isRTL ? 'تحليل استخدام الموقع لتحسين خدماتنا' : 'Analyze website usage to improve our services'}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'مدة الاحتفاظ بملفات تعريف الارتباط' : 'Cookie Retention Period'}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {isRTL ? 'ملفات تعريف الجلسة' : 'Session Cookies'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRTL 
                      ? 'تُحذف تلقائياً عند إغلاق المتصفح'
                      : 'Deleted automatically when you close your browser'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {isRTL ? 'ملفات تعريف دائمة' : 'Persistent Cookies'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRTL 
                      ? 'تبقى لفترة محددة (عادة من 30 يوماً إلى سنة واحدة)'
                      : 'Remain for a specified period (typically 30 days to 1 year)'
                    }
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'إدارة ملفات تعريف الارتباط' : 'Managing Cookies'}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {isRTL 
                  ? 'يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك:'
                  : 'You can control cookies through your browser settings:'
                }
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{isRTL ? 'قبول أو رفض ملفات تعريف الارتباط' : 'Accept or reject cookies'}</li>
                <li>{isRTL ? 'حذف ملفات تعريف الارتباط المحفوظة' : 'Delete saved cookies'}</li>
                <li>{isRTL ? 'تعيين إشعارات عند تلقي ملفات تعريف ارتباط جديدة' : 'Set notifications when receiving new cookies'}</li>
                <li>{isRTL ? 'منع مواقع معينة من تخزين ملفات تعريف الارتباط' : 'Block specific sites from storing cookies'}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'إرشادات المتصفحات الشائعة' : 'Common Browser Instructions'}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Google Chrome</h3>
                  <p className="text-muted-foreground">
                    {isRTL 
                      ? 'الإعدادات > الخصوصية والأمان > ملفات تعريف الارتباط وبيانات الموقع الأخرى'
                      : 'Settings > Privacy and Security > Cookies and other site data'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Mozilla Firefox</h3>
                  <p className="text-muted-foreground">
                    {isRTL 
                      ? 'الخيارات > الخصوصية والأمان > ملفات تعريف الارتباط وبيانات الموقع'
                      : 'Options > Privacy & Security > Cookies and Site Data'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Safari</h3>
                  <p className="text-muted-foreground">
                    {isRTL 
                      ? 'التفضيلات > الخصوصية > إدارة بيانات الموقع'
                      : 'Preferences > Privacy > Manage Website Data'
                    }
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'تأثير تعطيل ملفات تعريف الارتباط' : 'Impact of Disabling Cookies'}
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium mb-2">
                  {isRTL ? 'تنبيه:' : 'Notice:'}
                </p>
                <p className="text-yellow-700">
                  {isRTL 
                    ? 'تعطيل ملفات تعريف الارتباط قد يؤثر على وظائف الموقع، مثل تسجيل الدخول، حفظ التفضيلات، وتذكر إعداداتك.'
                    : 'Disabling cookies may affect website functionality, such as login, saving preferences, and remembering your settings.'
                  }
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'ملفات تعريف الارتباط من طرف ثالث' : 'Third-Party Cookies'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'قد نستخدم خدمات من أطراف ثالثة موثوقة (مثل خدمات التحليلات) التي قد تضع ملفات تعريف ارتباط خاصة بها. نحن لا نتحكم في هذه الملفات وتخضع لسياساتهم الخاصة.'
                  : 'We may use trusted third-party services (such as analytics services) that may place their own cookies. We do not control these cookies and they are subject to their own policies.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'تحديثات السياسة' : 'Policy Updates'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'قد نقوم بتحديث سياسة ملفات تعريف الارتباط من وقت لآخر. سيتم إشعارك بأي تغييرات مهمة عبر الموقع أو البريد الإلكتروني.'
                  : 'We may update this Cookie Policy from time to time. You will be notified of any significant changes through the website or email.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'اتصل بنا' : 'Contact Us'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'للأسئلة حول سياسة ملفات تعريف الارتباط، يرجى التواصل معنا:'
                  : 'For questions about this Cookie Policy, please contact us:'
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

export default CookiePolicy;
