
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const portfolioSchema = z.object({
  education: z.array(
    z.object({
      degree: z.string().min(1, { message: "الشهادة مطلوبة" }),
      institution: z.string().min(1, { message: "اسم المؤسسة التعليمية مطلوب" }),
      year: z.string().min(1, { message: "السنة مطلوبة" }),
    })
  ).min(1, { message: "يرجى إضافة معلومات تعليمية واحدة على الأقل" }),
  experience: z.array(
    z.object({
      position: z.string().min(1, { message: "المنصب مطلوب" }),
      company: z.string().min(1, { message: "اسم الشركة مطلوب" }),
      duration: z.string().min(1, { message: "المدة مطلوبة" }),
      description: z.string().min(1, { message: "الوصف مطلوب" }),
    })
  ).min(1, { message: "يرجى إضافة خبرة عملية واحدة على الأقل" }),
  skills: z.array(
    z.object({
      name: z.string().min(1, { message: "اسم المهارة مطلوب" }),
      level: z.number().min(1).max(5),
    })
  ).min(1, { message: "يرجى إضافة مهارة واحدة على الأقل" }),
  achievements: z.array(
    z.string().min(1, { message: "الإنجاز مطلوب" })
  ).optional(),
});

interface PortfolioFormProps {
  onSave: (data: z.infer<typeof portfolioSchema>) => void;
  initialData?: z.infer<typeof portfolioSchema>;
}

const PortfolioForm = ({
  onSave,
  initialData
}: PortfolioFormProps) => {
  const form = useForm<z.infer<typeof portfolioSchema>>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: initialData || {
      education: [{ degree: "", institution: "", year: "" }],
      experience: [{ position: "", company: "", duration: "", description: "" }],
      skills: [{ name: "", level: 3 }],
      achievements: [""],
    },
  });

  // Helper functions to add/remove array items
  const addEducation = () => {
    const currentEducation = form.getValues("education");
    form.setValue("education", [
      ...currentEducation,
      { degree: "", institution: "", year: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    const currentEducation = form.getValues("education");
    if (currentEducation.length > 1) {
      form.setValue(
        "education",
        currentEducation.filter((_, i) => i !== index)
      );
    }
  };

  const addExperience = () => {
    const currentExperience = form.getValues("experience");
    form.setValue("experience", [
      ...currentExperience,
      { position: "", company: "", duration: "", description: "" },
    ]);
  };

  const removeExperience = (index: number) => {
    const currentExperience = form.getValues("experience");
    if (currentExperience.length > 1) {
      form.setValue(
        "experience",
        currentExperience.filter((_, i) => i !== index)
      );
    }
  };

  const addSkill = () => {
    const currentSkills = form.getValues("skills");
    form.setValue("skills", [
      ...currentSkills,
      { name: "", level: 3 },
    ]);
  };

  const removeSkill = (index: number) => {
    const currentSkills = form.getValues("skills");
    if (currentSkills.length > 1) {
      form.setValue(
        "skills",
        currentSkills.filter((_, i) => i !== index)
      );
    }
  };

  const addAchievement = () => {
    const currentAchievements = form.getValues("achievements") || [];
    form.setValue("achievements", [
      ...currentAchievements,
      "",
    ]);
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = form.getValues("achievements") || [];
    if (currentAchievements.length > 1) {
      form.setValue(
        "achievements",
        currentAchievements.filter((_, i) => i !== index)
      );
    }
  };

  const onSubmit = (values: z.infer<typeof portfolioSchema>) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* التعليم */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">التعليم</h2>
          {form.getValues("education").map((_, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-md">
              <FormField
                control={form.control}
                name={`education.${index}.degree`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الشهادة/المؤهل</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.institution`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المؤسسة التعليمية</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.year`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سنة التخرج</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeEducation(index)}
                className="mt-2"
                disabled={form.getValues("education").length <= 1}
              >
                حذف
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addEducation}
          >
            إضافة تعليم
          </Button>
        </div>

        {/* الخبرة */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">الخبرة المهنية</h2>
          {form.getValues("experience").map((_, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-md">
              <FormField
                control={form.control}
                name={`experience.${index}.position`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المنصب</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${index}.company`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الشركة</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${index}.duration`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المدة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: 2018 - 2020" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وصف المسؤوليات</FormLabel>
                    <FormControl>
                      <Textarea className="h-20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeExperience(index)}
                className="mt-2"
                disabled={form.getValues("experience").length <= 1}
              >
                حذف
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addExperience}
          >
            إضافة خبرة
          </Button>
        </div>

        {/* المهارات */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">المهارات</h2>
          {form.getValues("skills").map((_, index) => (
            <div key={index} className="flex items-end space-x-4 space-x-reverse">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name={`skills.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المهارة</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-24">
                <FormField
                  control={form.control}
                  name={`skills.${index}.level`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المستوى (1-5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => removeSkill(index)}
                disabled={form.getValues("skills").length <= 1}
              >
                حذف
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addSkill}
          >
            إضافة مهارة
          </Button>
        </div>

        {/* الإنجازات */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">الإنجازات</h2>
          {(form.getValues("achievements") || [""]).map((_, index) => (
            <div key={index} className="flex items-end space-x-4 space-x-reverse">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name={`achievements.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الإنجاز</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => removeAchievement(index)}
                disabled={(form.getValues("achievements") || []).length <= 1}
              >
                حذف
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addAchievement}
          >
            إضافة إنجاز
          </Button>
        </div>

        <Button type="submit" className="w-full">
          حفظ السيرة الذاتية
        </Button>
      </form>
    </Form>
  );
};

export default PortfolioForm;
