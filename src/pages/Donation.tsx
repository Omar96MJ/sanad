
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, CreditCard, Landmark, WalletCards, Smartphone, Copy } from "lucide-react";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Donation = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const { toast } = useToast();
  
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  
  const predefinedAmounts = ['10', '25', '50', '100', '250'];
  
  const handleAmountSelect = (value: string) => {
    setAmount(value);
    setCustomAmount('');
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setAmount('custom');
    }
  };
  
  const handleCopyBankInfo = () => {
    navigator.clipboard.writeText('IBAN: SA0380000000123456789012');
    toast({
      title: isRTL ? 'تم النسخ' : 'Copied',
      description: isRTL ? 'تم نسخ معلومات الحساب البنكي' : 'Bank information copied to clipboard',
    });
  };
  
  const handleDonate = () => {
    const donationAmount = amount === 'custom' ? customAmount : amount;
    // In a real app, this would process the payment or redirect to a payment gateway
    toast({
      title: isRTL ? 'شكراً لدعمك' : 'Thank you for your support',
      description: isRTL 
        ? `تم استلام تبرعك بمبلغ $${donationAmount}. سيتم إرسال إيصال إلى بريدك الإلكتروني.` 
        : `Your donation of $${donationAmount} has been received. A receipt will be sent to your email.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex-grow">
        <div className="container-custom py-12">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-red-100 text-red-600 rounded-full mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {isRTL ? 'تبرع لدعم الصحة النفسية' : 'Donate to Support Mental Health'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {isRTL 
                ? 'تبرعك يساعدنا في توفير الدعم النفسي لمن هم في أمس الحاجة إليه'
                : 'Your donation helps us provide mental health support to those who need it most'}
            </p>
          </div>
          
          {/* Donation Form */}
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isRTL ? 'تبرع الآن' : 'Donate Now'}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? 'اختر مبلغ التبرع وطريقة الدفع المفضلة لديك'
                    : 'Choose your donation amount and preferred payment method'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Donation Amount */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      {isRTL ? 'مبلغ التبرع' : 'Donation Amount'}
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                      {predefinedAmounts.map((value) => (
                        <Button
                          key={value}
                          type="button"
                          variant={amount === value ? "default" : "outline"}
                          onClick={() => handleAmountSelect(value)}
                          className="h-12"
                        >
                          ${value}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="mt-3">
                      <Label htmlFor="customAmount">
                        {isRTL ? 'مبلغ مخصص' : 'Custom Amount'}
                      </Label>
                      <div className="flex items-center mt-1">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            $
                          </div>
                          <Input
                            id="customAmount"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            className="pl-7"
                            placeholder={isRTL ? 'أدخل مبلغاً مخصصاً' : 'Enter custom amount'}
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="ml-2"
                          onClick={() => {
                            if (customAmount) {
                              setAmount('custom');
                            }
                          }}
                        >
                          {isRTL ? 'تأكيد' : 'Apply'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                    </h3>
                    
                    <Tabs defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
                      <TabsList className="grid grid-cols-4 mb-4">
                        <TabsTrigger value="card">
                          <CreditCard className="h-4 w-4 mr-2" />
                          {isRTL ? 'بطاقة' : 'Card'}
                        </TabsTrigger>
                        <TabsTrigger value="bank">
                          <Landmark className="h-4 w-4 mr-2" />
                          {isRTL ? 'تحويل بنكي' : 'Bank'}
                        </TabsTrigger>
                        <TabsTrigger value="paypal">
                          <WalletCards className="h-4 w-4 mr-2" />
                          PayPal
                        </TabsTrigger>
                        <TabsTrigger value="mobile">
                          <Smartphone className="h-4 w-4 mr-2" />
                          {isRTL ? 'جوال' : 'Mobile'}
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="card" className="space-y-4">
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="cardName">{isRTL ? 'الاسم على البطاقة' : 'Name on Card'}</Label>
                            <Input id="cardName" placeholder="John Smith" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cardNumber">{isRTL ? 'رقم البطاقة' : 'Card Number'}</Label>
                            <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="expiryDate">{isRTL ? 'تاريخ الإنتهاء' : 'Expiry Date'}</Label>
                              <Input id="expiryDate" placeholder="MM/YY" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="cvc">CVC</Label>
                              <Input id="cvc" placeholder="123" />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="bank">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div>
                                <Label>{isRTL ? 'اسم البنك' : 'Bank Name'}</Label>
                                <p className="text-sm mt-1">National Bank</p>
                              </div>
                              <div>
                                <Label>{isRTL ? 'اسم الحساب' : 'Account Name'}</Label>
                                <p className="text-sm mt-1">Mental Health Support Foundation</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>IBAN</Label>
                                  <p className="text-sm mt-1 font-mono">SA0380000000123456789012</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleCopyBankInfo}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  {isRTL ? 'نسخ' : 'Copy'}
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">
                                {isRTL 
                                  ? 'بعد إتمام التحويل، يرجى إرسال صورة من إيصال التحويل إلى info@mentalhealth.org'
                                  : 'After completing the transfer, please send a copy of the transfer receipt to info@mentalhealth.org'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="paypal">
                        <div className="text-center py-6">
                          <WalletCards className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                          <p className="mb-4">
                            {isRTL 
                              ? 'سيتم تحويلك إلى موقع PayPal لإتمام عملية التبرع'
                              : 'You will be redirected to PayPal to complete your donation'}
                          </p>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            {isRTL ? 'الدفع بواسطة PayPal' : 'Pay with PayPal'}
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="mobile">
                        <RadioGroup defaultValue="apple" className="grid grid-cols-3 gap-4">
                          <div>
                            <RadioGroupItem value="apple" id="apple" className="peer sr-only" />
                            <Label
                              htmlFor="apple"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple mb-3"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 5" /></svg>
                              <div className="text-center">Apple Pay</div>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="google" id="google" className="peer sr-only" />
                            <Label
                              htmlFor="google"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone mb-3"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                              <div className="text-center">Google Pay</div>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="samsung" id="samsung" className="peer sr-only" />
                            <Label
                              htmlFor="samsung"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-waypoints mb-3"><circle cx="12" cy="4.5" r="2.5" /><path d="m10.2 6.3-3.9 3.9" /><circle cx="4.5" cy="12" r="2.5" /><path d="M7.4 15.7 6.3 14.6" /><circle cx="12" cy="19.5" r="2.5" /><path d="m13.8 17.7 3.9-3.9" /><circle cx="19.5" cy="12" r="2.5" /><path d="M16.6 8.3 17.7 9.4" /></svg>
                              <div className="text-center">Samsung Pay</div>
                            </Label>
                          </div>
                        </RadioGroup>
                        <div className="mt-4 text-center">
                          <Button className="w-full">
                            {isRTL ? 'متابعة الدفع' : 'Continue to Payment'}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={handleDonate} 
                  className="w-full" 
                  size="lg"
                  disabled={!amount || (amount === 'custom' && !customAmount)}
                >
                  {isRTL ? 'تبرع الآن' : 'Donate Now'}
                  <Heart className="ml-2" size={16} />
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p className="mb-2">
                {isRTL 
                  ? 'جميع التبرعات آمنة ومشفرة'
                  : 'All donations are secure and encrypted'}
              </p>
              <p>
                {isRTL 
                  ? 'المؤسسة مسجلة كمنظمة غير ربحية، جميع التبرعات معفاة من الضرائب'
                  : 'Our organization is registered as a non-profit, all donations are tax-deductible'}
              </p>
            </div>
          </div>
          
          {/* Impact Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-6">
              {isRTL ? 'تأثير تبرعك' : 'The Impact of Your Donation'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {isRTL ? '$25' : '$25'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    {isRTL 
                      ? 'يوفر ساعة من الاستشارة النفسية لشخص لا يستطيع تحمل تكلفتها'
                      : 'Provides one hour of counseling to someone who cannot afford it'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {isRTL ? '$100' : '$100'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    {isRTL 
                      ? 'يدعم برنامج توعية في المدارس حول الصحة النفسية'
                      : 'Supports a school outreach program about mental health awareness'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {isRTL ? '$250' : '$250'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center">
                    {isRTL 
                      ? 'يساعد في تدريب متطوع لخط المساعدة في الأزمات'
                      : 'Helps train a crisis helpline volunteer'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Donation;
