
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, PortfolioTable } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ExpertProfileTabs from "@/components/expert-profile/ExpertProfileTabs";

// Define schema for expert profile form
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
  const [expertId, setExpertId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [portfolioData, setPortfolioData] = useState<PortfolioTable | null>(null);

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
      // Fetch portfolio data
      const { data, error } = await supabase
        .from('expert_portfolios')
        .select()
        .eq("expert_id", expertId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error("Error fetching expert portfolio:", error);
        }
        return;
      }

      if (data) {
        setPortfolioData(data as PortfolioTable);
      }
    };

    checkAuth();
  }, [navigate, form]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">ملف الخبير</h1>
          
          <ExpertProfileTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userId={userId}
            expertId={expertId}
            portfolioData={portfolioData}
            setPortfolioData={setPortfolioData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            form={form}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExpertProfilePage;
