import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-indian-student.jpg";

const Hero = () => {
  return (
    <section className="bg-gradient-subtle py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>95% Success Rate</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Career Path
                <span className="text-primary"> Starts Here</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Personalized guidance for students from Class 10 onwards to make informed academic 
                and career decisions. No more confusion, just clear pathways to success.
              </p>
            </div>

            {/* Problem Statement */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
              <h3 className="font-semibold text-foreground mb-3">
                Are you struggling with these questions?
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Which subject stream should I choose after Class 10?</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>What degree programs are available in government colleges?</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Which career paths offer the best opportunities?</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="xl" className="group bg-primary hover:bg-primary/90">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="border-border hover:bg-card">
                Learn More
              </Button>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-muted-foreground">
              Join thousands of students who found their perfect career path with PathFinder
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img
                src={heroImage}
                alt="Indian student thoughtfully planning career decisions with laptop and books"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-medium">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">Career Paths</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-medium">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1000+</div>
                <div className="text-xs text-muted-foreground">Colleges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;