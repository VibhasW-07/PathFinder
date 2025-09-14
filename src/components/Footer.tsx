import { Button } from "@/components/ui/button";
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">PathFinder</h3>
                <p className="text-xs text-muted-foreground">Career Guidance Platform</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Empowering students with personalized career guidance and educational insights 
              to make informed academic decisions.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="#features" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Features
              </a>
              <a href="#how-it-works" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                How It Works
              </a>
              <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                About Us
              </a>
              <a href="#pricing" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Pricing
              </a>
              <a href="#blog" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Blog
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <div className="space-y-2">
              <a href="#career-guide" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Career Guide
              </a>
              <a href="#college-database" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                College Database
              </a>
              <a href="#study-materials" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Study Materials
              </a>
              <a href="#faq" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                FAQ
              </a>
              <a href="#support" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Support
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@pathfinder.in</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>New Delhi, India</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="font-medium text-foreground mb-2">Stay Updated</h5>
              <p className="text-xs text-muted-foreground mb-3">
                Get the latest updates on admissions and career opportunities.
              </p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button size="sm" variant="default" className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 PathFinder. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;