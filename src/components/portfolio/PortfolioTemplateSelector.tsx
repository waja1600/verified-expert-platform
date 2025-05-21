
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface Template {
  id: string;
  name: string;
  image: string;
  description: string;
}

const templates: Template[] = [
  {
    id: "classic",
    name: "كلاسيكي",
    image: "/placeholder.svg",
    description: "قالب كلاسيكي أنيق مع تصميم احترافي"
  },
  {
    id: "modern",
    name: "عصري",
    image: "/placeholder.svg",
    description: "قالب حديث بألوان جذابة وتخطيط مبتكر"
  },
  {
    id: "creative",
    name: "إبداعي",
    image: "/placeholder.svg",
    description: "قالب إبداعي يبرز مهاراتك بطريقة فريدة"
  },
  {
    id: "minimal",
    name: "بسيط",
    image: "/placeholder.svg",
    description: "قالب بسيط وأنيق يركز على المحتوى"
  }
];

interface PortfolioTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const PortfolioTemplateSelector = ({
  selectedTemplate,
  onSelectTemplate
}: PortfolioTemplateSelectorProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">اختر قالب السيرة الذاتية</h2>
      
      <Carousel className="w-full">
        <CarouselContent>
          {templates.map((template) => (
            <CarouselItem key={template.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className={`overflow-hidden ${selectedTemplate === template.id ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] relative">
                      <img 
                        src={template.image} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 text-white opacity-0 hover:opacity-100 transition-opacity">
                        <h3 className="font-bold mb-1">{template.name}</h3>
                        <p className="text-sm">{template.description}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <Button
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                        className="w-full"
                        onClick={() => onSelectTemplate(template.id)}
                      >
                        {selectedTemplate === template.id ? "تم الاختيار" : "اختر هذا القالب"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="right-auto left-4" />
        <CarouselNext className="left-auto right-4" />
      </Carousel>
    </div>
  );
};

export default PortfolioTemplateSelector;
