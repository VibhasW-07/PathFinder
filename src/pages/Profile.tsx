import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/hooks/useProfile';

const Profile = () => {
  const { profile, setProfile, avatarDataUrl, setAvatarDataUrl } = useProfile();
  const fileRef = useRef<HTMLInputElement | null>(null);

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

  return (
    <>
      <Helmet>
        <title>Profile | PathFinder</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-subtle px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="bg-card border-border shadow-medium">
            <CardHeader>
              <CardTitle className="text-2xl">Your Profile</CardTitle>
              <CardDescription>Review your information and update your avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                  {avatarDataUrl ? (
                    <img src={avatarDataUrl} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm text-muted-foreground">No Avatar</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                  <Button onClick={() => fileRef.current?.click()}>Upload Photo</Button>
                  <Button variant="outline" onClick={() => setAvatarDataUrl(undefined)}>Remove</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Name</Label>
                  <Input value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-background" />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input value={profile.age?.toString() || ''} onChange={(e) => setProfile({ ...profile, age: e.target.value })} className="bg-background" />
                </div>
                <div>
                  <Label>DOB</Label>
                  <Input type="date" value={profile.dob || ''} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} className="bg-background" />
                </div>
                <div>
                  <Label>State</Label>
                  <Input value={profile.state || ''} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className="bg-background" />
                </div>
                <div>
                  <Label>Class / Year</Label>
                  <Input value={profile.currentClass || ''} onChange={(e) => setProfile({ ...profile, currentClass: e.target.value })} className="bg-background" />
                </div>
                <div>
                  <Label>University / School</Label>
                  <Input value={profile.institution || ''} onChange={(e) => setProfile({ ...profile, institution: e.target.value })} className="bg-background" />
                </div>
                <div>
                  <Label>Field of Study</Label>
                  <Input value={profile.fieldOfStudy || ''} onChange={(e) => setProfile({ ...profile, fieldOfStudy: e.target.value })} className="bg-background" />
                </div>
                <div>
                  <Label>Future Interest</Label>
                  <Input value={profile.futureInterest || ''} onChange={(e) => setProfile({ ...profile, futureInterest: e.target.value })} className="bg-background" />
                </div>
                <div className="md:col-span-2">
                  <Label>Strengths</Label>
                  <Input value={profile.strengths || ''} onChange={(e) => setProfile({ ...profile, strengths: e.target.value })} className="bg-background" />
                </div>
                <div className="md:col-span-2">
                  <Label>Hobbies</Label>
                  <Input value={profile.hobbies || ''} onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })} className="bg-background" />
                </div>
                <div className="md:col-span-2">
                  <Label>Preferred Study Style</Label>
                  <Input value={profile.preferredStudyStyle || ''} onChange={(e) => setProfile({ ...profile, preferredStudyStyle: e.target.value })} className="bg-background" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;


