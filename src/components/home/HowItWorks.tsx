
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Find Your Expert",
      description: "Search through our verified experts based on specialty, ratings, and availability.",
      icon: "🔍"
    },
    {
      number: "02",
      title: "Book a Session",
      description: "Choose a convenient time for a video consultation or message the expert for custom arrangements.",
      icon: "📅"
    },
    {
      number: "03",
      title: "Connect via Zoom",
      description: "Meet your expert through our seamless Zoom integration for professional consultation.",
      icon: "💻"
    },
    {
      number: "04",
      title: "Rate & Review",
      description: "After your session, share your experience to help other clients find the right expertise.",
      icon: "⭐"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            How <span className="text-primary">Expertsaas</span> Works
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Getting expert help is easy with our streamlined process.
          </p>
        </div>

        <div className="relative">
          {/* Connected line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-8 border border-gray-100 relative flex flex-col items-center text-center"
              >
                <div className="absolute -top-5 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <div className="text-4xl mb-6">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 mb-6">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-20">
                    <ArrowRight className="text-primary w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Ready to experience expert consultation?</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/experts">
              <Button size="lg" className="px-8 font-medium">
                Find an Expert Now
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="px-8 font-medium">
                Learn More About Our Process
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-16 bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">For Experts</h3>
              <p className="text-gray-600 mb-6">Join our platform to connect with clients seeking your specialized expertise. Our platform makes it easy to showcase your skills, manage appointments, and grow your professional network.</p>
              <div className="space-y-3">
                {["Showcase your expertise", "Set your own rates", "Flexible scheduling", "Secure payments"].map((benefit, i) => (
                  <div key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8 md:border-l border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">For Clients</h3>
              <p className="text-gray-600 mb-6">Access top industry professionals with verified credentials and experience. Get personalized consultations that address your specific needs and challenges.</p>
              <div className="space-y-3">
                {["Verified experts only", "Transparent pricing", "Easy scheduling", "Secure platform"].map((benefit, i) => (
                  <div key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
