
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import ExpertCategories from "@/components/home/ExpertCategories";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16"> {/* Add padding for fixed navbar */}
        <Hero />
        <Features />
        <ExpertCategories />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
