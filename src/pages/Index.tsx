import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
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
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;