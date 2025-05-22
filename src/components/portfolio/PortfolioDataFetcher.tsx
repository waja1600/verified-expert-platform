
import { useEffect } from "react";
import { supabase, PortfolioTable } from "@/integrations/supabase/client";

interface PortfolioDataFetcherProps {
  expertId: string;
  onDataLoaded: (expertData: any, portfolioData: any) => void;
  onError: (error: string) => void;
  onLoading: (isLoading: boolean) => void;
}

const PortfolioDataFetcher = ({ 
  expertId, 
  onDataLoaded, 
  onError, 
  onLoading 
}: PortfolioDataFetcherProps) => {
  
  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        onLoading(true);
        
        // Fetch expert data
        const { data: expert, error: expertError } = await supabase
          .from("experts")
          .select(`
            *,
            countries(name)
          `)
          .eq("id", expertId)
          .single();

        if (expertError) throw expertError;

        // Fetch portfolio data 
        const { data: portfolio, error: portfolioError } = await supabase
          .from('expert_portfolios')
          .select('*')
          .eq('expert_id', expertId)
          .maybeSingle();

        if (portfolioError && portfolioError.code !== 'PGRST116') {
          throw portfolioError;
        }

        // Fetch languages
        const { data: languages, error: languagesError } = await supabase
          .from("expert_languages")
          .select(`
            *,
            languages(name)
          `)
          .eq("expert_id", expertId);

        if (languagesError) throw languagesError;
        
        // Add languages to expert data
        const expertWithLanguages = {
          ...expert,
          languages: languages.map((l: any) => ({
            name: l.languages.name,
            proficiency: l.proficiency_level
          }))
        };

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
          .eq("expert_id", expertId);

        if (specializationsError) throw specializationsError;
        
        // Add specializations to expert data
        const expertWithAll = {
          ...expertWithLanguages,
          specializations: specializations.map((s: any) => ({
            name: s.specializations.name,
            category: s.specializations.categories.name
          }))
        };

        // Send the data back to the parent component
        onDataLoaded(expertWithAll, portfolio as PortfolioTable);

      } catch (err: any) {
        console.error("Error fetching expert data:", err);
        onError(err.message || "حدث خطأ أثناء تحميل البيانات");
      } finally {
        onLoading(false);
      }
    };

    if (expertId) {
      fetchExpertData();
    } else {
      onError("معرف الخبير غير متوفر");
    }
  }, [expertId, onDataLoaded, onError, onLoading]);

  return null; // This is a data fetcher component, it doesn't render anything
};

export default PortfolioDataFetcher;
