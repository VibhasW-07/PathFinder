import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Gemini REST client (minimal). Uses fetch to call Generative Language API.
export async function generateAssessmentQuestions(payload: {
  name: string;
  age: number;
  dob?: string;
  state?: string;
  currentClass?: string;
  institution?: string;
  fieldOfStudy?: string;
  futureInterest?: string;
  extra?: Record<string, unknown>;
}): Promise<{ questions: Array<{ id: string; question: string; options: string[]; answer?: number }> }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    // Graceful fallback: return a static sample if key missing
    return {
      questions: Array.from({ length: 10 }).map((_, i) => ({
        id: `sample-${i + 1}`,
        question: `Sample question ${i + 1}: Which option best fits you?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
      })),
    };
  }

  const desiredCount = 12;
  const weighting = deriveWeighting(payload.currentClass, payload.fieldOfStudy);
  const systemPrompt = `ROLE: You are an assessment generator for students in India.
GOAL: Produce a medium-difficulty multiple-choice test strictly tailored to the student's class/year and field of study.
CONSTRAINTS:
- Output ONLY raw JSON. No Markdown, no comments, no preamble, no code fences.
- JSON schema:
  {
    "questions": [
      { "id": string, "question": string, "options": [string, string, string, string], "answer"?: number }
    ]
  }
- Provide exactly ${desiredCount} questions.
- Each question must have exactly 4 plausible options.
- Include "answer" only if you are certain; otherwise omit it.
- Language: clear, student-friendly English.
- Avoid factual traps; focus on conceptual understanding.
- Keep questions age-appropriate and aligned with the student's class/year and field.
TAILORING GUIDE:
- If class/year indicates school level (Class 9–12), emphasize foundational subjects relevant to the field (e.g., Science → Physics/Chemistry/Biology fundamentals; Commerce → Accounting basics; Arts → Social Sciences/Language/Logic).
- If UG/PG years, emphasize domain topics and applied reasoning in the specified field.
- Incorporate 1–2 aptitude/reasoning questions appropriate to the student's level.
- Reflect any future interest when selecting topics (e.g., AI/ML → basic data/logic interpretation).`;

  const userPrompt = `STUDENT PROFILE:\n${JSON.stringify(payload, null, 2)}\n\nWEIGHTING (enforce as closely as possible; adjust within ±1 if needed):\n${JSON.stringify(weighting, null, 2)}\n\nTASK: Generate exactly ${desiredCount} questions adhering to the constraints and the weighting.`;

  const body = {
    contents: [
      { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    }
  };

  // Helper: fetch with timeout
  async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(id);
    }
  }

  // Try primary model, then fallback to a faster model
  const endpoints = [
    'gemini-1.5-pro-002',
    'gemini-1.5-flash-latest'
  ];

  for (const model of endpoints) {
    try {
      const resp = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
        20000
      );
      if (!resp.ok) {
        continue;
      }
      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const candidate = jsonMatch ? jsonMatch[0] : text;
      try {
        const parsed = JSON.parse(candidate);
        if (Array.isArray(parsed?.questions) && parsed.questions.length > 0) {
          // Ensure exactly 12 questions if model returned a different count
          const trimmed = parsed.questions.slice(0, 12);
          return { questions: trimmed };
        }
      } catch {}
    } catch {
      // continue to next model
    }
  }

  // Fallback if parsing fails
  return {
    questions: Array.from({ length: 12 }).map((_, i) => ({
      id: `fallback-${i + 1}`,
      question: `Fallback question ${i + 1}: pick an option`,
      options: ["A", "B", "C", "D"],
    })),
  };
}

function deriveWeighting(currentClass?: string, field?: string) {
  const lowerClass = (currentClass || '').toLowerCase();
  const lowerField = (field || '').toLowerCase();

  // Default: general aptitude mix
  let plan = { topics: [{ area: 'Aptitude/Reasoning', count: 3 }, { area: 'General Knowledge (Education/Careers)', count: 2 }, { area: 'Field Basics', count: 7 }] };

  const school = ['class 9', 'class 10', 'class 11', 'class 12'];
  const isSchool = school.some(s => lowerClass.includes(s));
  const isUGPG = /(1st|2nd|3rd|4th|graduate|postgraduate)/.test(lowerClass);

  if (isSchool) {
    if (lowerField.includes('science')) {
      plan = { topics: [
        { area: 'Physics fundamentals', count: 4 },
        { area: 'Chemistry fundamentals', count: 3 },
        { area: 'Biology fundamentals', count: 2 },
        { area: 'Aptitude/Reasoning', count: 2 },
        { area: 'Career awareness in Science', count: 1 },
      ]};
    } else if (lowerField.includes('commerce')) {
      plan = { topics: [
        { area: 'Accounting basics', count: 4 },
        { area: 'Economics fundamentals', count: 3 },
        { area: 'Business studies', count: 2 },
        { area: 'Aptitude/Reasoning', count: 2 },
        { area: 'Career awareness in Commerce', count: 1 },
      ]};
    } else if (lowerField.includes('arts') || lowerField.includes('humanities')) {
      plan = { topics: [
        { area: 'Social sciences basics', count: 4 },
        { area: 'Language/Communication', count: 3 },
        { area: 'Logic/Critical thinking', count: 2 },
        { area: 'Aptitude/Reasoning', count: 2 },
        { area: 'Career awareness in Arts/Humanities', count: 1 },
      ]};
    }
  } else if (isUGPG) {
    if (lowerField.includes('engineering') || lowerField.includes('computer') || lowerField.includes('cs')) {
      plan = { topics: [
        { area: 'Core domain (e.g., programming/data structures/electronics per field)', count: 6 },
        { area: 'Applied problem-solving in domain', count: 3 },
        { area: 'Math/Logic for the field', count: 2 },
        { area: 'Career/Industry awareness', count: 1 },
      ]};
    } else if (lowerField.includes('medicine')) {
      plan = { topics: [
        { area: 'Human biology/anatomy basics', count: 5 },
        { area: 'Clinical reasoning scenarios', count: 3 },
        { area: 'Chemistry/Biochemistry for medicine', count: 2 },
        { area: 'Medical ethics/career awareness', count: 2 },
      ]};
    } else if (lowerField.includes('management') || lowerField.includes('mba')) {
      plan = { topics: [
        { area: 'Business/management concepts', count: 5 },
        { area: 'Quant/DI/LR (aptitude)', count: 3 },
        { area: 'Economics/markets', count: 2 },
        { area: 'Career/Industry awareness', count: 2 },
      ]};
    } else if (lowerField.includes('law')) {
      plan = { topics: [
        { area: 'Legal reasoning', count: 5 },
        { area: 'Reading comprehension/critical thinking', count: 3 },
        { area: 'General knowledge (polity/current affairs)', count: 2 },
        { area: 'Career/ethics awareness', count: 2 },
      ]};
    }
  }

  // Normalize total to desiredCount softly; model can adjust ±1
  const total = plan.topics.reduce((s, t) => s + t.count, 0);
  if (total !== 12) {
    // Scale counts proportionally to 12
    const scaled = plan.topics.map(t => ({ area: t.area, count: Math.max(1, Math.round((t.count / total) * 12)) }));
    const diff = 12 - scaled.reduce((s, t) => s + t.count, 0);
    if (diff !== 0 && scaled.length > 0) {
      // Adjust the first topic to fix rounding diff
      scaled[0].count += diff;
    }
    plan.topics = scaled;
  }
  return plan;
}

export async function generateCourseRecommendations(profile: {
  name?: string;
  age?: number | string;
  currentClass?: string;
  fieldOfStudy?: string;
  futureInterest?: string;
  strengths?: string;
  hobbies?: string;
}): Promise<{ courses: Array<{ id: string; title: string; shortDescription: string; level: string; duration: string; provider: string; matchScore: number; category: string; mode: string }> }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  const fallback = {
    courses: [
      { id: 'c1', title: 'Intro to Computer Science', shortDescription: 'Fundamentals of CS concepts', level: 'Beginner', duration: '8-10 weeks', provider: 'OpenCourse', matchScore: 92, category: 'Technical', mode: 'Online' },
      { id: 'c2', title: 'Aptitude & Reasoning Basics', shortDescription: 'Improve logical and quantitative skills', level: 'All levels', duration: '6 weeks', provider: 'SkillHub', matchScore: 88, category: 'Aptitude', mode: 'Online' },
      { id: 'c3', title: 'Career Discovery Workshop', shortDescription: 'Explore careers matching your interests', level: 'Beginner', duration: '2 weeks', provider: 'PathFinder', matchScore: 95, category: 'Career', mode: 'Hybrid' },
    ]
  };
  if (!apiKey) return fallback;

  const prompt = `ROLE: Recommend short, practical courses for the student based on profile.\n` +
  `OUTPUT: Strict JSON: { "courses": [ { "id": string, "title": string, "shortDescription": string, "level": string, "duration": string, "provider": string, "matchScore": number, "category": string, "mode": string } ] }\n` +
  `COUNT: 6-8 courses spanning core field topics, aptitude gaps, and future interests.\n` +
  `SCORING: matchScore 0-100 based on field alignment, class level, interests. Higher = better match.\n` +
  `CATEGORIES: Technical, Aptitude, Career, Language, Soft Skills, Domain-specific.\n` +
  `MODES: Online, Offline, Hybrid.\n` +
  `PROFILE:\n${JSON.stringify(profile, null, 2)}`;

  const body = {
    contents: [ { role: 'user', parts: [{ text: prompt }] } ],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
  };

  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    if (!resp.ok) return fallback;
    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const candidate = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(candidate);
    if (Array.isArray(parsed?.courses) && parsed.courses.length) return parsed;
  } catch {}
  return fallback;
}

export async function generateCollegeSuggestions(profile: {
  fieldOfStudy?: string;
  currentClass?: string;
  futureInterest?: string;
  state?: string;
}): Promise<{ india: Array<{ name: string; city: string; note: string }>; international: Array<{ name: string; country: string; note: string }> }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  const fallback = {
    india: [
      { name: 'IIT Bombay', city: 'Mumbai', note: 'Top engineering programs; strong CS/AI research' },
      { name: 'IISc Bangalore', city: 'Bengaluru', note: 'Research-focused science and engineering' },
      { name: 'DU - SRCC', city: 'Delhi', note: 'Leading commerce and economics' },
    ],
    international: [
      { name: 'MIT', country: 'USA', note: 'World-leading STEM programs' },
      { name: 'University of Cambridge', country: 'UK', note: 'Strong across sciences and humanities' },
      { name: 'NUS', country: 'Singapore', note: 'Top Asian university with engineering strength' },
    ],
  };
  if (!apiKey) return fallback;

  const prompt = `ROLE: Suggest colleges related to the student's field in India and abroad.\n` +
  `OUTPUT: Strict JSON: { "india": [{"name": string, "city": string, "note": string}], "international": [{"name": string, "country": string, "note": string}] }\n` +
  `COUNT: 5 India and 5 international options; balance prestige and accessibility.\n` +
  `PROFILE:\n${JSON.stringify(profile, null, 2)}`;

  const body = { contents: [ { role: 'user', parts: [{ text: prompt }] } ], generationConfig: { temperature: 0.7, maxOutputTokens: 1024 } };
  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!resp.ok) return fallback;
    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const candidate = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(candidate);
    if (Array.isArray(parsed?.india) && Array.isArray(parsed?.international)) return parsed;
  } catch {}
  return fallback;
}

export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  eligibilitySummary: string;
  amount: string;
  deadline: string;
  applyUrl: string;
  fields?: string[];
  categories?: string[]; // e.g., SC/ST/OBC/EWS/PwD/Women/Minority
  locations?: string[]; // states or India-wide
  academicMin?: string; // e.g., ">= 80% in Class 12"
  incomeCap?: string; // e.g., "<= ₹8LPA"
  matchScore: number;
};

export async function generateScholarshipRecommendations(profile: {
  name?: string;
  age?: number | string;
  state?: string;
  city?: string;
  currentClass?: string;
  fieldOfStudy?: string;
  stream?: string;
  futureInterest?: string;
  academicPerformance?: string;
  lastExamPercentage?: number;
  annualFamilyIncome?: number | string;
  category?: string;
  achievements?: string;
  aspirations?: string;
}): Promise<{ scholarships: Scholarship[] }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  const fallback: { scholarships: Scholarship[] } = {
    scholarships: [
      {
        id: 's1',
        name: 'National Means-cum-Merit Scholarship',
        provider: 'Government of India',
        eligibilitySummary: 'For meritorious Class 9–12 students from economically weaker sections',
        amount: '₹12,000 per annum',
        deadline: '31 Dec 2025',
        applyUrl: 'https://scholarships.gov.in/',
        categories: ['EWS'],
        locations: ['India'],
        academicMin: 'As per scheme guidelines',
        incomeCap: '<= ₹3.5 LPA',
        matchScore: 85,
      },
      {
        id: 's2',
        name: 'Post Matric Scholarship for SC Students',
        provider: 'Ministry of Social Justice & Empowerment',
        eligibilitySummary: 'SC category students pursuing post-matric/post-secondary courses',
        amount: 'Tuition + maintenance (as per norms)',
        deadline: '30 Nov 2025',
        applyUrl: 'https://scholarships.gov.in/',
        categories: ['SC'],
        locations: ['India'],
        matchScore: 90,
      },
      {
        id: 's3',
        name: 'INSPIRE Scholarship (SHE)',
        provider: 'Department of Science & Technology',
        eligibilitySummary: 'Top 1% Class 12 Science or KVPY/JEE/NEET rankers pursuing BSc/Int. MSc',
        amount: '₹80,000 per year',
        deadline: 'Tentative: Oct–Dec 2025',
        applyUrl: 'https://online-inspire.gov.in/',
        fields: ['Science'],
        categories: ['General', 'EWS', 'OBC', 'SC', 'ST'],
        matchScore: 78,
      },
      {
        id: 's4',
        name: 'AICTE Pragati Scholarship for Girls',
        provider: 'AICTE',
        eligibilitySummary: 'Girl students admitted in AICTE approved institutions (UG/Diploma)',
        amount: '₹50,000 per year',
        deadline: 'As per portal',
        applyUrl: 'https://scholarships.gov.in/',
        categories: ['Women'],
        fields: ['Engineering', 'Technology'],
        matchScore: 82,
      },
    ],
  };

  if (!apiKey) return fallback;

  const prompt = `ROLE: Recommend relevant scholarships for the student in India based on profile.
OUTPUT: Strict JSON: { "scholarships": [ { "id": string, "name": string, "provider": string, "eligibilitySummary": string, "amount": string, "deadline": string, "applyUrl": string, "fields"?: string[], "categories"?: string[], "locations"?: string[], "academicMin"?: string, "incomeCap"?: string, "matchScore": number } ] }
COUNT: 6–10 scholarships spanning national, state, category, and field-specific.
SCORING: matchScore 0–100 using academic level, field/stream, location, category, income, aspirations, achievements.
PROFILE:\n${JSON.stringify(profile, null, 2)}\n`;

  const body = {
    contents: [ { role: 'user', parts: [{ text: prompt }] } ],
    generationConfig: { temperature: 0.6, maxOutputTokens: 1024 }
  };

  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    if (!resp.ok) return fallback;
    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const candidate = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(candidate);
    if (Array.isArray(parsed?.scholarships) && parsed.scholarships.length) return parsed;
  } catch {}
  return fallback;
}