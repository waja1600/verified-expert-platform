
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSectionProps {
  form: any;
}

const LanguageSection = ({ form }: LanguageSectionProps) => {
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<{language_id: string, proficiency_level: string}[]>([]);
  
  useEffect(() => {
    const fetchLanguages = async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching languages:", error);
        return;
      }

      setLanguages(data || []);
    };

    fetchLanguages();

    // Initialize selectedLanguages from form
    setSelectedLanguages(form.getValues().languages || []);
  }, [form]);

  const addLanguage = () => {
    const newLanguage = { language_id: "", proficiency_level: "متوسط" };
    setSelectedLanguages([...selectedLanguages, newLanguage]);
    form.setValue("languages", [...form.getValues("languages"), newLanguage]);
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = [...selectedLanguages];
    updatedLanguages.splice(index, 1);
    setSelectedLanguages(updatedLanguages);
    form.setValue("languages", updatedLanguages);
  };

  const updateLanguage = (index: number, field: 'language_id' | 'proficiency_level', value: string) => {
    const updatedLanguages = [...selectedLanguages];
    updatedLanguages[index][field] = value;
    setSelectedLanguages(updatedLanguages);
    form.setValue("languages", updatedLanguages);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold border-b pb-2">اللغات</h2>
      <div className="space-y-4">
        {selectedLanguages.map((lang, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 items-end border p-4 rounded-lg">
            <div className="flex-1">
              <FormLabel>اللغة</FormLabel>
              <Select
                value={lang.language_id}
                onValueChange={(value) => updateLanguage(index, 'language_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر اللغة" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <FormLabel>مستوى الإتقان</FormLabel>
              <Select
                value={lang.proficiency_level}
                onValueChange={(value) => updateLanguage(index, 'proficiency_level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                  <SelectItem value="متوسط">متوسط</SelectItem>
                  <SelectItem value="متقدم">متقدم</SelectItem>
                  <SelectItem value="اللغة الأم">اللغة الأم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => removeLanguage(index)}
              className="h-10"
            >
              حذف
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addLanguage}
        >
          إضافة لغة
        </Button>
      </div>
    </div>
  );
};

export default LanguageSection;
