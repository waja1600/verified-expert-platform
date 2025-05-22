
import { useState, useEffect } from "react";
import FlipBook from "@/components/portfolio/FlipBook";
import { generatePortfolioPages } from "@/components/portfolio/PortfolioPageGenerator";
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioPageContentProps {
  expertData: any;
  portfolioData: any;
  isLoading?: boolean;
}

const PortfolioPageContent = ({ 
  expertData, 
  portfolioData,
  isLoading = false
}: PortfolioPageContentProps) => {
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const [isGeneratingPages, setIsGeneratingPages] = useState(false);

  useEffect(() => {
    if (expertData) {
      setIsGeneratingPages(true);
      
      // Using setTimeout to avoid UI blocking while generating complex pages
      const timeoutId = setTimeout(() => {
        const generatedPages = generatePortfolioPages(expertData, portfolioData);
        setPages(generatedPages);
        setIsGeneratingPages(false);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [expertData, portfolioData]);

  if (isLoading || isGeneratingPages) {
    return (
      <div className="space-y-8 py-8">
        <div className="flex justify-center">
          <Skeleton className="h-[500px] w-full max-w-3xl rounded-lg" />
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    );
  }

  if (!expertData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">لا توجد بيانات متاحة</h2>
        <p className="mt-2 text-gray-600">لم يتم العثور على بيانات الخبير</p>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <FlipBook 
        pages={pages} 
        templateId={portfolioData?.template_id || "classic"} 
      />
    </div>
  );
};

export default PortfolioPageContent;
