
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";
const TermsOfService = () => {
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
            {isRTL ? 'شروط الخدمة' : 'Terms of Service'}
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'آخر تحديث' : 'Last Updated'}
              </h2>
              <p className="text-muted-foreground">
                {isRTL ? 'تم آخر تحديث لهذه الشروط في مايو 2025' : 'These Terms of Service were last updated in May 2025'}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'قبول الشروط' : 'Acceptance of Terms'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'باستخدام خدمات سند، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا.'
                  : 'By using Sanad services, you agree to be bound by these Terms and Conditions. If you do not agree to any of these terms, please do not use our services.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'وصف الخدمات' : 'Service Description'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'سند منصة للصحة النفسية تقدم خدمات العلاج النفسي عبر الإنترنت، والاستشارات، والموارد التعليمية. خدماتنا مخصصة للأغراض التعليمية والعلاجية فقط وليست بديلاً عن الرعاية الطبية الطارئة.'
                  : 'Sanad is a mental health platform that provides online therapy services, consultations, and educational resources. Our services are intended for educational and therapeutic purposes only and are not a substitute for emergency medical care.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'الأهلية للاستخدام' : 'Eligibility'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{isRTL ? 'يجب أن تكون 18 سنة أو أكبر لاستخدام خدماتنا' : 'You must be 18 years or older to use our services'}</li>
                <li>{isRTL ? 'يجب تقديم معلومات دقيقة وصحيحة عند التسجيل' : 'You must provide accurate and truthful information when registering'}</li>
                <li>{isRTL ? 'يجب أن تكون مقيماً في منطقة نقدم فيها خدماتنا' : 'You must be a resident of an area where we provide our services'}</li>
                <li>{isRTL ? 'يحق لنا رفض الخدمة لأي شخص لأي سبب' : 'We reserve the right to refuse service to anyone for any reason'}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'مسؤوليات المستخدم' : 'User Responsibilities'}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isRTL ? 'السلوك المناسب' : 'Appropriate Conduct'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRTL 
                      ? 'يتوقع منك استخدام منصتنا بطريقة محترمة ومناسبة. يُحظر السلوك المسيء أو التحرش أو التهديد.'
                      : 'You are expected to use our platform in a respectful and appropriate manner. Abusive, harassing, or threatening behavior is prohibited.'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    {isRTL ? 'دقة المعلومات' : 'Information Accuracy'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRTL 
                      ? 'يجب تقديم معلومات دقيقة وحديثة عن حالتك الصحية والطبية لضمان تقديم أفضل رعاية ممكنة.'
                      : 'You must provide accurate and up-to-date information about your health and medical condition to ensure the best possible care.'
                    }
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'الرسوم والمدفوعات' : 'Fees and Payments'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>{isRTL ? 'جميع الرسوم مستحقة الدفع مقدماً ما لم يُنص على خلاف ذلك' : 'All fees are due in advance unless otherwise specified'}</li>
                <li>{isRTL ? 'قد تتغير الأسعار بإشعار مسبق 30 يوماً' : 'Prices may change with 30 days advance notice'}</li>
                <li>{isRTL ? 'المبالغ المدفوعة غير قابلة للاسترداد إلا في ظروف استثنائية' : 'Payments are non-refundable except under exceptional circumstances'}</li>
                <li>{isRTL ? 'قد تطبق رسوم إضافية على الإلغاءات المتأخرة' : 'Late cancellation fees may apply'}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'السرية والخصوصية' : 'Confidentiality and Privacy'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'نحن ملتزمون بحماية خصوصيتك وسرية معلوماتك الطبية وفقاً للقوانين المعمول بها ومعايير الممارسة المهنية. لمزيد من التفاصيل، راجع سياسة الخصوصية الخاصة بنا.'
                  : 'We are committed to protecting your privacy and the confidentiality of your medical information in accordance with applicable laws and professional practice standards. For more details, please review our Privacy Policy.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'إنهاء الخدمة' : 'Service Termination'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'يحق لأي من الطرفين إنهاء العلاقة العلاجية في أي وقت. في حالة الإنهاء، سنقدم المساعدة في إيجاد مقدم رعاية بديل إذا أمكن ذلك.'
                  : 'Either party may terminate the therapeutic relationship at any time. In case of termination, we will assist in finding alternative care providers when possible.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'حالات الطوارئ' : 'Emergency Situations'}
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">
                  {isRTL ? 'تنبيه مهم:' : 'Important Notice:'}
                </p>
                <p className="text-red-700 mt-2">
                  {isRTL 
                    ? 'خدماتنا ليست مخصصة للحالات الطارئة. في حالة الطوارئ النفسية أو الأفكار الانتحارية، اتصل بخدمات الطوارئ المحلية فوراً أو اذهب إلى أقرب مستشفى.'
                    : 'Our services are not intended for emergency situations. In case of mental health emergencies or suicidal thoughts, contact local emergency services immediately or go to the nearest hospital.'
                  }
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'إخلاء المسؤولية' : 'Disclaimer'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'تُقدم خدماتنا "كما هي" دون أي ضمانات صريحة أو ضمنية. لا نضمن نتائج محددة من العلاج أو الاستشارة.'
                  : 'Our services are provided "as is" without any express or implied warranties. We do not guarantee specific outcomes from therapy or consultation.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'تعديل الشروط' : 'Modification of Terms'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو عبر المنصة.'
                  : 'We reserve the right to modify these terms at any time. You will be notified of any material changes via email or through the platform.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'القانون المعمول به' : 'Governing Law'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'تخضع هذه الشروط للقوانين المحلية المعمول بها، وأي نزاعات ستُحل وفقاً للإجراءات القانونية المناسبة.'
                  : 'These terms are governed by applicable local laws, and any disputes will be resolved according to appropriate legal procedures.'
                }
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {isRTL ? 'معلومات الاتصال' : 'Contact Information'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'للأسئلة حول شروط الخدمة هذه، يرجى التواصل معنا:'
                  : 'For questions about these Terms of Service, please contact us:'
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

export default TermsOfService;
