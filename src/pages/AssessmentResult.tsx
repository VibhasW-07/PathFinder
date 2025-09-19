import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/integrations/supabase/client';

const AssessmentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setProfile } = useProfile();
  const { user } = useAuth();
  const score = location.state?.score ?? 0;
  const total = location.state?.total ?? 0;

  // Mark assessment as completed when component mounts
  React.useEffect(() => {
    setProfile(prev => ({
      ...prev,
      assessmentCompleted: true,
      assessmentScore: score,
      assessmentTotal: total
    }));
    // Persist assessment history
    (async () => {
      try {
        if (user) {
          await db.insertAssessment({ user_id: user.id, assessment_data: { score, total }, version: 1 });
        }
      } catch {}
    })();
  }, [score, total, setProfile]);

  return (
    <>
      <Helmet>
        <title>Assessment Result | PathFinder</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-subtle px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border shadow-medium text-center">
            <CardHeader>
              <CardTitle className="text-3xl">Congratulations! 🎉</CardTitle>
              <CardDescription>Your assessment is complete.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-5xl font-bold text-primary">
                {score}/{total}
              </div>
              <p className="text-muted-foreground">Great job! Explore personalized course recommendations next.</p>
              <div className="flex justify-center gap-3">
                <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
                <Button variant="outline" onClick={() => navigate('/assessment')}>Retake Assessment</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AssessmentResult;


