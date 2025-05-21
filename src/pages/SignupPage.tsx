
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
});

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
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
          });

        if (expertError) {
          console.error("Error creating expert profile:", expertError);
        }

        toast.success("تم إنشاء الحساب بنجاح!");
        navigate("/expert-profile");
      }
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-md rounded-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              إنشاء حساب خبير جديد
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              قم بتسجيل بياناتك للانضمام إلى منصة الخبراء
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الأول</FormLabel>
                      <FormControl>
                        <Input placeholder="الاسم الأول" {...field} />
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
                        <Input placeholder="الاسم الأخير" {...field} />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "جاري التسجيل..." : "تسجيل"}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p className="text-sm">
              لديك حساب بالفعل؟{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                تسجيل الدخول
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
