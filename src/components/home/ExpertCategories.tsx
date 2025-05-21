
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ExpertCategories = () => {
  const categories = [
    {
      title: "Industry",
      description: "Manufacturing, Engineering, Supply Chain, Operations, Quality Control",
      icon: "👨‍🏭",
      color: "bg-blue-50 border-blue-200",
      link: "/experts/industry"
    },
    {
      title: "Commerce",
      description: "Marketing, Sales, Finance, Business Development, Strategy",
      icon: "👨‍💼",
      color: "bg-green-50 border-green-200",
      link: "/experts/commerce"
    },
    {
      title: "Technology",
      description: "Software Development, Cybersecurity, Data Science, AI, Cloud Computing",
      icon: "👩‍💻",
      color: "bg-purple-50 border-purple-200",
      link: "/experts/technology"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Expert Categories
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Find the right specialist for your specific needs across our main fields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`${category.color} p-8 rounded-xl border card-hover text-center`}
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
              <p className="text-gray-600 mb-6">{category.description}</p>
              <Link to={category.link}>
                <Button variant="outline">Browse Experts</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertCategories;
