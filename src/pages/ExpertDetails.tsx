
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Expert, expertsMock } from "@/data/expertsMock";
import { Star, CheckCircle, MessageSquare, Calendar as CalendarIcon } from "lucide-react";

const ExpertDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  useEffect(() => {
    // In a real app, fetch from an API
    const foundExpert = expertsMock.find((e) => e.id === id);
    setExpert(foundExpert || null);
  }, [id]);
  
  if (!expert) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Expert not found</h1>
          <Link to="/experts">
            <Button>Back to Experts</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-6">
          <Link to="/experts" className="text-primary hover:underline flex items-center">
            ← Back to All Experts
          </Link>
        </div>
        
        {/* Expert Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={expert.image}
                alt={expert.name}
                className="w-full h-72 md:h-full object-cover"
              />
            </div>
            
            <div className="p-8 md:w-2/3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <h1 className="text-3xl font-bold mr-3">{expert.name}</h1>
                    {expert.verified && (
                      <Badge className="bg-primary">Verified</Badge>
                    )}
                  </div>
                  <p className="text-xl text-gray-600 mb-2">{expert.title}</p>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-6">
                      <Star className="w-5 h-5 fill-current text-yellow-500 mr-1" />
                      <span className="font-medium">{expert.rating.toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({expert.reviewCount} reviews)</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {expert.specialty}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">Hourly Rate</p>
                  <p className="text-2xl font-bold text-primary">${expert.hourlyRate}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-6 pt-6">
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-gray-700">{expert.about}</p>
              </div>
              
              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-medium text-gray-900 mb-1">Exam Pass Rate</h3>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${expert.examPassRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{expert.examPassRate}%</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button className="flex-1">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Book Session
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs Content */}
        <div className="mt-8">
          <Tabs defaultValue="availability">
            <TabsList className="mb-6">
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="availability" className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border pointer-events-auto"
                  />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2">
                      {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                        <Button key={time} variant="outline" className="justify-start">
                          {time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Please select a date to view available time slots.</p>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Available Days</h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.availability.map((day) => (
                        <Badge key={day} variant="outline" className="bg-green-50 text-green-700">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Client Reviews</h2>
              
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-gray-200 pb-6 mb-6 last:border-0">
                    <div className="flex items-start">
                      <img
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`}
                        alt="Client"
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium mr-2">Client Name {i}</h4>
                          <span className="text-sm text-gray-500">2 weeks ago</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className={`w-4 h-4 ${
                                j < 5 - i % 2 ? "fill-current text-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu
                          pharetra nec, mattis ac neque. Duis vulputate commodo lectus.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="credentials" className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Expertise & Credentials</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Certification Status</h3>
                  <div className="flex items-center">
                    {expert.verified ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium">Verified Expert</span>
                      </>
                    ) : (
                      <span className="text-amber-600">Verification in progress</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Specialization Exam</h3>
                  <div className="flex items-center mb-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${expert.examPassRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{expert.examPassRate}%</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Expert has passed the specialization exam with a score of {expert.examPassRate}%.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Consulting", "Project Management", "Process Optimization", 
                      "Team Leadership", expert.specialty].map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Education & Experience</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Master's Degree in {expert.specialty}</h4>
                      <p className="text-sm text-gray-600">University of Example, 2010-2012</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Senior Consultant</h4>
                      <p className="text-sm text-gray-600">Example Company, 2012-Present</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ExpertDetails;
