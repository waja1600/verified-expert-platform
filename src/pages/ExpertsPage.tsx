
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchFilters from "@/components/experts/SearchFilters";
import ExpertCard from "@/components/experts/ExpertCard";
import { expertsMock, Expert } from "@/data/expertsMock";
import { Pagination } from "@/components/ui/pagination";

const ExpertsPage = () => {
  const [experts, setExperts] = useState<Expert[]>(expertsMock);
  const [currentPage, setCurrentPage] = useState(1);
  const expertsPerPage = 6;
  
  const handleSearch = (filters: any) => {
    let filteredExperts = [...expertsMock];
    
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredExperts = filteredExperts.filter(
        (expert) =>
          expert.name.toLowerCase().includes(searchTerm) ||
          expert.specialty.toLowerCase().includes(searchTerm) ||
          expert.title.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.category) {
      filteredExperts = filteredExperts.filter(
        (expert) => expert.category === filters.category
      );
    }
    
    if (filters.specialization) {
      filteredExperts = filteredExperts.filter(
        (expert) => expert.specialty.toLowerCase() === filters.specialization.toLowerCase()
      );
    }
    
    if (filters.minRating > 0) {
      filteredExperts = filteredExperts.filter(
        (expert) => expert.rating >= filters.minRating
      );
    }
    
    if (filters.verified) {
      filteredExperts = filteredExperts.filter((expert) => expert.verified);
    }
    
    setExperts(filteredExperts);
    setCurrentPage(1);
  };

  // Get current experts
  const indexOfLastExpert = currentPage * expertsPerPage;
  const indexOfFirstExpert = indexOfLastExpert - expertsPerPage;
  const currentExperts = experts.slice(indexOfFirstExpert, indexOfLastExpert);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Find Your Expert</h1>
          <p className="text-gray-600">
            Browse our network of verified professionals in industry, commerce, and technology
          </p>
        </div>
        
        <SearchFilters onSearch={handleSearch} />
        
        {experts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">No experts found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentExperts.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  id={expert.id}
                  name={expert.name}
                  title={expert.title}
                  specialty={expert.specialty}
                  rating={expert.rating}
                  reviewCount={expert.reviewCount}
                  examPassRate={expert.examPassRate}
                  verified={expert.verified}
                  image={expert.image}
                  hourlyRate={expert.hourlyRate}
                />
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <Pagination
                totalCount={experts.length}
                currentPage={currentPage}
                pageSize={expertsPerPage}
                onPageChange={paginate}
              />
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ExpertsPage;
