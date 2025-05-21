
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [verified, setVerified] = useState(false);
  
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleSearch = () => {
    onSearch({
      searchTerm,
      category,
      specialization,
      minRating,
      verified
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setSpecialization("");
    setMinRating(0);
    setVerified(false);
    onSearch({});
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search experts by name, skills, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="industry">Industry</SelectItem>
            <SelectItem value="commerce">Commerce</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch}>
          Search
        </Button>
        
        <Button variant="outline" onClick={toggleFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {isFiltersOpen && (
        <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <Select value={specialization} onValueChange={setSpecialization}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="software">Software Development</SelectItem>
                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Rating: {minRating}+
            </label>
            <Slider
              value={[minRating]}
              min={0}
              max={5}
              step={1}
              onValueChange={(value) => setMinRating(value[0])}
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="verified"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
            <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
              Verified experts only
            </label>
          </div>
          
          <Button variant="outline" onClick={clearFilters} className="flex items-center">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
