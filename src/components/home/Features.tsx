
import { CheckCircle } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Certified Experts",
      description: "All experts undergo a rigorous verification process including specialized exams to ensure quality.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Secure Payments",
      description: "Easy and secure payment system with transparent pricing for all consultations.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Video Consultations",
      description: "Seamless Zoom integration for high-quality video consultations with your selected experts.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Industry Specialists",
      description: "Access professionals across industry, commerce, and technology fields all in one place.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Verified Profiles",
      description: "Detailed expert profiles with verification badges, ratings, and specialty information.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Custom Arrangements",
      description: "Flexibility to schedule one-time consultations or establish ongoing professional relationships.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose Expertsaas?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Our platform offers unique advantages for both clients and experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 card-hover">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
