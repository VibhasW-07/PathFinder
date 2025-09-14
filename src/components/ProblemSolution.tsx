import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ArrowRight, Users, School, Briefcase } from "lucide-react";
const ProblemSolution = () => {
  const problems = [{
    icon: School,
    title: "Subject Stream Confusion",
    description: "Students struggle to choose between Arts, Science, Commerce, or Vocational streams after Class 10.",
    impact: "Leads to poor academic performance and career misalignment"
  }, {
    icon: Users,
    title: "Lack of College Awareness",
    description: "Limited knowledge about degree programs and admission processes in government colleges.",
    impact: "Results in migration to expensive private institutions"
  }, {
    icon: Briefcase,
    title: "Career Uncertainty",
    description: "Unclear about job opportunities, higher studies, and skill-based vs traditional education.",
    impact: "Causes dropouts and poor career decisions"
  }];
  const solutions = [{
    title: "Personalized Assessment",
    description: "AI-powered tools analyze your interests, aptitude, and personality to recommend the best academic path."
  }, {
    title: "Comprehensive Database",
    description: "Access detailed information about 1000+ government colleges, their programs, fees, and admission criteria."
  }, {
    title: "Career Roadmaps",
    description: "Visual pathways showing how each subject connects to specific careers with salary expectations and growth prospects."
  }, {
    title: "Real-time Updates",
    description: "Get notified about admission deadlines, scholarships, entrance exams, and job opportunities."
  }];
  return <section className="py-16 lg:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="destructive" className="mb-4">The Problem</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            The Education Crisis in
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Rural India</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Millions of students, especially in rural and semi-urban areas, face confusion and make 
            poor academic decisions due to lack of proper guidance and information.
          </p>
        </div>

        {/* Problems Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <AlertTriangle className="h-8 w-8 text-destructive mr-3" />
            <h3 className="text-2xl font-bold text-foreground">Current Challenges</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {problems.map(problem => <Card key={problem.title} className="border-destructive/20 hover:border-destructive/40 transition-colors">
                <CardHeader>
                  <div className="bg-destructive/10 p-3 rounded-xl w-fit">
                    <problem.icon className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-red-600">{problem.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-base">
                    {problem.description}
                  </CardDescription>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground font-medium">
                      Impact: {problem.impact}
                    </p>
                  </div>
                </CardContent>
              </Card>)}
          </div>

          {/* Statistics */}
          <div className="bg-card border border-destructive/20 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-destructive mb-2">40%</div>
                <p className="text-muted-foreground">Students choose wrong streams</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-destructive mb-2">60%</div>
                <p className="text-muted-foreground">Drop out due to poor decisions</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-destructive mb-2">70%</div>
                <p className="text-muted-foreground">Lack college information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Solutions Section */}
        <div>
          <div className="flex items-center justify-center mb-8">
            <CheckCircle className="h-8 w-8 text-success mr-3" />
            <h3 className="text-2xl font-bold text-foreground">Our Solution</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {solutions.map((solution, index) => <Card key={solution.title} className="border-success/20 hover:border-success/40 transition-colors group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-success/10 p-2 rounded-lg">
                      <span className="text-success font-bold">{index + 1}</span>
                    </div>
                    <CardTitle className="text-lg text-success">{solution.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {solution.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>

          {/* Results */}
          <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-8">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold mb-4">Expected Impact with PathFinder</h4>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto">
                Our comprehensive guidance platform aims to dramatically improve academic and career outcomes for students.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center mb-8">
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <p className="text-primary-foreground/90">Make informed decisions</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">80%</div>
                <p className="text-primary-foreground/90">Reduce dropouts</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">90%</div>
                <p className="text-primary-foreground/90">Find suitable colleges</p>
              </div>
            </div>

            <div className="text-center">
              <Button variant="secondary" size="lg" className="group">
                Join the Solution
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ProblemSolution;