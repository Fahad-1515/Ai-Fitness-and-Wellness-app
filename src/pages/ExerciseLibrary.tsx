import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wind, Target, AlertTriangle, Dumbbell, Activity, Heart, Play } from "lucide-react";
import { exercises, categoryLabels, type Exercise, type ExerciseCategory } from "@/data/exercises";

// Lazy video: only loads & plays when scrolled into view, pauses when out.
const LazyVideo = ({ src }: { src: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "100px", threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={visible ? src : undefined}
      preload="none"
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
    />
  );
};

const exerciseGroups = [
  {
    title: "Upper Body",
    icon: Dumbbell,
    items: [
      "Bench Press",
      "Push-ups",
      "Chest Fly",
      "Shoulder Press",
      "Lateral Raises",
      "Pull-ups",
      "Lat Pulldowns",
      "Bent-over Rows",
      "Bicep Curls",
      "Tricep Pushdowns",
      "Dips",
      "Face Pulls",
    ],
  },
  {
    title: "Lower Body",
    icon: Activity,
    items: [
      "Squats",
      "Deadlifts",
      "Leg Press",
      "Lunges",
      "Leg Extensions",
      "Leg Curls",
      "Romanian Deadlifts",
      "Hip Thrusts",
      "Calf Raises",
      "Step-ups",
    ],
  },
  {
    title: "Core & Cardio",
    icon: Heart,
    items: [
      "Plank",
      "Crunches",
      "Leg Raises",
      "Russian Twists",
      "Mountain Climbers",
      "Burpees",
      "Treadmill Running",
      "Rowing Machine",
      "Stationary Cycling",
    ],
  },
];

const categoryColors: Record<ExerciseCategory, string> = {
  push: "bg-primary/10 text-primary border-primary/20",
  pull: "bg-accent/10 text-accent border-accent/20",
  legs: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  shoulders: "bg-muted text-muted-foreground border-border",
  core: "bg-primary/10 text-primary border-primary/20",
  cardio: "bg-destructive/10 text-destructive border-destructive/20",
};

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative bg-muted aspect-[9/16] max-h-[480px] w-full overflow-hidden">
        <LazyVideo src={exercise.videoUrl} />
        <Badge
          className={`absolute top-3 left-3 capitalize border ${categoryColors[exercise.category]}`}
          variant="outline"
        >
          {categoryLabels[exercise.category]}
        </Badge>
      </div>

      <div className="p-4 space-y-4 flex-1">
        <div>
          <h3 className="text-lg font-bold">{exercise.name}</h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {exercise.primaryMuscles.map((m) => (
              <Badge key={m} className="bg-primary text-primary-foreground">
                {m}
              </Badge>
            ))}
            {exercise.secondaryMuscles.map((m) => (
              <Badge key={m} variant="outline">
                {m}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Wind className="h-4 w-4 text-primary" />
            Breathing
          </div>
          <p className="text-xs text-muted-foreground">↓ {exercise.breathing.down}</p>
          <p className="text-xs text-muted-foreground">↑ {exercise.breathing.up}</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Target className="h-4 w-4 text-primary" />
            Form Cues
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 pl-1">
            {exercise.cues.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Common Mistakes
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 pl-1">
            {exercise.mistakes.map((m) => (
              <li key={m}>• {m}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

const ExerciseLibrary = () => {
  const [filter, setFilter] = useState<"all" | ExerciseCategory>("all");

  const filtered = filter === "all" ? exercises : exercises.filter((e) => e.category === filter);

  return (
    <Layout>
      <div className="space-y-6 pb-20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Dumbbell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Exercise Library</h1>
            <p className="text-sm text-muted-foreground">
              {exercises.length} AI-generated demos with form cues and breathing patterns
            </p>
          </div>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="grid grid-cols-4 sm:grid-cols-7 w-full max-w-3xl h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="push">Push</TabsTrigger>
            <TabsTrigger value="pull">Pull</TabsTrigger>
            <TabsTrigger value="legs">Legs</TabsTrigger>
            <TabsTrigger value="shoulders">Delts</TabsTrigger>
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="cardio">Cardio</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="p-4 bg-muted/50 border-dashed">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Note:</strong> These demos are AI-generated for visual
            reference. Real human form may show minor distortions. Always prioritize the written form
            cues over what you see in the clip, and consult a qualified coach for personalized guidance.
          </p>
        </Card>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Common Gym Exercises</h2>
            <p className="text-sm text-muted-foreground">
              A quick-reference list of staple movements, organized by area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exerciseGroups.map((group) => (
              <Card key={group.title} className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <group.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">{group.title}</h3>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {group.items.length}
                  </Badge>
                </div>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExerciseLibrary;
