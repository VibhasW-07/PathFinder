import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfile } from '@/hooks/useProfile';
import { Scholarship, generateScholarshipRecommendations } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/integrations/supabase/client';

const Scholarships = () => {
  const { profile } = useProfile();
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('match');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await generateScholarshipRecommendations(profile);
      if (mounted) {
        setScholarships(res.scholarships);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [profile]);

  const filtered = useMemo(() => {
    let list = scholarships.filter(s => {
      const q = search.toLowerCase();
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q) || s.eligibilitySummary.toLowerCase().includes(q);
      const matchesField = fieldFilter === 'all' || (s.fields || []).includes(fieldFilter);
      const matchesCat = categoryFilter === 'all' || (s.categories || []).includes(categoryFilter);
      const matchesLoc = locationFilter === 'all' || (s.locations || []).includes(locationFilter);
      return matchesSearch && matchesField && matchesCat && matchesLoc;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchScore - a.matchScore;
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'amount':
          // naive: prioritize numeric-looking amounts
          const nA = parseInt(a.amount.replace(/[^0-9]/g, '')) || 0;
          const nB = parseInt(b.amount.replace(/[^0-9]/g, '')) || 0;
          return nB - nA;
        default:
          return 0;
      }
    });

    return list;
  }, [scholarships, search, fieldFilter, categoryFilter, locationFilter, sortBy]);

  const onApply = (url: string) => {
    try {
      // Track click
      if (user) {
        // find by url-based id fallback
        const s = scholarships.find(x => x.applyUrl === url);
        if (s) db.trackScholarship({ user_id: user.id, scholarship_id: s.id, application_status: 'clicked' });
      }
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    } catch {}
  };

  return (
    <>
      <Helmet>
        <title>Scholarship Opportunities | PathFinder</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-subtle px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Scholarship Opportunities</h1>
            <p className="text-muted-foreground">Recommended based on your profile</p>
          </div>

          {/* Profile Summary */}
          <Card className="bg-card border-border shadow-medium">
            <CardContent className="p-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-muted-foreground">
                {profile.currentClass && <div><span className="text-foreground font-medium">Academic level:</span> {profile.currentClass}</div>}
                {profile.fieldOfStudy && <div><span className="text-foreground font-medium">Field/Stream:</span> {profile.fieldOfStudy}{profile.stream ? ` • ${profile.stream}` : ''}</div>}
                {profile.state && <div><span className="text-foreground font-medium">Location:</span> {profile.city ? `${profile.city}, ` : ''}{profile.state}</div>}
                {profile.category && <div><span className="text-foreground font-medium">Category:</span> {profile.category}</div>}
                {profile.annualFamilyIncome && <div><span className="text-foreground font-medium">Family income:</span> {String(profile.annualFamilyIncome)}</div>}
                {profile.lastExamPercentage !== undefined && <div><span className="text-foreground font-medium">Last percentage:</span> {profile.lastExamPercentage}%</div>}
                {profile.aspirations && <div className="md:col-span-3"><span className="text-foreground font-medium">Aspirations:</span> {profile.aspirations}</div>}
                {profile.achievements && <div className="md:col-span-3"><span className="text-foreground font-medium">Achievements:</span> {profile.achievements}</div>}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="bg-card border-border shadow-medium">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input placeholder="Search scholarships..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-background" />
                <Select value={fieldFilter} onValueChange={setFieldFilter}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Field" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Commerce">Commerce</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Medicine">Medicine</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="EWS">EWS</SelectItem>
                    <SelectItem value="OBC">OBC</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="PwD">PwD</SelectItem>
                    <SelectItem value="Women">Women</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Location" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    {profile.state && <SelectItem value={profile.state}>{profile.state}</SelectItem>}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Sort by" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Match Score</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* List */}
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Fetching scholarship recommendations…
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map(s => (
                <Card key={s.id} className="bg-card border-border shadow-medium hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{s.name}</CardTitle>
                      <div className="text-sm text-primary font-semibold">{s.matchScore}% match</div>
                    </div>
                    <CardDescription>{s.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{s.eligibilitySummary}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {s.amount && <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">{s.amount}</span>}
                      {s.deadline && <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full">Deadline: {s.deadline}</span>}
                      {s.fields?.map(f => <span key={f} className="px-2 py-1 bg-muted text-muted-foreground rounded-full">{f}</span>)}
                      {s.categories?.map(c => <span key={c} className="px-2 py-1 bg-muted text-muted-foreground rounded-full">{c}</span>)}
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={() => onApply(s.applyUrl)}>Apply</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-8">No scholarships match your filters.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Scholarships;


