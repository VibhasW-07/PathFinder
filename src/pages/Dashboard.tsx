import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, LogOut, User, TrendingUp, GraduationCap, MapPin, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | PathFinder - Your Career Path Starts Here</title>
        <meta name="description" content="Access your personalized career guidance dashboard with course recommendations and progress tracking." />
      </Helmet>

      <div className="min-h-screen bg-gradient-subtle">
        {/* Header */}
        <header className="bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-primary p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">PathFinder</h1>
                  <p className="text-xs text-muted-foreground">Dashboard</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button variant="ghost" onClick={signOut} className="text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Welcome to Your Career Journey!
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover personalized career paths, explore courses, and get guidance tailored to your goals.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border shadow-soft">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground">Career Paths Available</div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border shadow-soft">
                <CardContent className="p-6 text-center">
                  <GraduationCap className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">1000+</div>
                  <div className="text-sm text-muted-foreground">Colleges & Universities</div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border shadow-soft">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">50+</div>
                  <div className="text-sm text-muted-foreground">States Covered</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Career Assessment */}
              <Card className="bg-card border-border shadow-medium">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Career Assessment
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Take our comprehensive assessment to discover careers that match your interests and skills.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Progress: Not Started</p>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-0"></div>
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>

              {/* Course Recommendations */}
              <Card className="bg-card border-border shadow-medium">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Course Recommendations
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Explore courses and degree programs tailored to your career interests.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium text-foreground">Complete Profile</span>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium text-foreground">Browse Programs</span>
                      <Button variant="outline" size="sm">Explore</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* College Explorer */}
              <Card className="bg-card border-border shadow-medium">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    College Explorer
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Find and compare colleges that offer your preferred courses.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Explore Colleges
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="bg-card border-border shadow-medium">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Latest Updates
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Stay informed about admission deadlines and opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm font-medium text-foreground">Welcome to PathFinder!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Complete your profile to get personalized recommendations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;