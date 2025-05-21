
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      content: "The commerce expert I consulted with provided invaluable insights for our new product launch strategy. The verification process ensures you're getting true expertise.",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Operations Manager",
      content: "I was struggling with supply chain optimization until I found an industry expert on this platform. The consultation saved us months of trial and error.",
      image: "https://randomuser.me/api/portraits/men/44.jpg",
      rating: 5
    },
    {
      name: "Mira Patel",
      role: "Tech Startup Founder",
      content: "The technology expert helped us navigate complex cybersecurity challenges as we scaled. Having verified experts makes all the difference for critical business decisions.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 4
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Real experiences from clients who found the expertise they needed.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-8">
            {/* Current Testimonial */}
            <div className="flex flex-col items-center text-center">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-20 h-20 rounded-full mb-6 object-cover"
              />
              
              <div className="flex mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-500" />
                ))}
                {[...Array(5 - testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i + testimonials[currentIndex].rating} className="w-5 h-5 text-gray-300" />
                ))}
              </div>
              
              <blockquote className="mb-6 text-lg text-gray-700 italic">
                "{testimonials[currentIndex].content}"
              </blockquote>
              
              <div>
                <p className="font-bold text-lg">{testimonials[currentIndex].name}</p>
                <p className="text-gray-500">{testimonials[currentIndex].role}</p>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-center mt-8 space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={prev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={next}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
