import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

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

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <ProblemSolution />
          <Features />
          <section id="overview" className="container mx-auto px-4 py-12 space-y-8">
            <h2 className="text-2xl font-bold">Explore PathFinder</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border shadow-medium">
                <CardHeader>
                  <CardTitle>Colleges</CardTitle>
                  <CardDescription>Find and compare colleges for your field.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end">
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>Explore</Button>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-medium">
                <CardHeader>
                  <CardTitle>Course Recommendations</CardTitle>
                  <CardDescription>See courses tailored to your profile and interests.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end">
                  <Button variant="outline" onClick={() => navigate('/courses')}>View Courses</Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;