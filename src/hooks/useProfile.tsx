import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/integrations/supabase/client';

type Profile = {
  name?: string;
  age?: number | string;
  dob?: string;
  state?: string;
  city?: string;
  currentClass?: string;
  institution?: string;
  fieldOfStudy?: string;
  stream?: string;
  futureInterest?: string;
  strengths?: string;
  hobbies?: string;
  preferredStudyStyle?: string;
  // Scholarships matching fields
  annualFamilyIncome?: number | string;
  category?: string; // e.g., General/SC/ST/OBC/EWS/PwD
  academicPerformance?: string; // e.g., percentage/CGPA or brief summary
  lastExamPercentage?: number;
  achievements?: string; // notable awards/special circumstances
  aspirations?: string; // career aspirations
  assessmentCompleted?: boolean;
  assessmentScore?: number;
  assessmentTotal?: number;
};

type ProfileContextType = {
  profile: Profile;
  setProfile: (p: Profile) => void;
  avatarDataUrl?: string;
  setAvatarDataUrl: (data?: string) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<Profile>({});
  const [avatarDataUrl, setAvatarDataUrlState] = useState<string | undefined>(undefined);
  const { user } = useAuth();

  useEffect(() => {
    // Load from Supabase if logged in, else fallback to localStorage
    (async () => {
      try {
        const avatar = localStorage.getItem('pf_avatar_v1');
        if (avatar) setAvatarDataUrlState(avatar);
        if (user) {
          await db.upsertUser({ user_id: user.id, email: user.email ?? '' });
          const { data } = await db.getProfile(user.id);
          if (data) {
            const loaded: Profile = {
              name: (data as any).name ?? undefined,
              age: (data as any).age ?? undefined,
              dob: (data as any).dob ?? undefined,
              state: (data.location as any)?.state ?? undefined,
              city: (data.location as any)?.city ?? undefined,
              currentClass: data.academic_level ?? undefined,
              institution: (data as any).institution ?? undefined,
              fieldOfStudy: (data as any).fieldOfStudy ?? data.stream ?? undefined,
              stream: data.stream ?? undefined,
              futureInterest: (data as any).futureInterest ?? undefined,
              strengths: (data as any).strengths ?? undefined,
              hobbies: (data as any).hobbies ?? undefined,
              preferredStudyStyle: (data.preferences as any)?.studyStyle ?? undefined,
              annualFamilyIncome: (data as any).annualFamilyIncome ?? undefined,
              category: (data as any).category ?? undefined,
              academicPerformance: (data as any).academicPerformance ?? undefined,
              lastExamPercentage: (data as any).lastExamPercentage ?? undefined,
              achievements: (data as any).achievements ?? undefined,
              aspirations: (data as any).aspirations ?? undefined,
              assessmentCompleted: !!data.assessment_completed_at,
              assessmentScore: (data as any).assessmentScore ?? undefined,
              assessmentTotal: (data as any).assessmentTotal ?? undefined,
            };
            setProfileState(loaded);
            try { localStorage.setItem('pf_profile_v1', JSON.stringify(loaded)); } catch {}
            return;
          }
        }
        // fallback local
        const raw = localStorage.getItem('pf_profile_v1');
        if (raw) setProfileState(JSON.parse(raw));
      } catch {}
    })();
  }, [user]);

  const setProfile = (p: Profile) => {
    setProfileState(p);
    try { localStorage.setItem('pf_profile_v1', JSON.stringify(p)); } catch {}
    // Persist to Supabase if logged in
    (async () => {
      try {
        if (!user) return;
        await db.upsertProfile({
          user_id: user.id,
          academic_level: p.currentClass ?? null,
          stream: p.stream ?? p.fieldOfStudy ?? null,
          subjects: null,
          location: { state: p.state ?? null, city: p.city ?? null },
          career_goals: p.aspirations ?? p.futureInterest ?? null,
          preferences: { studyStyle: p.preferredStudyStyle ?? null },
          assessment_completed_at: p.assessmentCompleted ? new Date().toISOString() : null,
        } as any);
      } catch {}
    })();
  };

  const setAvatarDataUrl = (data?: string) => {
    setAvatarDataUrlState(data);
    try {
      if (data) localStorage.setItem('pf_avatar_v1', data);
      else localStorage.removeItem('pf_avatar_v1');
    } catch {}
  };

  const value = useMemo(() => ({ profile, setProfile, avatarDataUrl, setAvatarDataUrl }), [profile, avatarDataUrl]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};


