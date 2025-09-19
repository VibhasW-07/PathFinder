import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, GraduationCap, Bell, MapPin, BookOpen, Users, Sparkles, Target, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import careerCompass from "@/assets/career-compass.jpg";
import collegePathways from "@/assets/college-pathways.jpg";
import smartNotifications from "@/assets/smart-notifications.jpg";

const Features = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<Set<number>>(new Set());
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleFeatures(prev => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureElements = document.querySelectorAll('[data-index]');
    featureElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Compass,
      title: "Personalized Career Guidance",
      description: "Get customized recommendations based on your interests, skills, and academic performance. Our AI-powered system creates unique pathways for each student.",
      image: careerCompass,
      badge: "AI-Powered",
      benefits: ["Interest-based matching", "Skill assessments", "Personality analysis", "Future trend insights"],
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: GraduationCap,
      title: "Course to Career Mapping",
      description: "Understand exactly how your academic choices connect to real-world career opportunities. See clear pathways from subjects to professions.",
      image: collegePathways,
      badge: "Comprehensive",
      benefits: ["Subject-career connections", "Salary expectations", "Growth prospects", "Required qualifications"],
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Stay updated with admission deadlines, scholarship opportunities, entrance exam dates, and important educational announcements.",
      image: smartNotifications,
      badge: "Always Updated",
      benefits: ["Admission alerts", "Scholarship notifications", "Exam reminders", "Career opportunities"],
      color: "from-green-500 to-blue-600"
    }
  ];

  const additionalFeatures = [
    {
      icon: MapPin,
      title: "Government College Database",
      description: "Access comprehensive information about government colleges, their programs, fees, and admission criteria."
    },
    {
      icon: BookOpen,
      title: "Study Resources",
      description: "Get access to curated study materials, practice tests, and preparation guides for various entrance exams."
    },
    {
      icon: Users,
      title: "Peer Community",
      description: "Connect with fellow students, share experiences, and get advice from those who've walked similar paths."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Key Features</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Everything You Need for
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
              Smart Decisions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and information you need to make 
            informed academic and career choices, especially designed for students in rural and semi-urban areas.
          </p>
        </div>

        {/* Main Features */}
        <div className="space-y-20 mb-20">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              data-index={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                visibleFeatures.has(index) ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                    <span className="text-sm font-medium text-gray-700">{feature.badge}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div 
                      key={benefit} 
                      className="flex items-center space-x-3 group"
                      onMouseEnter={() => setHoveredFeature(index)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        hoveredFeature === index ? 'bg-blue-500 scale-125' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div 
                  className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 group"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="absolute bottom-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <CardHeader>
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;