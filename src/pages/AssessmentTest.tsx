import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type Question = { id: string; question: string; options: string[]; answer?: number };

const AssessmentTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questions = useMemo<Question[]>(() => location.state?.questions ?? [], [location.state]);
  const source = useMemo(() => {
    // Heuristic: our fallback/sample generators prefix ids with 'fallback-' or 'sample-'
    const isFallback = questions.some(q => q.id?.startsWith('fallback-') || q.id?.startsWith('sample-'));
    return isFallback ? 'Local fallback' : 'Gemini API';
  }, [questions]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const score = useMemo(() => {
    let s = 0;
    for (const q of questions) {
      if (typeof q.answer === 'number' && answers[q.id] === q.answer) s += 1;
    }
    return s;
  }, [answers, questions]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigate('/assessment/result', { replace: true, state: { score, total: questions.length } });
    }, 600);
  };

  if (!questions.length) {
    navigate('/assessment');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Assessment Test | PathFinder</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-subtle px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card border-border shadow-medium">
            <CardHeader>
              <CardTitle className="text-2xl">Your Personalized Test</CardTitle>
              <CardDescription>
                Answer the following questions. There are {questions.length} questions.
                <span className="ml-2 text-xs text-muted-foreground">(Source: {source})</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={onSubmit}>
                {questions.map((q, idx) => (
                  <div key={q.id} className="rounded-lg border border-border p-4">
                    <div className="font-medium text-foreground mb-3">{idx + 1}. {q.question}</div>
                    <RadioGroup
                      value={answers[q.id]?.toString() ?? ''}
                      onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: Number(v) }))}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {q.options.slice(0,4).map((opt, i) => (
                        <Label key={i} className="flex items-center gap-2 p-3 rounded-md border cursor-pointer hover:bg-muted">
                          <RadioGroupItem value={i.toString()} />
                          <span>{opt}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Submit'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AssessmentTest;
