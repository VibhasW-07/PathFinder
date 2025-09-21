import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, TrendingUp, BookOpen, GraduationCap, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import heroImage from "@/assets/hero-indian-student.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartJourney = () => {
    navigate('/auth');
  };

  const handleLearnMore = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* 3D Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-indigo-400 to-pink-500 rounded-lg opacity-15 animate-float-medium rotate-45"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full opacity-10 animate-float-fast"></div>
        <div className="absolute top-60 left-1/2 w-12 h-12 bg-gradient-to-br from-pink-400 to-indigo-500 rounded-lg opacity-20 animate-float-slow rotate-12"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-32 right-1/3 w-8 h-8 text-blue-400 opacity-30 animate-bounce-slow">
          <BookOpen className="w-full h-full" />
        </div>
        <div className="absolute bottom-32 right-1/4 w-6 h-6 text-purple-400 opacity-25 animate-bounce-medium">
          <GraduationCap className="w-full h-full" />
        </div>
        <div className="absolute top-1/2 left-1/4 w-7 h-7 text-indigo-400 opacity-20 animate-bounce-fast">
          <Target className="w-full h-full" />
        </div>
        <div className="absolute bottom-20 left-1/3 w-5 h-5 text-pink-400 opacity-30 animate-bounce-slow">
          <Zap className="w-full h-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Trust Indicators with Animation */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="font-medium">10,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.8/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">95% Success Rate</span>
              </div>
            </div>

            {/* Main Headline with Text Animation */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                <span className="block">Your Career Path</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                  Starts Here
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Personalized guidance for students from Class 10 onwards to make informed academic 
                and career decisions. No more confusion, just clear pathways to success.
              </p>
            </div>

            {/* Interactive Problem Statement */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                Are you struggling with these questions?
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-3 group">
                  <span className="text-red-500 mt-1 group-hover:scale-110 transition-transform">•</span>
                  <span className="group-hover:text-gray-800 transition-colors">Which subject stream should I choose after Class 10?</span>
                </li>
                <li className="flex items-start space-x-3 group">
                  <span className="text-red-500 mt-1 group-hover:scale-110 transition-transform">•</span>
                  <span className="group-hover:text-gray-800 transition-colors">What degree programs are available in government colleges?</span>
                </li>
                <li className="flex items-start space-x-3 group">
                  <span className="text-red-500 mt-1 group-hover:scale-110 transition-transform">•</span>
                  <span className="group-hover:text-gray-800 transition-colors">Which career paths offer the best opportunities?</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons with 3D Effects */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="default" 
                size="xl" 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                onClick={handleStartJourney}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="default" 
                size="xl" 
                className="bg-black text-white hover:bg-black/90 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>

            {/* Social Proof with Animation */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-600 text-center">
                Join thousands of students who found their perfect career path with PathFinder
              </p>
            </div>
          </div>

          {/* Hero Image with 3D Effects */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative group">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <img
                  src={heroImage}
                  alt="Indian student thoughtfully planning career decisions with laptop and books"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Stats with 3D Effect */}
              <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">500+</div>
                  <div className="text-sm text-gray-600 font-medium">Career Paths</div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">1000+</div>
                  <div className="text-sm text-gray-600 font-medium">Colleges</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;