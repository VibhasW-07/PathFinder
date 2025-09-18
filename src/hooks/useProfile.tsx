import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

type Profile = {
  name?: string;
  age?: number | string;
  dob?: string;
  state?: string;
  currentClass?: string;
  institution?: string;
  fieldOfStudy?: string;
  futureInterest?: string;
  strengths?: string;
  hobbies?: string;
  preferredStudyStyle?: string;
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pf_profile_v1');
      if (raw) setProfileState(JSON.parse(raw));
      const avatar = localStorage.getItem('pf_avatar_v1');
      if (avatar) setAvatarDataUrlState(avatar);
    } catch {}
  }, []);

  const setProfile = (p: Profile) => {
    setProfileState(p);
    try { localStorage.setItem('pf_profile_v1', JSON.stringify(p)); } catch {}
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


