import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfile } from '@/hooks/useProfile';
import { generateCourseRecommendations } from '@/lib/utils';

type Course = { id: string; title: string; shortDescription: string; level: string; duration: string; provider: string; matchScore: number; category: string; mode: string };

const Courses = () => {
  const { profile } = useProfile();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('match');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await generateCourseRecommendations(profile);
      if (mounted) {
        setCourses(res.courses);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [profile]);

  const filteredCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = !search || course.title.toLowerCase().includes(search.toLowerCase()) || 
                           course.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
                           course.provider.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      const matchesMode = modeFilter === 'all' || course.mode === modeFilter;
      return matchesSearch && matchesCategory && matchesMode;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchScore - a.matchScore;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return a.duration.localeCompare(b.duration);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, search, categoryFilter, modeFilter, sortBy]);

  return (
    <>
      <Helmet>
        <title>Course Recommendations | PathFinder</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-subtle px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Recommended Courses</h1>
            <p className="text-muted-foreground">Based on your profile and interests</p>
          </div>

          {/* Filters */}
          <Card className="bg-card border-border shadow-medium">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input 
                  placeholder="Search courses..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="bg-background" 
                />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Aptitude">Aptitude</SelectItem>
                    <SelectItem value="Career">Career</SelectItem>
                    <SelectItem value="Language">Language</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Domain-specific">Domain-specific</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={modeFilter} onValueChange={setModeFilter}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Match Score</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Fetching recommendations…
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((c) => (
                <Card key={c.id} className="bg-card border-border shadow-medium hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{c.title}</CardTitle>
                      <div className="text-sm text-primary font-semibold">
                        {c.matchScore}% match
                      </div>
                    </div>
                    <CardDescription>{c.provider} • {c.level} • {c.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{c.shortDescription}</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">{c.category}</span>
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">{c.mode}</span>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline">View details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredCourses.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No courses found matching your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Courses;


