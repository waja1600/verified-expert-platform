
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Find Your Expert",
      description: "Search through our verified experts based on specialty, ratings, and availability."
    },
    {
      number: "02",
      title: "Book a Session",
      description: "Choose a convenient time for a video consultation or message the expert for custom arrangements."
    },
    {
      number: "03",
      title: "Connect via Zoom",
      description: "Meet your expert through our seamless Zoom integration for professional consultation."
    },
    {
      number: "04",
      title: "Rate & Review",
      description: "After your session, share your experience to help other clients find the right expertise."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How Expertsaas Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Getting expert help is easy with our streamlined process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-lg font-bold mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/how-it-works">
            <Button variant="outline" size="lg">
              Learn More About Our Process
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
