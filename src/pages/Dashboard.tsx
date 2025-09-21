import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, TrendingUp, GraduationCap, MapPin, Bell, Globe, Award, Home, LogOut } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateCollegeSuggestions, generateCourseRecommendations, generateScholarshipRecommendations, type Scholarship } from '@/lib/utils';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { avatarDataUrl, profile, setProfile, setAvatarDataUrl } = useProfile();
  const [saving, setSaving] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
      <div className="min-h-screen bg-white">
        <Header />
        {/* Main Content */}
        <main className="container mx-auto px-4 py-10">
          {/* Top toolbar: Home button + Dashboard label + User menu */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <div className="text-lg font-semibold text-gray-900">Dashboard</div>
            </div>
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 bg-white hover:shadow-sm"
                onClick={() => setShowUserMenu((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={showUserMenu}
              >
                <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                  {avatarDataUrl ? (
                    <img src={avatarDataUrl} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <span className="hidden sm:inline text-sm text-gray-700">Account</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-xl z-10">
                  <div className="p-3 border-b border-gray-200">
                    <div className="text-xs text-gray-500">Signed in as</div>
                    <div className="text-sm font-medium text-gray-900 break-all">{user?.email}</div>
                  </div>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={() => { setShowUserMenu(false); signOut(); }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome to Your Career Journey!
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover personalized career paths, explore courses, and get guidance tailored to your goals.
              </p>
            </div>

            {/* Quick Stats */}
            <section className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">Career Paths Available</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">1000+</div>
                    <div className="text-sm text-gray-600">Colleges & Universities</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">50+</div>
                    <div className="text-sm text-gray-600">States Covered</div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Main Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Career Assessment */}
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Career Assessment
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Take our comprehensive assessment to discover careers that match your interests and skills.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Progress: {profile.assessmentCompleted ? 'Completed' : 'Not Started'}
                      {profile.assessmentCompleted && profile.assessmentScore !== undefined && (
                        <span className="ml-2 text-blue-600 font-semibold">
                          ({profile.assessmentScore}/{profile.assessmentTotal})
                        </span>
                      )}
                    </p>
                    <div className="w-full bg-white rounded-full h-2 border border-gray-200">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: profile.assessmentCompleted ? '100%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
                    onClick={() => navigate('/assessment')}
                  >
                    {profile.assessmentCompleted ? 'Retake Assessment' : 'Start Assessment'}
                  </Button>
                </CardContent>
              </Card>

              {/* Complete Profile */}
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Complete Profile
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Review your details and upload a profile photo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                      {avatarDataUrl ? (
                        <img src={avatarDataUrl} alt="avatar" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
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
                      <Label className="text-gray-700">Name</Label>
                      <Input value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-white text-gray-900 placeholder:text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Age</Label>
                      <Input value={profile.age?.toString() || ''} onChange={(e) => setProfile({ ...profile, age: e.target.value })} className="bg-white text-gray-900 placeholder:text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Class / Year</Label>
                      <Input value={profile.currentClass || ''} onChange={(e) => setProfile({ ...profile, currentClass: e.target.value })} className="bg-white text-gray-900 placeholder:text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Field of Study</Label>
                      <Input value={profile.fieldOfStudy || ''} onChange={(e) => setProfile({ ...profile, fieldOfStudy: e.target.value })} className="bg-white text-gray-900 placeholder:text-gray-500" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={onSaveProfile} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {saving ? 'Saving…' : 'Save'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Course Recommendations */}
              <Card className="bg-white border border-gray-200 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Course Recommendations
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Personalized courses based on your profile and interests.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Summary */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 mb-2">Based on your profile:</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      {profile.name && <div>Name: {profile.name}</div>}
                      {profile.currentClass && <div>Class: {profile.currentClass}</div>}
                      {profile.fieldOfStudy && <div>Field: {profile.fieldOfStudy}</div>}
                      {profile.futureInterest && <div>Interests: {profile.futureInterest}</div>}
                    </div>
                  </div>

                  {courseLoading ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Generating recommendations…
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {courses.slice(0, 3).map((course, i) => (
                        <div key={course.id} className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow bg-white">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-blue-600 font-semibold">
                              {course.matchScore}% match
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{course.shortDescription}</div>
                          <div className="flex justify-between items-center text-xs text-gray-600">
                            <span>{course.provider} • {course.level} • {course.duration}</span>
                            <div className="flex gap-2">
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{course.category}</span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{course.mode}</span>
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
              <Card className="bg-white border border-gray-200 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Scholarship Opportunities
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Personalized scholarships based on your profile and background.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                    {profile.currentClass && <div>Level: {profile.currentClass}</div>}
                    {(profile.fieldOfStudy || profile.stream) && <div>Field: {profile.fieldOfStudy}{profile.stream ? ` • ${profile.stream}` : ''}</div>}
                    {(profile.state || profile.category) && <div>{profile.state ? `Location: ${profile.state}` : ''}{profile.state && profile.category ? ' • ' : ''}{profile.category ? `Category: ${profile.category}` : ''}</div>}
                  </div>
                  {scholarshipLoading ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Finding scholarships…
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scholarships.slice(0, 3).map((s) => (
                        <div key={s.id} className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow bg-white">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-gray-900">{s.name}</div>
                            <div className="text-sm text-blue-600 font-semibold">{s.matchScore}% match</div>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">{s.provider}</div>
                          <div className="text-sm text-gray-600 line-clamp-2">{s.eligibilitySummary}</div>
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
              <Card className="bg-white border border-gray-200 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    College Explorer
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Suggested colleges in India and abroad for your field.
                  </CardDescription>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Search by name, city, country, note" value={search} onChange={(e) => setSearch(e.target.value)} className="bg-white" />
                  <div className="flex items-center gap-2 md:col-span-2">
                    <Button variant={region === 'all' ? 'default' : 'outline'} onClick={() => setRegion('all')}>All</Button>
                    <Button variant={region === 'india' ? 'default' : 'outline'} onClick={() => setRegion('india')}>India</Button>
                    <Button variant={region === 'international' ? 'default' : 'outline'} onClick={() => setRegion('international')}>International</Button>
                  </div>
                </div>
                {collegeLoading ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Fetching suggestions…
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(region === 'all' || region === 'india') && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-semibold text-gray-900"><MapPin className="h-4 w-4" /> India</div>
                        <div className="space-y-2">
                          {filteredIndia.map((c, i) => (
                            <div key={`in-${i}`} className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow bg-white">
                              <div className="font-medium text-gray-900">{c.name} — {c.city}</div>
                              <div className="text-sm text-gray-600">{c.note}</div>
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
                            <div className="text-sm text-gray-600">No matches found.</div>
                          )}
                        </div>
                      </div>
                    )}
                    {(region === 'all' || region === 'international') && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-semibold text-gray-900"><Globe className="h-4 w-4" /> International</div>
                        <div className="space-y-2">
                          {filteredInternational.map((c, i) => (
                            <div key={`out-${i}`} className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow bg-white">
                              <div className="font-medium text-gray-900">{c.name} — {c.country}</div>
                              <div className="text-sm text-gray-600">{c.note}</div>
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
                            <div className="text-sm text-gray-600">No matches found.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Latest Updates
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Stay informed about admission deadlines and opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Welcome to PathFinder!</p>
                    <p className="text-xs text-gray-700 mt-1">
                      Complete your profile to get personalized recommendations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;