
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/ui/language-selector";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X, User, Search } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    document.documentElement.lang = lang;
  };

  const navigation = [
    { name: language === "en" ? "Home" : "الرئيسية", href: "/" },
    { name: language === "en" ? "Experts" : "الخبراء", href: "/experts" },
    { name: language === "en" ? "How it works" : "كيف يعمل", href: "/how-it-works" },
    { name: language === "en" ? "Pricing" : "الأسعار", href: "/pricing" },
  ];

  return (
    <nav className="bg-white shadow-sm fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">
                Expert<span className="text-black">saas</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-600 hover:text-primary px-2 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Search Button */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            {/* Language Selector */}
            <LanguageSelector
              onLanguageChange={handleLanguageChange}
              currentLanguage={language}
            />

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">
                  {language === "en" ? "Log in" : "تسجيل الدخول"}
                </Button>
              </Link>
              <Link to="/signup">
                <Button>
                  {language === "en" ? "Sign up" : "حساب جديد"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            <LanguageSelector 
              onLanguageChange={handleLanguageChange} 
              currentLanguage={language} 
            />
            
            <Button variant="ghost" onClick={toggleMenu} size="icon">
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-2">
              <Link
                to="/login"
                className="block w-full"
                onClick={() => setIsOpen(false)}
              >
                <Button variant="outline" className="w-full">
                  {language === "en" ? "Log in" : "تسجيل الدخول"}
                </Button>
              </Link>
              <Link
                to="/signup"
                className="block w-full"
                onClick={() => setIsOpen(false)}
              >
                <Button className="w-full">
                  {language === "en" ? "Sign up" : "حساب جديد"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
