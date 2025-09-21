import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { 
  BookOpen, 
  Users, 
  Target, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Star,
  TrendingUp,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  GraduationCap,
  Brain,
  Lightbulb,
  Shield,
  Heart
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = ['features', 'how-it-works', 'about', 'contact'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <>
      <Helmet>
        <title>PathFinder - Your Career Path Starts Here | Digital Career Guidance Platform</title>
        <meta 
          name="description" 
          content="Personalized career and education guidance for students. Make informed academic decisions with course-to-career mapping, college information, and real-time notifications. Perfect for rural and semi-urban students."
        />
        <meta name="keywords" content="career guidance, education advisor, college information, student guidance, academic decisions, career path, rural education" />
        <link rel="canonical" href="https://pathfinder.lovableproject.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="PathFinder - Digital Career Guidance Platform" />
        <meta property="og:description" content="Personalized career guidance for students to make informed academic and career decisions" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pathfinder.lovableproject.com" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PathFinder - Your Career Path Starts Here" />
        <meta name="twitter:description" content="Personalized career and education guidance for students" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="PathFinder Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Hero />
          <ProblemSolution />
          <Features />
          
          {/* How It Works Section */}
          <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">How PathFinder Works</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our simple 4-step process helps you discover your perfect career path
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    step: "01",
                    icon: <BookOpen className="w-8 h-8" />,
                    title: "Complete Assessment",
                    description: "Take our comprehensive career assessment to understand your interests, strengths, and goals."
                  },
                  {
                    step: "02", 
                    icon: <Brain className="w-8 h-8" />,
                    title: "AI Analysis",
                    description: "Our AI analyzes your responses and matches you with suitable career paths and educational options."
                  },
                  {
                    step: "03",
                    icon: <Target className="w-8 h-8" />,
                    title: "Get Recommendations",
                    description: "Receive personalized course recommendations, college suggestions, and scholarship opportunities."
                  },
                  {
                    step: "04",
                    icon: <Award className="w-8 h-8" />,
                    title: "Start Your Journey",
                    description: "Begin your educational journey with confidence, knowing you're on the right path to success."
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className={`text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                      visibleSections.has('how-it-works') ? 'animate-slide-in-up' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full mb-4 text-2xl font-bold">
                      {item.step}
                    </div>
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`${visibleSections.has('about') ? 'animate-slide-in-left' : 'opacity-0'}`}>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">About PathFinder</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    PathFinder is a comprehensive career guidance platform designed specifically for Indian students. 
                    We understand the unique challenges faced by students in choosing their academic and career paths.
                  </p>
                  <p className="text-lg text-gray-600 mb-8">
                    Our mission is to democratize career guidance by making it accessible, personalized, and data-driven. 
                    We believe every student deserves the opportunity to make informed decisions about their future.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: <Users className="w-6 h-6" />, label: "Students Helped", value: "10,000+" },
                      { icon: <GraduationCap className="w-6 h-6" />, label: "Colleges Listed", value: "1,000+" },
                      { icon: <Award className="w-6 h-6" />, label: "Success Rate", value: "95%" },
                      { icon: <Star className="w-6 h-6" />, label: "User Rating", value: "4.8/5" }
                    ].map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full mb-2">
                          {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`${visibleSections.has('about') ? 'animate-slide-in-right' : 'opacity-0'}`}>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                      <h3 className="text-2xl font-bold mb-6">Our Values</h3>
                      <div className="space-y-4">
                        {[
                          { icon: <Lightbulb className="w-5 h-5" />, text: "Innovation in education technology" },
                          { icon: <Heart className="w-5 h-5" />, text: "Empathy for student challenges" },
                          { icon: <Shield className="w-5 h-5" />, text: "Trust and data security" },
                          { icon: <Globe className="w-5 h-5" />, text: "Accessibility for all students" }
                        ].map((value, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="flex-shrink-0">{value.icon}</div>
                            <span>{value.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Have questions? We're here to help you on your career journey
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className={`${visibleSections.has('contact') ? 'animate-slide-in-left' : 'opacity-0'}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                    <div className="space-y-6">
                      {[
                        { icon: <Mail className="w-5 h-5" />, label: "Email", value: "support@pathfinder.com" },
                        { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+91 98765 43210" },
                        { icon: <MapPin className="w-5 h-5" />, label: "Address", value: "Mumbai, Maharashtra, India" },
                        { icon: <Clock className="w-5 h-5" />, label: "Hours", value: "Mon-Fri 9AM-6PM IST" }
                      ].map((contact, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            {contact.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{contact.label}</div>
                            <div className="text-gray-600">{contact.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={`${visibleSections.has('contact') ? 'animate-slide-in-right' : 'opacity-0'}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Your Name"
                          aria-label="Your Name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          aria-label="Your Email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Subject"
                        aria-label="Subject"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <textarea
                        rows={4}
                        placeholder="Your Message"
                        aria-label="Your Message"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
                        onClick={handleGetStarted}
                      >
                        Send Message
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;