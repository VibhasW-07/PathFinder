import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, LogOut, User, TrendingUp, GraduationCap, MapPin, Bell, Home, Globe, Award } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateCollegeSuggestions, generateCourseRecommendations, generateScholarshipRecommendations, type Scholarship } from '@/lib/utils';

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { avatarDataUrl, profile, setProfile, setAvatarDataUrl } = useProfile();
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [collegeLoading, setCollegeLoading] = useState(true);
  const [india, setIndia] = useState<Array<{ name: string; city: string; note: string }>>([]);
  const [international, setInternational] = useState<Array<{ name: string; country: string; note: string }>>([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<'all' | 'india' | 'international'>('all');
  const [openMapKey, setOpenMapKey] = useState<string | null>(null);
  const [courses, setCourses] = useState<Array<{ id: string; title: string; shortDescription: string; level: string; duration: string; provider: string; matchScore: number; category: string; mode: string }>>([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [scholarshipLoading, setScholarshipLoading] = useState(true);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setAvatarDataUrl(data);
    };
    reader.readAsDataURL(file);
  };

  const onSaveProfile = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 400);
  };

  // Fetch college suggestions when profile changes (field/class)
  useState(() => {
    let active = true;
    (async () => {
      setCollegeLoading(true);
      const res = await generateCollegeSuggestions({ fieldOfStudy: profile.fieldOfStudy, currentClass: profile.currentClass, futureInterest: profile.futureInterest, state: profile.state });
      if (active) {
        setIndia(res.india);
        setInternational(res.international);
        setCollegeLoading(false);
      }
    })();
    return () => { active = false; };
  });

  // Fetch course recommendations when profile changes
  useState(() => {
    let active = true;
    (async () => {
      setCourseLoading(true);
      const res = await generateCourseRecommendations(profile);
      if (active) {
        setCourses(res.courses);
        setCourseLoading(false);
      }
    })();
    return () => { active = false; };
  });

  // Fetch scholarship recommendations when profile changes
  useState(() => {
    let active = true;
    (async () => {
      setScholarshipLoading(true);
      const res = await generateScholarshipRecommendations(profile as any);
      if (active) {
        setScholarships(res.scholarships);
        setScholarshipLoading(false);
      }
    })();
    return () => { active = false; };
  });

  const filteredIndia = useMemo(() =>
    india.filter(c => {
      const q = search.toLowerCase();
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.note.toLowerCase().includes(q);
    }), [india, search]);

  const filteredInternational = useMemo(() =>
    international.filter(c => {
      const q = search.toLowerCase();
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.note.toLowerCase().includes(q);
    }), [international, search]);

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
                <Button variant="outline" onClick={() => navigate('/') } className="text-muted-foreground">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="h-6 w-6 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                    {avatarDataUrl ? <img src={avatarDataUrl} alt="avatar" className="h-full w-full object-cover" /> : <User className="h-4 w-4" />}
                  </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Card className="bg-card border-border shadow-soft hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground">Career Paths Available</div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border shadow-soft hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <GraduationCap className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">1000+</div>
                  <div className="text-sm text-muted-foreground">Colleges & Universities</div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border shadow-soft hover:shadow-md transition-shadow">
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
                    <p className="text-sm text-muted-foreground mb-2">
                      Progress: {profile.assessmentCompleted ? 'Completed' : 'Not Started'}
                      {profile.assessmentCompleted && profile.assessmentScore !== undefined && (
                        <span className="ml-2 text-primary font-semibold">
                          ({profile.assessmentScore}/{profile.assessmentTotal})
                        </span>
                      )}
                    </p>
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500" 
                        style={{ width: profile.assessmentCompleted ? '100%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90" 
                    onClick={() => navigate('/assessment')}
                  >
                    {profile.assessmentCompleted ? 'Retake Assessment' : 'Start Assessment'}
                  </Button>
                </CardContent>
              </Card>

              {/* Complete Profile */}
              <Card className="bg-card border-border shadow-medium">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Complete Profile
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Review your details and upload a profile photo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                      {avatarDataUrl ? (
                        <img src={avatarDataUrl} alt="avatar" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                      <Button onClick={() => fileRef.current?.click()}>Upload Photo</Button>
                      <Button variant="outline" onClick={() => setAvatarDataUrl(undefined)}>Remove</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input value={profile.age?.toString() || ''} onChange={(e) => setProfile({ ...profile, age: e.target.value })} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label>Class / Year</Label>
                      <Input value={profile.currentClass || ''} onChange={(e) => setProfile({ ...profile, currentClass: e.target.value })} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Input value={profile.fieldOfStudy || ''} onChange={(e) => setProfile({ ...profile, fieldOfStudy: e.target.value })} className="bg-background" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={onSaveProfile} disabled={saving} className="bg-primary hover:bg-primary/90">
                      {saving ? 'Saving…' : 'Save'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Course Recommendations */}
              <Card className="bg-card border-border shadow-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Course Recommendations
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Personalized courses based on your profile and interests.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Summary */}
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium text-foreground mb-2">Based on your profile:</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {profile.name && <div>Name: {profile.name}</div>}
                      {profile.currentClass && <div>Class: {profile.currentClass}</div>}
                      {profile.fieldOfStudy && <div>Field: {profile.fieldOfStudy}</div>}
                      {profile.futureInterest && <div>Interests: {profile.futureInterest}</div>}
                    </div>
                  </div>

                  {courseLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Generating recommendations…
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {courses.slice(0, 3).map((course, i) => (
                        <div key={course.id} className="p-3 rounded-lg border hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-primary font-semibold">
                              {course.matchScore}% match
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">{course.shortDescription}</div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{course.provider} • {course.level} • {course.duration}</span>
                            <div className="flex gap-2">
                              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">{course.category}</span>
                              <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full">{course.mode}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end pt-2">
                        <Button variant="outline" onClick={() => navigate('/courses')}>
                          Explore All Courses
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scholarship Opportunities */}
              <Card className="bg-card border-border shadow-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Scholarship Opportunities
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Personalized scholarships based on your profile and background.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground">
                    {profile.currentClass && <div>Level: {profile.currentClass}</div>}
                    {(profile.fieldOfStudy || profile.stream) && <div>Field: {profile.fieldOfStudy}{profile.stream ? ` • ${profile.stream}` : ''}</div>}
                    {(profile.state || profile.category) && <div>{profile.state ? `Location: ${profile.state}` : ''}{profile.state && profile.category ? ' • ' : ''}{profile.category ? `Category: ${profile.category}` : ''}</div>}
                  </div>
                  {scholarshipLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Finding scholarships…
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scholarships.slice(0, 3).map((s) => (
                        <div key={s.id} className="p-3 rounded-lg border hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium">{s.name}</div>
                            <div className="text-sm text-primary font-semibold">{s.matchScore}% match</div>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">{s.provider}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{s.eligibilitySummary}</div>
                        </div>
                      ))}
                      <div className="flex justify-end pt-2">
                        <Button variant="outline" onClick={() => navigate('/scholarships')}>
                          View All Scholarships
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* College Explorer */}
              <Card className="bg-card border-border shadow-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    College Explorer
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Suggested colleges in India and abroad for your field.
                  </CardDescription>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Search by name, city, country, note" value={search} onChange={(e) => setSearch(e.target.value)} className="bg-background" />
                  <div className="flex items-center gap-2 md:col-span-2">
                    <Button variant={region === 'all' ? 'default' : 'outline'} onClick={() => setRegion('all')}>All</Button>
                    <Button variant={region === 'india' ? 'default' : 'outline'} onClick={() => setRegion('india')}>India</Button>
                    <Button variant={region === 'international' ? 'default' : 'outline'} onClick={() => setRegion('international')}>International</Button>
                  </div>
                </div>
                {collegeLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    Fetching suggestions…
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(region === 'all' || region === 'india') && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-semibold"><MapPin className="h-4 w-4" /> India</div>
                        <div className="space-y-2">
                          {filteredIndia.map((c, i) => (
                            <div key={`in-${i}`} className="p-3 rounded-lg border hover:shadow-sm transition-shadow">
                              <div className="font-medium">{c.name} — {c.city}</div>
                              <div className="text-sm text-muted-foreground">{c.note}</div>
                              <div className="mt-2 flex justify-end">
                                <Button variant="outline" size="sm" onClick={() => setOpenMapKey((k) => k === `in-${i}` ? null : `in-${i}`)}>
                                  {openMapKey === `in-${i}` ? 'Hide map' : 'Show map'}
                                </Button>
                              </div>
                              {openMapKey === `in-${i}` && (
                                <div className="mt-3 rounded-md overflow-hidden animate-in fade-in">
                                  <iframe
                                    title={`${c.name} map`}
                                    className="w-full h-56"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(c.name + ' ' + c.city)}&output=embed`}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          {filteredIndia.length === 0 && (
                            <div className="text-sm text-muted-foreground">No matches found.</div>
                          )}
                        </div>
                      </div>
                    )}
                    {(region === 'all' || region === 'international') && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-semibold"><Globe className="h-4 w-4" /> International</div>
                        <div className="space-y-2">
                          {filteredInternational.map((c, i) => (
                            <div key={`out-${i}`} className="p-3 rounded-lg border hover:shadow-sm transition-shadow">
                              <div className="font-medium">{c.name} — {c.country}</div>
                              <div className="text-sm text-muted-foreground">{c.note}</div>
                              <div className="mt-2 flex justify-end">
                                <Button variant="outline" size="sm" onClick={() => setOpenMapKey((k) => k === `out-${i}` ? null : `out-${i}`)}>
                                  {openMapKey === `out-${i}` ? 'Hide map' : 'Show map'}
                                </Button>
                              </div>
                              {openMapKey === `out-${i}` && (
                                <div className="mt-3 rounded-md overflow-hidden animate-in fade-in">
                                  <iframe
                                    title={`${c.name} map`}
                                    className="w-full h-56"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(c.name + ' ' + c.country)}&output=embed`}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          {filteredInternational.length === 0 && (
                            <div className="text-sm text-muted-foreground">No matches found.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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