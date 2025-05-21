
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { File, FileText, ChevronLeft, ChevronRight } from "lucide-react";

interface FlipBookProps {
  pages: React.ReactNode[];
  templateId?: string;
}

const FlipBook = ({ pages, templateId = "classic" }: FlipBookProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const totalPages = pages.length;

  // Define different styles based on template
  const getTemplateStyle = () => {
    switch (templateId) {
      case "modern":
        return {
          pageStyle: "bg-gradient-to-b from-blue-50 to-white shadow-lg",
          coverStyle: "bg-gradient-to-r from-blue-500 to-blue-700 text-white",
          accentColor: "border-blue-500",
        };
      case "creative":
        return {
          pageStyle: "bg-gradient-to-br from-purple-50 to-white shadow-lg",
          coverStyle: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
          accentColor: "border-purple-500",
        };
      case "minimal":
        return {
          pageStyle: "bg-gray-50 shadow-md",
          coverStyle: "bg-gray-800 text-white",
          accentColor: "border-gray-800",
        };
      case "classic":
      default:
        return {
          pageStyle: "bg-amber-50 shadow-lg",
          coverStyle: "bg-amber-900 text-white",
          accentColor: "border-amber-900",
        };
    }
  };

  const { pageStyle, coverStyle, accentColor } = getTemplateStyle();

  const goToPreviousPage = () => {
    if (currentPage > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentPage(currentPage - 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentPage(currentPage + 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToNextPage();
      else if (e.key === "ArrowRight") goToPreviousPage();
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, isTransitioning, totalPages]);

  // Add mobile touch support
  useEffect(() => {
    const bookElement = bookRef.current;
    if (!bookElement) return;
    
    let startX: number;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - startX;
      
      if (diffX > 50) goToPreviousPage();
      else if (diffX < -50) goToNextPage();
    };
    
    bookElement.addEventListener("touchstart", handleTouchStart);
    bookElement.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      bookElement.removeEventListener("touchstart", handleTouchStart);
      bookElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentPage, isTransitioning, totalPages]);

  return (
    <div className="flex flex-col items-center justify-center py-10 w-full">
      <div 
        ref={bookRef}
        className={`relative mx-auto w-full max-w-3xl aspect-[4/3] ${isTransitioning ? 'pointer-events-none' : ''}`}
      >
        {/* Book container with 3D perspective */}
        <div className="w-full h-full perspective-1000">
          {/* Current page */}
          <div 
            className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out backface-visibility-hidden 
                       ${pageStyle} p-8 overflow-y-auto rounded-l-lg rounded-tr-sm rounded-br-xl border-r-8 ${accentColor}
                       ${currentPage === 0 ? coverStyle : ''}`}
          >
            {pages[currentPage]}
          </div>
          
          {/* Page turning effect */}
          {isTransitioning && (
            <div className="absolute inset-0 w-full h-full bg-white/20 animate-flip z-10"></div>
          )}
          
          {/* Page numbers */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full">
            {currentPage + 1} / {totalPages}
          </div>
        </div>
      </div>
      
      {/* Navigation controls */}
      <div className="flex items-center justify-center mt-6 space-x-4 rtl:space-x-reverse">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToPreviousPage} 
          disabled={currentPage === 0 || isTransitioning}
          className="h-12 w-12"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPage % 5 ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToNextPage} 
          disabled={currentPage === totalPages - 1 || isTransitioning}
          className="h-12 w-12"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default FlipBook;
