
import FlipBook from "@/components/portfolio/FlipBook";
import { generatePortfolioPages } from "@/components/portfolio/PortfolioPageGenerator";

interface PortfolioPageContentProps {
  expertData: any;
  portfolioData: any;
}

const PortfolioPageContent = ({ expertData, portfolioData }: PortfolioPageContentProps) => {
  if (!expertData) {
    return null;
  }
  
  const pages = generatePortfolioPages(expertData, portfolioData);
  
  return (
    <FlipBook 
      pages={pages} 
      templateId={portfolioData?.template_id || "classic"} 
    />
  );
};

export default PortfolioPageContent;
