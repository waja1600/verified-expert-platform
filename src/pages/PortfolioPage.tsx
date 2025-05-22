
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PortfolioTable } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PortfolioPageHeader from "@/components/portfolio/PortfolioPageHeader";
import PortfolioPageContent from "@/components/portfolio/PortfolioPageContent";
import PortfolioErrorState from "@/components/portfolio/PortfolioErrorState";
import PortfolioDataFetcher from "@/components/portfolio/PortfolioDataFetcher";

const PortfolioPage = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [expertData, setExpertData] = useState<any>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioTable | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handlers for the data fetcher
  const handleDataLoaded = (expertData: any, portfolioData: PortfolioTable) => {
    setExpertData(expertData);
    setPortfolioData(portfolioData);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        {id && (
          <PortfolioDataFetcher
            expertId={id}
            onDataLoaded={handleDataLoaded}
            onError={handleError}
            onLoading={handleLoading}
          />
        )}
        
        <PortfolioPageHeader loading={loading} error={error} />
        
        {!error ? (
          <PortfolioPageContent 
            expertData={expertData} 
            portfolioData={portfolioData} 
            isLoading={loading}
          />
        ) : (
          <PortfolioErrorState message={error} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
