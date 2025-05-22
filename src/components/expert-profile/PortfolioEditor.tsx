
import { useState } from "react";
import { toast } from "sonner";
import { expertPortfoliosTable } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import PortfolioTemplateSelector from "@/components/portfolio/PortfolioTemplateSelector";
import PortfolioForm from "@/components/portfolio/PortfolioForm";
import FlipBook from "@/components/portfolio/FlipBook";

interface PortfolioEditorProps {
  expertId: string | null;
  portfolioData: any;
  setPortfolioData: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const PortfolioEditor = ({
  expertId,
  portfolioData,
  setPortfolioData,
  isLoading,
  setIsLoading
}: PortfolioEditorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(portfolioData?.template_id || "classic");
  const [previewMode, setPreviewMode] = useState(false);

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
        // Update existing portfolio
        const { error } = await expertPortfoliosTable
          .update(portfolioToSave)
          .eq("id", portfolioData.id);

        if (error) throw error;
      } else {
        // Insert new portfolio
        const { error } = await expertPortfoliosTable
          .insert(portfolioToSave);

        if (error) throw error;
      }

      // Fetch the updated portfolio
      const { data, error } = await expertPortfoliosTable
        .select()
        .eq("expert_id", expertId)
        .single();

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

  // Generate preview pages for the flipbook
  const generatePreviewPages = () => {
    if (!expertId) return [];
    
    // This is simplified preview data - in production you'd use the actual data
    const samplePages = [
      // Cover page
      <div key="cover" className="h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">عنوان الخبير المهني</h1>
        <h2 className="text-2xl mb-8">الاسم الكامل</h2>
        <p className="text-lg">البلد</p>
      </div>,
      
      // About page
      <div key="about" className="h-full py-6">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">نبذة عني</h2>
        <p className="text-lg leading-relaxed whitespace-pre-line">نبذة مختصرة عن الخبرة والمؤهلات</p>
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">الخبرة</h3>
            <p>سنوات الخبرة</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">السعر بالساعة</h3>
            <p>السعر بالدولار</p>
          </div>
        </div>
      </div>,
      
      // Sample education page
      <div key="education" className="h-full py-6">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">التعليم</h2>
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold">الشهادة</h3>
            <p className="text-gray-700">المؤسسة التعليمية</p>
            <p className="text-gray-600 text-sm">السنة</p>
          </div>
        </div>
      </div>
    ];

    return samplePages;
  };

  return (
    <>
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
    </>
  );
};

export default PortfolioEditor;
