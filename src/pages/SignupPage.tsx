
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, CheckCircle } from "lucide-react";

const signupSchema = z.object({
  firstName: z.string().min(2, {
    message: "الاسم الأول يجب أن يحتوي على حرفين على الأقل",
  }),
  lastName: z.string().min(2, {
    message: "الاسم الأخير يجب أن يحتوي على حرفين على الأقل",
  }),
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح",
  }),
  password: z.string().min(8, {
    message: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل",
  }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "يجب الموافقة على الشروط والأحكام للمتابعة"
  }),
});

const expertQuizSchema = z.object({
  answer1: z.string().min(1, {
    message: "الرجاء اختيار إجابة",
  }),
  answer2: z.string().min(1, {
    message: "الرجاء اختيار إجابة",
  }),
  answer3: z.string().min(1, {
    message: "الرجاء اختيار إجابة",
  }),
});

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"quiz" | "register">("quiz");
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      agreeToTerms: false,
    },
  });

  const quizForm = useForm<z.infer<typeof expertQuizSchema>>({
    resolver: zodResolver(expertQuizSchema),
    defaultValues: {
      answer1: "",
      answer2: "",
      answer3: "",
    },
  });

  const correctAnswers = {
    answer1: "c",
    answer2: "b",
    answer3: "a",
  };

  const handleQuizSubmit = (values: z.infer<typeof expertQuizSchema>) => {
    let score = 0;
    
    if (values.answer1 === correctAnswers.answer1) score++;
    if (values.answer2 === correctAnswers.answer2) score++;
    if (values.answer3 === correctAnswers.answer3) score++;
    
    setQuizScore(score);
    
    if (score >= 2) {
      setQuizPassed(true);
      setCurrentStep("register");
      toast.success("تهانينا! لقد اجتزت اختبار المعرفة بنجاح");
    } else {
      toast.error("للأسف، لم تحصل على العلامة المطلوبة. الرجاء المحاولة مرة أخرى");
    }
  };

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    if (!quizPassed) {
      toast.error("يجب اجتياز الاختبار أولاً قبل التسجيل");
      setCurrentStep("quiz");
      return;
    }
    
    setIsLoading(true);
    try {
      // إنشاء المستخدم في Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            quiz_score: quizScore,
            certification_status: "pending"
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // إنشاء ملف خبير أولي
        const { error: expertError } = await supabase
          .from("experts")
          .insert({
            user_id: data.user.id,
            first_name: values.firstName,
            last_name: values.lastName,
            title: "خبير جديد", // عنوان افتراضي يمكن تعديله لاحقًا
            verified: false
          });

        if (expertError) {
          console.error("Error creating expert profile:", expertError);
          // Even if there's an error creating the expert profile, we'll still show success
          // as the user account was created
        }

        toast.success("تم إنشاء الحساب بنجاح! الآن يمكنك الحصول على الاعتماد من خلال دفع رسوم الاشتراك السنوي");
        navigate("/expert-profile");
      }
    } catch (error: any) {
      console.error("Error during signup:", error);
      const errorMessage = error.message || "حدث خطأ أثناء إنشاء الحساب";
      
      // Handle specific error cases
      if (error.message.includes("already registered")) {
        toast.error("هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {currentStep === "quiz" ? "اختبار المعرفة" : "إنشاء حساب خبير جديد"}
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              {currentStep === "quiz" 
                ? "أجب على الأسئلة التالية لإثبات معرفتك في مجال تخصصك" 
                : "قم بتسجيل بياناتك للانضمام إلى منصة الخبراء"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === "quiz" ? (
              <Form {...quizForm}>
                <form onSubmit={quizForm.handleSubmit(handleQuizSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">1. ما هي الطريقة المثلى لتقديم الاستشارات المهنية؟</h3>
                      <div className="space-y-1">
                        <label className="flex items-center space-x-3 space-x-reverse">
                          <input 
                            type="radio" 
                            value="a" 
                            {...quizForm.register("answer1")} 
                            className="text-primary"
                          />
                          <span>أ. تقديم رأي مباشر بدون تحليل</span>
                        </label>
                        <label className="flex items-center space-x-3 space-x-reverse">
                          <input 
                            type="radio" 
                            value="b" 
                            {...quizForm.register("answer1")}
                            className="text-primary" 
                          />
                          <span>ب. الاعتماد فقط على الخبرة الشخصية</span>
                        </label>
                        <label className="flex items-center space-x-3 space-x-reverse">
                          <input 
                            type="radio" 
                            value="c" 
                            {...quizForm.register("answer1")}
                            className="text-primary" 
                          />
                          <span>ج. تحليل الوضع بشكل شامل وتقديم خيارات متعددة</span>
                        </label>
                      </div>
                      {quizForm.formState.errors.answer1 && (
                        <p className="text-red-500 text-sm">{quizForm.formState.errors.answer1.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">2. ما هي أفضل ممارسة لحماية بيانات العملاء؟</h3>
                      <div className="space-y-1">
                        <label className="flex items-center space-x-3 space-x-reverse">
                          <input 
                            type="radio" 
                            value="a" 
                            {...quizForm.register("answer2")}
                            className="text-primary" 
                          />
                          <span>أ. مشاركتها مع شركاء العمل</span>
                        </label>
                        <label className="flex items-center space-x-3 space-x-reverse">
                          <input 
                            type="radio" 
                            value="b" 
                            {...quizForm.register("answer2")}
                            className="text-primary" 
                          />
                          <span>ب. تطبيق إجراءات حماية البيانات وسياسات الخصوصية</span>
                        </label>
                        <label className="flex items-center space-x-3 space-x-reverse">
                          <input 
                            type="radio" 
                            value="c" 
                            {...quizForm.register("answer2")}
                            className="text-primary" 
                          />
                          <span>ج. تخزينها في مكان يسهل الوصول إليه</span>
                        </label>
                      </div>
                      {quizForm.formState.errors.answer2 && (
                        <p className="text-red-500 text-sm">{quizForm.formState.errors.answer2.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">3. كيف يمكن تحسين الكفاءة في العمل الاستشاري؟</h3>
                      <div className="space-y-1">
                        <label className="flex items-center space-x-3 space-x-reverse">
                          <input 
                            type="radio" 
                            value="a" 
                            {...quizForm.register("answer3")}
                            className="text-primary" 
                          />
                          <span>أ. استخدام أدوات وتقنيات مناسبة وتطوير المهارات باستمرار</span>
                        </label>
                        <label className="flex items-center space-x-3 space-x-reverse">
                          <input 
                            type="radio" 
                            value="b" 
                            {...quizForm.register("answer3")}
                            className="text-primary" 
                          />
                          <span>ب. العمل لساعات أطول</span>
                        </label>
                        <label className="flex items-center space-x-3 space-x-reverse">
                          <input 
                            type="radio" 
                            value="c" 
                            {...quizForm.register("answer3")}
                            className="text-primary" 
                          />
                          <span>ج. زيادة عدد العملاء بغض النظر عن جودة الخدمة</span>
                        </label>
                      </div>
                      {quizForm.formState.errors.answer3 && (
                        <p className="text-red-500 text-sm">{quizForm.formState.errors.answer3.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                    disabled={quizForm.formState.isSubmitting}
                  >
                    {quizForm.formState.isSubmitting ? "جاري التحقق..." : "إرسال الإجابات"}
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="bg-slate-800 p-3 rounded-lg mb-4 flex items-center">
                    <CheckCircle className="text-green-500 h-5 w-5 ml-2" />
                    <div>
                      <p className="text-sm font-medium">تم اجتياز الاختبار بنجاح</p>
                      <p className="text-xs text-slate-400">النتيجة: {quizScore}/3</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الأول</FormLabel>
                          <FormControl>
                            <Input placeholder="الاسم الأول" {...field} 
                              className="bg-slate-800 border-slate-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الأخير</FormLabel>
                          <FormControl>
                            <Input placeholder="الاسم الأخير" {...field} 
                              className="bg-slate-800 border-slate-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            {...field}
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            أوافق على الشروط والأحكام وسياسة الخصوصية
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">بعد التسجيل، ستتمكن من:</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="text-primary h-4 w-4 ml-2" />
                        <span>إكمال ملف الخبير الخاص بك</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-primary h-4 w-4 ml-2" />
                        <span>الحصول على شهادة MCP بعد دفع الاشتراك السنوي</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-primary h-4 w-4 ml-2" />
                        <span>الوصول إلى طلبات الاستشارة من العملاء</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري التسجيل..." : "إنشاء الحساب"}
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center w-full">
              <p className="text-sm text-slate-400">
                لديك حساب بالفعل؟{" "}
                <a
                  href="/login"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  تسجيل الدخول
                </a>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
