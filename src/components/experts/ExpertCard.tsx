
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export interface ExpertCardProps {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  examPassRate: number;
  verified: boolean;
  image: string;
  hourlyRate?: number;
}

const ExpertCard = ({
  id,
  name,
  title,
  specialty,
  rating,
  reviewCount,
  examPassRate,
  verified,
  image,
  hourlyRate
}: ExpertCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover"
          />
          {verified && (
            <Badge className="absolute top-3 right-3 bg-primary">
              Verified
            </Badge>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
              <p className="text-gray-500">{title}</p>
            </div>
            {hourlyRate && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Starting at</p>
                <p className="text-lg font-bold text-primary">${hourlyRate}/hr</p>
              </div>
            )}
          </div>
          
          <div className="mt-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
              {specialty}
            </Badge>
          </div>
          
          <div className="mt-4 flex items-center">
            <div className="flex items-center mr-4">
              <Star className="w-4 h-4 fill-current text-yellow-500 mr-1" />
              <span className="font-medium">{rating.toFixed(1)}</span>
              <span className="text-gray-400 text-sm ml-1">({reviewCount})</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">
                Exam Pass: {examPassRate}%
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <Link to={`/experts/${id}`} className="flex-1">
              <Button variant="outline" className="w-full">View Profile</Button>
            </Link>
            <Link to={`/book/${id}`} className="flex-1">
              <Button className="w-full">Book Session</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
