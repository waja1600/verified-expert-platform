
export interface Expert {
  id: string;
  name: string;
  title: string;
  specialty: string;
  category: "industry" | "commerce" | "technology";
  rating: number;
  reviewCount: number;
  examPassRate: number;
  verified: boolean;
  image: string;
  hourlyRate: number;
  about: string;
  availability: string[];
}

export const expertsMock: Expert[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    title: "Manufacturing Operations Specialist",
    specialty: "Manufacturing",
    category: "industry",
    rating: 4.8,
    reviewCount: 32,
    examPassRate: 92,
    verified: true,
    image: "https://randomuser.me/api/portraits/men/42.jpg",
    hourlyRate: 120,
    about: "20+ years of experience in manufacturing operations with expertise in lean methodologies and supply chain optimization. Worked with Fortune 500 companies across multiple industries.",
    availability: ["Mon", "Wed", "Fri"]
  },
  {
    id: "2",
    name: "Layla Al-Farsi",
    title: "Digital Marketing Strategist",
    specialty: "Marketing",
    category: "commerce",
    rating: 4.9,
    reviewCount: 48,
    examPassRate: 96,
    verified: true,
    image: "https://randomuser.me/api/portraits/women/24.jpg",
    hourlyRate: 140,
    about: "Digital marketing expert with a focus on B2B strategies. Specializing in lead generation, conversion optimization, and marketing automation for technology companies.",
    availability: ["Tue", "Thu", "Sat"]
  },
  {
    id: "3",
    name: "Tariq Mahmoud",
    title: "Cybersecurity Consultant",
    specialty: "Cybersecurity",
    category: "technology",
    rating: 5.0,
    reviewCount: 27,
    examPassRate: 98,
    verified: true,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    hourlyRate: 180,
    about: "Former CIO with expertise in enterprise security architecture, threat detection, and security compliance frameworks. Certified CISSP and CEH with experience in finance and healthcare sectors.",
    availability: ["Mon", "Tue", "Wed", "Fri"]
  },
  {
    id: "4",
    name: "Nadia El-Masri",
    title: "Supply Chain Analyst",
    specialty: "Supply Chain",
    category: "industry",
    rating: 4.7,
    reviewCount: 19,
    examPassRate: 89,
    verified: false,
    image: "https://randomuser.me/api/portraits/women/62.jpg",
    hourlyRate: 110,
    about: "Supply chain expert specializing in logistics optimization and inventory management. Experience with international shipping, customs procedures, and ERP implementation.",
    availability: ["Wed", "Thu", "Fri"]
  },
  {
    id: "5",
    name: "Omar Saeed",
    title: "Financial Strategy Consultant",
    specialty: "Finance",
    category: "commerce",
    rating: 4.6,
    reviewCount: 23,
    examPassRate: 85,
    verified: true,
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    hourlyRate: 160,
    about: "Former CFO with expertise in financial planning, risk management, and capital allocation strategies for growing businesses. Specialization in tech startups and scale-ups.",
    availability: ["Mon", "Tue", "Thu"]
  },
  {
    id: "6",
    name: "Leila Karimi",
    title: "Software Architecture Consultant",
    specialty: "Software Development",
    category: "technology",
    rating: 4.9,
    reviewCount: 34,
    examPassRate: 94,
    verified: true,
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    hourlyRate: 150,
    about: "Senior software architect with extensive experience in cloud-native applications, microservices, and distributed systems design. Expert in AWS, Azure, and Google Cloud.",
    availability: ["Tue", "Wed", "Thu", "Sat"]
  }
];
