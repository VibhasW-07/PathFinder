import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, GraduationCap, Bell, MapPin, BookOpen, Users } from "lucide-react";
import careerCompass from "@/assets/career-compass.jpg";
import collegePathways from "@/assets/college-pathways.jpg";
import smartNotifications from "@/assets/smart-notifications.jpg";

const Features = () => {
  const features = [
    {
      icon: Compass,
      title: "Personalized Career Guidance",
      description: "Get customized recommendations based on your interests, skills, and academic performance. Our AI-powered system creates unique pathways for each student.",
      image: careerCompass,
      badge: "AI-Powered",
      benefits: ["Interest-based matching", "Skill assessments", "Personality analysis", "Future trend insights"]
    },
    {
      icon: GraduationCap,
      title: "Course to Career Mapping",
      description: "Understand exactly how your academic choices connect to real-world career opportunities. See clear pathways from subjects to professions.",
      image: collegePathways,
      badge: "Comprehensive",
      benefits: ["Subject-career connections", "Salary expectations", "Growth prospects", "Required qualifications"]
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Stay updated with admission deadlines, scholarship opportunities, entrance exam dates, and important educational announcements.",
      image: smartNotifications,
      badge: "Always Updated",
      benefits: ["Admission alerts", "Scholarship notifications", "Exam reminders", "Career opportunities"]
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
    <section id="features" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Key Features</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need for
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Smart Decisions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and information you need to make 
            informed academic and career choices, especially designed for students in rural and semi-urban areas.
          </p>
        </div>

        {/* Main Features */}
        <div className="space-y-16 mb-16">
          {features.map((feature, index) => (
            <div key={feature.title} className={`grid lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'lg:grid-cols-2' : ''
            }`}>
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-primary p-3 rounded-xl">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <Badge variant="outline">{feature.badge}</Badge>
                </div>
                
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {feature.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-medium">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature) => (
            <Card key={feature.title} className="hover:shadow-medium transition-all duration-300 group">
              <CardHeader>
                <div className="bg-gradient-subtle p-3 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
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