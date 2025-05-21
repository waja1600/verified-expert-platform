
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FlipBook from "@/components/portfolio/FlipBook";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const PortfolioPage = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [expertData, setExpertData] = useState<any>(null);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        // Fetch expert data
        const { data: expert, error: expertError } = await supabase
          .from("experts")
          .select(`
            *,
            countries(name)
          `)
          .eq("id", id)
          .single();

        if (expertError) throw expertError;
        setExpertData(expert);

        // Fetch portfolio data
        const { data: portfolio, error: portfolioError } = await supabase
          .from("expert_portfolios")
          .select("*")
          .eq("expert_id", id)
          .single();

        if (portfolioError && portfolioError.code !== 'PGRST116') {
          throw portfolioError;
        }

        setPortfolioData(portfolio);

        // Fetch languages
        const { data: languages, error: languagesError } = await supabase
          .from("expert_languages")
          .select(`
            *,
            languages(name)
          `)
          .eq("expert_id", id);

        if (languagesError) throw languagesError;
        
        // Add languages to expert data
        setExpertData(prev => ({
          ...prev,
          languages: languages.map(l => ({
            name: l.languages.name,
            proficiency: l.proficiency_level
          }))
        }));

        // Fetch specializations
        const { data: specializations, error: specializationsError } = await supabase
          .from("expert_specializations")
          .select(`
            specializations(
              id, 
              name,
              categories(id, name)
            )
          `)
          .eq("expert_id", id);

        if (specializationsError) throw specializationsError;
        
        // Add specializations to expert data
        setExpertData(prev => ({
          ...prev,
          specializations: specializations.map(s => ({
            name: s.specializations.name,
            category: s.specializations.categories.name
          }))
        }));

      } catch (err: any) {
        console.error("Error fetching expert data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExpertData();
    }
  }, [id]);

  // Generate pages for the flipbook
  const generatePages = () => {
    if (!expertData) {
      return [];
    }

    // Create pages array
    const pages = [
      // Cover page
      <div key="cover" className="h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">{expertData.title}</h1>
        <h2 className="text-2xl mb-8">{expertData.first_name} {expertData.last_name}</h2>
        {expertData.countries?.name && (
          <p className="text-lg">{expertData.countries.name}</p>
        )}
      </div>,

      // About page
      <div key="about" className="h-full py-6">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">نبذة عني</h2>
        <p className="text-lg leading-relaxed whitespace-pre-line">{expertData.bio}</p>
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">الخبرة</h3>
            <p>{expertData.years_experience} سنوات</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">السعر بالساعة</h3>
            <p>{expertData.hourly_rate} دولار</p>
          </div>
        </div>
      </div>
    ];

    // Languages page
    if (expertData.languages?.length > 0) {
      pages.push(
        <div key="languages" className="h-full py-6">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">اللغات</h2>
          <div className="space-y-4">
            {expertData.languages.map((language: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{language.name}</span>
                <span className="text-gray-600">{language.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Specializations page
    if (expertData.specializations?.length > 0) {
      pages.push(
        <div key="specializations" className="h-full py-6">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">التخصصات</h2>
          <div className="space-y-6">
            {/* Group specializations by category */}
            {Object.entries(
              expertData.specializations.reduce((acc: any, spec: any) => {
                if (!acc[spec.category]) acc[spec.category] = [];
                acc[spec.category].push(spec.name);
                return acc;
              }, {})
            ).map(([category, specs]: [string, any], index: number) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-medium mb-2">{category}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {specs.map((spec: string, specIndex: number) => (
                    <li key={specIndex} className="text-gray-700">{spec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Portfolio data pages (if available)
    if (portfolioData) {
      // Education page
      if (portfolioData.education?.length > 0) {
        pages.push(
          <div key="education" className="h-full py-6">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">التعليم</h2>
            <div className="space-y-6">
              {portfolioData.education.map((edu: any, index: number) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-bold">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-gray-600 text-sm">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Experience page
      if (portfolioData.experience?.length > 0) {
        pages.push(
          <div key="experience" className="h-full py-6">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">الخبرات المهنية</h2>
            <div className="space-y-8">
              {portfolioData.experience.map((exp: any, index: number) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">{exp.position}</h3>
                    <span className="text-gray-600 text-sm">{exp.duration}</span>
                  </div>
                  <p className="text-gray-700">{exp.company}</p>
                  <p className="mt-2 text-gray-600 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Skills page
      if (portfolioData.skills?.length > 0) {
        pages.push(
          <div key="skills" className="h-full py-6">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">المهارات</h2>
            <div className="space-y-4">
              {portfolioData.skills.map((skill: any, index: number) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.level}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Achievements page
      if (portfolioData.achievements?.length > 0) {
        pages.push(
          <div key="achievements" className="h-full py-6">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">الإنجازات</h2>
            <ul className="list-disc list-inside space-y-3">
              {portfolioData.achievements.map((achievement: string, index: number) => (
                <li key={index} className="text-lg text-gray-700">{achievement}</li>
              ))}
            </ul>
          </div>
        );
      }

      // Contact page
      pages.push(
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
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        {loading ? (
          <div className="space-y-8">
            <div className="flex justify-center items-center">
              <Skeleton className="h-[400px] w-full max-w-3xl" />
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-12 w-32 mx-2" />
              <Skeleton className="h-12 w-32 mx-2" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600">خطأ في تحميل الملف</h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        ) : expertData ? (
          <FlipBook 
            pages={generatePages()} 
            templateId={portfolioData?.template_id || "classic"} 
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">لم يتم العثور على الخبير</h2>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
