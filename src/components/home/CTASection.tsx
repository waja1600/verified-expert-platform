
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl gradient-bg p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Ready to connect with an expert?
              </h2>
              <p className="text-blue-100">
                Find the right professional for your specific needs and transform your business today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/experts">
                <Button size="lg" className="bg-white text-primary hover:bg-blue-50">
                  Find an Expert
                </Button>
              </Link>
              <Link to="/become-expert">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                  Become an Expert
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
