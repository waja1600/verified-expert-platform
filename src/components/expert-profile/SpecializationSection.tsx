
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SpecializationSectionProps {
  form: any;
}

const SpecializationSection = ({ form }: SpecializationSectionProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      setCategories(data || []);
    };

    const fetchSpecializations = async () => {
      const { data, error } = await supabase
        .from("specializations")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching specializations:", error);
        return;
      }

      setSpecializations(data || []);
    };

    fetchCategories();
    fetchSpecializations();
  }, []);

  const filteredSpecializations = selectedCategory
    ? specializations.filter(spec => spec.category_id === selectedCategory)
    : specializations;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold border-b pb-2">مجالات التخصص</h2>
      
      <div className="mb-4">
        <FormLabel>القطاع</FormLabel>
        <Select
          value={selectedCategory || ""}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر القطاع" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FormField
        control={form.control}
        name="specializations"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>التخصصات</FormLabel>
              <FormMessage />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSpecializations.map((spec) => (
                <div key={spec.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={spec.id}
                    checked={form.getValues().specializations.includes(spec.id)}
                    onCheckedChange={(checked) => {
                      const currentSpecs = form.getValues().specializations;
                      if (checked) {
                        form.setValue("specializations", [...currentSpecs, spec.id]);
                      } else {
                        form.setValue(
                          "specializations",
                          currentSpecs.filter((id: string) => id !== spec.id)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={spec.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-2"
                  >
                    {spec.name}
                  </label>
                </div>
              ))}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default SpecializationSection;
