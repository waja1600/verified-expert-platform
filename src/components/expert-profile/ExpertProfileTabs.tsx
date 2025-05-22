
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpertProfileForm from "./ExpertProfileForm";
import PortfolioEditor from "./PortfolioEditor";

interface ExpertProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userId: string | null;
  expertId: string | null;
  portfolioData: any;
  setPortfolioData: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  form: any;
}

const ExpertProfileTabs = ({
  activeTab,
  setActiveTab,
  userId,
  expertId,
  portfolioData,
  setPortfolioData,
  isLoading,
  setIsLoading,
  form
}: ExpertProfileTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">المعلومات الأساسية</TabsTrigger>
        <TabsTrigger value="portfolio">السيرة الذاتية</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ExpertProfileForm 
          form={form}
          isLoading={isLoading}
          expertId={expertId}
          userId={userId}
        />
      </TabsContent>
      
      <TabsContent value="portfolio">
        <PortfolioEditor 
          expertId={expertId}
          portfolioData={portfolioData}
          setPortfolioData={setPortfolioData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ExpertProfileTabs;
