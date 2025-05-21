
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-white overflow-hidden pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 pt-10 pb-8 sm:pt-16 sm:pb-16 md:pt-20 md:pb-20 lg:pt-28 lg:pb-28">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Connect with Verified</span>
              <span className="block text-primary mt-1">Industry Experts</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-2xl">
              Get personalized consultations from verified professionals in industry, commerce, and technology fields.
            </p>
            
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link to="/experts">
                  <Button size="lg" className="w-full">
                    Find an Expert
                  </Button>
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link to="/become-expert">
                  <Button variant="outline" size="lg" className="w-full">
                    Become an Expert
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Abstract Background */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50 to-white transform -skew-y-6 -z-10"></div>
      
      {/* Hero Image */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-12 lg:mt-16 lg:max-w-none">
          <div className="relative lg:max-w-7xl">
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-lg shadow-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2274&q=80"
                  alt="Experts collaboration"
                  className="w-full h-full object-center object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
