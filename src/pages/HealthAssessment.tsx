import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { HeartPulse, Sparkles, ShieldAlert, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AssessmentResult {
  insights: string;
  intensity_level: string;
  precautions: string;
}

const HealthAssessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const [form, setForm] = useState({
    age: "",
    weight_kg: "",
    height_cm: "",
    gender: "",
    medical_conditions: "",
    medications: "",
    injuries: "",
    avg_sleep_hours: "",
    stress_level: "5",
    activity_level: "moderate",
    smoking_status: "never",
    alcohol_frequency: "never",
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setForm((f) => ({
          ...f,
          age: data.age?.toString() || "",
          weight_kg: data.weight_kg?.toString() || "",
          height_cm: data.height_cm?.toString() || "",
          gender: data.gender || "",
          medical_conditions: (data.medical_conditions || []).join(", "),
          medications: (data.medications || []).join(", "),
          injuries: data.injuries || "",
          avg_sleep_hours: data.avg_sleep_hours?.toString() || "",
          stress_level: data.stress_level?.toString() || "5",
          activity_level: data.activity_level || "moderate",
          smoking_status: data.smoking_status || "never",
          alcohol_frequency: data.alcohol_frequency || "never",
        }));
      }
    })();
  }, [navigate]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const conditionsArr = form.medical_conditions.split(",").map((s) => s.trim()).filter(Boolean);
      const medsArr = form.medications.split(",").map((s) => s.trim()).filter(Boolean);

      // Save updates to profile
      await supabase.from("profiles").upsert({
        id: user.id,
        age: form.age ? parseInt(form.age) : null,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        height_cm: form.height_cm ? parseInt(form.height_cm) : null,
        gender: form.gender || null,
        medical_conditions: conditionsArr,
        medications: medsArr,
        injuries: form.injuries || null,
        avg_sleep_hours: form.avg_sleep_hours ? parseFloat(form.avg_sleep_hours) : null,
        stress_level: form.stress_level ? parseInt(form.stress_level) : null,
        activity_level: form.activity_level,
        smoking_status: form.smoking_status,
        alcohol_frequency: form.alcohol_frequency,
      });

      const profilePayload = {
        age: form.age ? parseInt(form.age) : null,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        height_cm: form.height_cm ? parseInt(form.height_cm) : null,
        gender: form.gender,
        medical_conditions: conditionsArr,
        medications: medsArr,
        injuries: form.injuries,
        avg_sleep_hours: form.avg_sleep_hours ? parseFloat(form.avg_sleep_hours) : null,
        stress_level: parseInt(form.stress_level),
        activity_level: form.activity_level,
        smoking_status: form.smoking_status,
        alcohol_frequency: form.alcohol_frequency,
      };

      const { data, error } = await supabase.functions.invoke("health-assessment", {
        body: { profile: profilePayload },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as AssessmentResult);
      toast.success("Health insights generated");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };

  const intensityColor = (lvl: string) => {
    switch (lvl?.toLowerCase()) {
      case "low": return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case "high": return "bg-green-500/20 text-green-700 dark:text-green-400";
      default: return "bg-primary/20 text-primary";
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            Health Profile & Risk Assessment
          </h1>
          <p className="text-muted-foreground">
            Get AI-powered wellness insights based on your health profile. These are insights, not medical diagnoses.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" step="0.1" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} placeholder="70" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} placeholder="175" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Medical Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="conditions">Medical Conditions (comma-separated)</Label>
                <Input id="conditions" value={form.medical_conditions} onChange={(e) => setForm({ ...form, medical_conditions: e.target.value })} placeholder="diabetes, high blood pressure, asthma" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meds">Current Medications (comma-separated)</Label>
                <Input id="meds" value={form.medications} onChange={(e) => setForm({ ...form, medications: e.target.value })} placeholder="metformin, lisinopril" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="injuries">Injuries / Physical Limitations</Label>
                <Textarea id="injuries" value={form.injuries} onChange={(e) => setForm({ ...form, injuries: e.target.value })} placeholder="e.g. lower back pain, knee surgery 2 years ago" rows={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Lifestyle</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sleep">Avg Sleep (hours/night)</Label>
                <Input id="sleep" type="number" step="0.5" value={form.avg_sleep_hours} onChange={(e) => setForm({ ...form, avg_sleep_hours: e.target.value })} placeholder="7" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stress">Stress Level (1-10)</Label>
                <Input id="stress" type="number" min="1" max="10" value={form.stress_level} onChange={(e) => setForm({ ...form, stress_level: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={form.activity_level} onValueChange={(v) => setForm({ ...form, activity_level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="athlete">Athlete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smoke">Smoking</Label>
                <Select value={form.smoking_status} onValueChange={(v) => setForm({ ...form, smoking_status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="former">Former</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alcohol">Alcohol</Label>
                <Select value={form.alcohol_frequency} onValueChange={(v) => setForm({ ...form, alcohol_frequency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="rarely">Rarely</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto">
            <Sparkles className="mr-2 h-5 w-5" />
            {loading ? "Analyzing..." : "Get Health Insights"}
          </Button>
        </form>

        {result && (
          <div className="space-y-4">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your Health Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground italic">
                  ⚠️ These are general wellness insights, not medical advice. Always consult a healthcare professional.
                </p>
                <div className="whitespace-pre-wrap text-sm">{result.insights}</div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Safe Workout Intensity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`text-base px-4 py-1 ${intensityColor(result.intensity_level)}`}>
                    {result.intensity_level?.toUpperCase()}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-orange-500" />
                    Precautions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">{result.precautions}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HealthAssessment;
