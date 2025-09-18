import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { generateAssessmentQuestions } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';

const years = ['Class 9', 'Class 10', 'Class 11', 'Class 12', '1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Postgraduate'];
const fields = ['Science', 'Commerce', 'Arts/Humanities', 'Engineering', 'Medicine', 'Law', 'Management', 'Computer Science', 'Design', 'Other'];

const AssessmentForm = () => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    dob: '',
    state: '',
    currentClass: '',
    institution: '',
    fieldOfStudy: '',
    futureInterest: '',
    strengths: '',
    hobbies: '',
    preferredStudyStyle: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setProfile } = useProfile();

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.currentClass || !form.fieldOfStudy) return;
    setSubmitting(true);
    const { questions } = await generateAssessmentQuestions({
      name: form.name,
      age: Number(form.age),
      dob: form.dob,
      state: form.state,
      currentClass: form.currentClass,
      institution: form.institution,
      fieldOfStudy: form.fieldOfStudy,
      futureInterest: form.futureInterest,
      extra: {
        strengths: form.strengths,
        hobbies: form.hobbies,
        preferredStudyStyle: form.preferredStudyStyle,
      }
    });
    setSubmitting(false);
    setProfile({
      name: form.name,
      age: form.age,
      dob: form.dob,
      state: form.state,
      currentClass: form.currentClass,
      institution: form.institution,
      fieldOfStudy: form.fieldOfStudy,
      futureInterest: form.futureInterest,
      strengths: form.strengths,
      hobbies: form.hobbies,
      preferredStudyStyle: form.preferredStudyStyle,
    });
    navigate('/assessment/test', { state: { questions, profile: form } });
  };

  return (
    <>
      <Helmet>
        <title>Career Assessment | PathFinder</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-subtle px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card border-border shadow-medium">
            <CardHeader>
              <CardTitle className="text-2xl">Career Assessment</CardTitle>
              <CardDescription>Tell us about yourself. We will tailor a 10–12 question test for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="e.g., Ananya Sharma" value={form.name} onChange={(e) => update('name', e.target.value)} required className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" min={12} max={60} placeholder="e.g., 18" value={form.age} onChange={(e) => update('age', e.target.value)} required className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="e.g., Maharashtra" value={form.state} onChange={(e) => update('state', e.target.value)} className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label>Class / Year</Label>
                    <Select value={form.currentClass} onValueChange={(v) => update('currentClass', v)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">University / School</Label>
                    <Input id="institution" placeholder="e.g., SPPU" value={form.institution} onChange={(e) => update('institution', e.target.value)} className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    <Select value={form.fieldOfStudy} onValueChange={(v) => update('fieldOfStudy', v)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="futureInterest">Interest in Future Studies</Label>
                    <Input id="futureInterest" placeholder="e.g., AI/ML, Civil Services, MBA" value={form.futureInterest} onChange={(e) => update('futureInterest', e.target.value)} className="bg-background" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="strengths">Your Strengths</Label>
                    <Textarea id="strengths" placeholder="e.g., problem-solving, creativity, leadership" value={form.strengths} onChange={(e) => update('strengths', e.target.value)} className="bg-background" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="hobbies">Hobbies & Interests</Label>
                    <Textarea id="hobbies" placeholder="e.g., robotics club, debate, sports" value={form.hobbies} onChange={(e) => update('hobbies', e.target.value)} className="bg-background" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="preferredStudyStyle">Preferred Study Style</Label>
                    <Input id="preferredStudyStyle" placeholder="e.g., visual, hands-on, reading" value={form.preferredStudyStyle} onChange={(e) => update('preferredStudyStyle', e.target.value)} className="bg-background" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={submitting}>
                    {submitting ? 'Preparing your test…' : 'Continue to Test'}
                  </Button>
                  {submitting && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Generating questions…
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AssessmentForm;


