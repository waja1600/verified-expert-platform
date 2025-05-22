
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LanguageSection from "./LanguageSection";
import SpecializationSection from "./SpecializationSection";

interface ExpertProfileFormProps {
  form: any;
  isLoading: boolean;
  expertId: string | null;
  userId: string | null;
}

const ExpertProfileForm = ({
  form,
  isLoading,
  expertId,
  userId
}: ExpertProfileFormProps) => {
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching countries:", error);
        return;
      }

      setCountries(data || []);
    };

    fetchCountries();
  }, []);

  const onSubmit = async (values: any) => {
    if (!expertId || !userId) {
      toast.error("لم يتم العثور على حساب الخبير");
      return;
    }

    try {
      // تحديث ملف الخبير
      const { error: updateError } = await supabase
        .from("experts")
        .update({
          title: values.title,
          bio: values.bio,
          country_id: values.country_id,
          hourly_rate: parseFloat(values.hourly_rate),
          years_experience: parseInt(values.years_experience)
        })
        .eq("id", expertId);

      if (updateError) {
        throw updateError;
      }

      // حذف اللغات السابقة
      await supabase
        .from("expert_languages")
        .delete()
        .eq("expert_id", expertId);

      // إضافة اللغات الجديدة
      const languagesData = values.languages.map((lang: any) => ({
        expert_id: expertId,
        language_id: lang.language_id,
        proficiency_level: lang.proficiency_level
      }));

      const { error: languagesError } = await supabase
        .from("expert_languages")
        .insert(languagesData);

      if (languagesError) {
        throw languagesError;
      }

      // حذف التخصصات السابقة
      await supabase
        .from("expert_specializations")
        .delete()
        .eq("expert_id", expertId);

      // إضافة التخصصات الجديدة
      const specializationsData = values.specializations.map((specId: string) => ({
        expert_id: expertId,
        specialization_id: specId
      }));

      const { error: specializationsError } = await supabase
        .from("expert_specializations")
        .insert(specializationsData);

      if (specializationsError) {
        throw specializationsError;
      }

      toast.success("تم تحديث ملف الخبير بنجاح!");
    } catch (error: any) {
      console.error("Error updating expert profile:", error);
      toast.error(error.message || "حدث خطأ أثناء تحديث الملف");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">المعلومات الأساسية</h2>
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عنوان الخبير المهني</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: مستشار مالي، مهندس برمجيات، محامي..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نبذة عني</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="اكتب نبذة مختصرة عن خبراتك ومؤهلاتك..."
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البلد</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر البلد" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hourly_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر بالساعة (بالدولار)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="years_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سنوات الخبرة</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <LanguageSection form={form} />
        <SpecializationSection form={form} />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "جاري الحفظ..." : "حفظ المعلومات الأساسية"}
        </Button>
      </form>
    </Form>
  );
};

export default ExpertProfileForm;
