
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, PortfolioTable } from "@/integrations/supabase/client";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PortfolioTemplateSelector from "@/components/portfolio/PortfolioTemplateSelector";
import PortfolioForm from "@/components/portfolio/PortfolioForm";
import FlipBook from "@/components/portfolio/FlipBook";

interface Country {
  id: string;
  name: string;
  code: string;
}

interface Language {
  id: string;
  name: string;
  code: string;
}

interface Category {
  id: string;
  name: string;
}

interface Specialization {
  id: string;
  name: string;
  category_id: string;
}

// Define portfolio data interface to help with type safety
interface PortfolioData {
  id?: string;
  expert_id?: string;
  template_id: string;
  education: any[];
  experience: any[];
  skills: any[];
  achievements: string[];
  created_at?: string;
  updated_at?: string;
}

const expertProfileSchema = z.object({
  title: z.string().min(3, { message: "العنوان مطلوب" }),
  bio: z.string().min(10, { message: "يرجى إضافة نبذة عنك (10 أحرف على الأقل)" }),
  country_id: z.string({ required_error: "الرجاء اختيار البلد" }),
  hourly_rate: z.string().min(1, { message: "يرجى إدخال السعر بالساعة" }),
  years_experience: z.string().min(1, { message: "يرجى إدخال سنوات الخبرة" }),
  languages: z.array(z.object({
    language_id: z.string(),
    proficiency_level: z.string()
  })).min(1, { message: "يرجى اختيار لغة واحدة على الأقل" }),
  specializations: z.array(z.string()).min(1, { message: "يرجى اختيار تخصص واحد على الأقل" })
});

const ExpertProfilePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<{language_id: string, proficiency_level: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expertId, setExpertId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm<z.infer<typeof expertProfileSchema>>({
    resolver: zodResolver(expertProfileSchema),
    defaultValues: {
      title: "",
      bio: "",
      country_id: "",
      hourly_rate: "",
      years_experience: "",
      languages: [],
      specializations: []
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login");
        return;
      }
      setUserId(data.session.user.id);
      fetchExpertProfile(data.session.user.id);
    };

    const fetchExpertProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("experts")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching expert profile:", error);
        return;
      }

      if (data) {
        setExpertId(data.id);
        form.setValue("title", data.title || "");
        form.setValue("bio", data.bio || "");
        form.setValue("country_id", data.country_id || "");
        form.setValue("hourly_rate", data.hourly_rate?.toString() || "");
        form.setValue("years_experience", data.years_experience?.toString() || "");

        // Fetch languages and specializations
        fetchExpertLanguages(data.id);
        fetchExpertSpecializations(data.id);
        fetchExpertPortfolio(data.id);
      }
    };

    const fetchExpertLanguages = async (expertId: string) => {
      const { data, error } = await supabase
        .from("expert_languages")
        .select("*")
        .eq("expert_id", expertId);

      if (error) {
        console.error("Error fetching expert languages:", error);
        return;
      }

      if (data) {
        setSelectedLanguages(data.map(item => ({
          language_id: item.language_id,
          proficiency_level: item.proficiency_level
        })));
        form.setValue("languages", data.map(item => ({
          language_id: item.language_id,
          proficiency_level: item.proficiency_level
        })));
      }
    };

    const fetchExpertSpecializations = async (expertId: string) => {
      const { data, error } = await supabase
        .from("expert_specializations")
        .select("specialization_id")
        .eq("expert_id", expertId);

      if (error) {
        console.error("Error fetching expert specializations:", error);
        return;
      }

      if (data) {
        const specializationIds = data.map(item => item.specialization_id);
        form.setValue("specializations", specializationIds);
      }
    };

    const fetchExpertPortfolio = async (expertId: string) => {
      // Use type assertion for the query
      const { data, error } = await supabase
        .from('expert_portfolios')
        .select("*")
        .eq("expert_id", expertId)
        .single() as unknown as { data: PortfolioTable | null, error: any };

      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error("Error fetching expert portfolio:", error);
        }
        return;
      }

      if (data) {
        setSelectedTemplate(data.template_id || "classic");
        setPortfolioData(data);
      }
    };

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

    checkAuth();
    fetchCountries();
    fetchLanguages();
    fetchCategories();
    fetchSpecializations();
  }, [navigate, form]);

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

  const onSubmit = async (values: z.infer<typeof expertProfileSchema>) => {
    if (!expertId || !userId) {
      toast.error("لم يتم العثور على حساب الخبير");
      return;
    }

    setIsLoading(true);
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
      const languagesData = values.languages.map(lang => ({
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
      const specializationsData = values.specializations.map(specId => ({
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
    } finally {
      setIsLoading(false);
    }
  };

  const savePortfolio = async (portfolioFormData: any) => {
    if (!expertId) {
      toast.error("لم يتم العثور على حساب الخبير");
      return;
    }

    setIsLoading(true);
    try {
      const portfolioToSave = {
        expert_id: expertId,
        template_id: selectedTemplate,
        ...portfolioFormData
      };

      // Check if portfolio already exists
      if (portfolioData?.id) {
        // Update existing portfolio with type assertion
        const { error } = await supabase
          .from('expert_portfolios')
          .update(portfolioToSave)
          .eq("id", portfolioData.id) as unknown as { error: any };

        if (error) throw error;
      } else {
        // Insert new portfolio with type assertion
        const { error } = await supabase
          .from('expert_portfolios')
          .insert(portfolioToSave) as unknown as { error: any };

        if (error) throw error;
      }

      // Fetch the updated portfolio with type assertion
      const { data, error } = await supabase
        .from('expert_portfolios')
        .select("*")
        .eq("expert_id", expertId)
        .single() as unknown as { data: PortfolioTable | null, error: any };

      if (error) throw error;
      
      setPortfolioData(data);
      toast.success("تم حفظ السيرة الذاتية بنجاح!");
    } catch (error: any) {
      console.error("Error saving portfolio:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ السيرة الذاتية");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSpecializations = selectedCategory
    ? specializations.filter(spec => spec.category_id === selectedCategory)
    : specializations;

  // Generate preview pages for the flipbook
  const generatePreviewPages = () => {
    if (!expertId) return [];
    
    // This is simplified preview data - in production you'd use the actual data
    const samplePages = [
      // Cover page
      <div key="cover" className="h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">{form.getValues("title")}</h1>
        <h2 className="text-2xl mb-8">الاسم الكامل</h2>
        {countries.find(c => c.id === form.getValues("country_id"))?.name && (
          <p className="text-lg">{countries.find(c => c.id === form.getValues("country_id"))?.name}</p>
        )}
      </div>,
      
      // About page
      <div key="about" className="h-full py-6">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">نبذة عني</h2>
        <p className="text-lg leading-relaxed whitespace-pre-line">{form.getValues("bio")}</p>
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">الخبرة</h3>
            <p>{form.getValues("years_experience")} سنوات</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">السعر بالساعة</h3>
            <p>{form.getValues("hourly_rate")} دولار</p>
          </div>
        </div>
      </div>,
      
      // Sample education page
      <div key="education" className="h-full py-6">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">التعليم</h2>
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold">بكالوريوس علوم الحاسوب</h3>
            <p className="text-gray-700">جامعة الرياض</p>
            <p className="text-gray-600 text-sm">2018</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-bold">ماجستير ذكاء اصطناعي</h3>
            <p className="text-gray-700">جامعة القاهرة</p>
            <p className="text-gray-600 text-sm">2020</p>
          </div>
        </div>
      </div>,
      
      // Sample contact page
      <div key="contact" className="h-full py-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">تواصل معي</h2>
          <p className="text-lg mb-6">للاستفسار أو طلب استشارة يمكنك التواصل معي مباشرة</p>
        </div>
        
        <div className="mt-auto text-center">
          <Button size="lg" className="w-full md:w-auto">
            طلب استشارة
          </Button>
        </div>
      </div>
    ];

    return samplePages;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">ملف الخبير</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">المعلومات الأساسية</TabsTrigger>
              <TabsTrigger value="portfolio">السيرة الذاتية</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
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
                                        currentSpecs.filter((id) => id !== spec.id)
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري الحفظ..." : "حفظ المعلومات الأساسية"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="portfolio">
              {previewMode ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => setPreviewMode(false)}
                    >
                      العودة للتحرير
                    </Button>
                    <h2 className="text-xl font-semibold">معاينة السيرة الذاتية</h2>
                  </div>
                  <FlipBook 
                    pages={generatePreviewPages()} 
                    templateId={selectedTemplate}
                  />
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">تحرير السيرة الذاتية</h2>
                    <Button
                      variant="outline"
                      onClick={() => setPreviewMode(true)}
                    >
                      معاينة
                    </Button>
                  </div>
                  
                  <PortfolioTemplateSelector 
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={setSelectedTemplate}
                  />
                  
                  <PortfolioForm 
                    onSave={savePortfolio}
                    initialData={portfolioData}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExpertProfilePage;
