import pushupVideo from "@/assets/exercise-pushup.mp4.asset.json";
import squatVideo from "@/assets/exercise-squat.mp4.asset.json";
import pullupVideo from "@/assets/exercise-pullup.mp4.asset.json";
import lateralRaiseVideo from "@/assets/exercise-lateral-raise.mp4.asset.json";
import benchPressVideo from "@/assets/exercise-bench-press.mp4.asset.json";
import chestFlyVideo from "@/assets/exercise-chest-fly.mp4.asset.json";
import shoulderPressVideo from "@/assets/exercise-shoulder-press.mp4.asset.json";
import latPulldownVideo from "@/assets/exercise-lat-pulldown.mp4.asset.json";
import bentOverRowVideo from "@/assets/exercise-bent-over-row.mp4.asset.json";
import bicepCurlVideo from "@/assets/exercise-bicep-curl.mp4.asset.json";
import tricepPushdownVideo from "@/assets/exercise-tricep-pushdown.mp4.asset.json";
import dipsVideo from "@/assets/exercise-dips.mp4.asset.json";
import facePullVideo from "@/assets/exercise-face-pull.mp4.asset.json";
import deadliftVideo from "@/assets/exercise-deadlift.mp4.asset.json";
import legPressVideo from "@/assets/exercise-leg-press.mp4.asset.json";
import lungeVideo from "@/assets/exercise-lunge.mp4.asset.json";
import legExtensionVideo from "@/assets/exercise-leg-extension.mp4.asset.json";
import legCurlVideo from "@/assets/exercise-leg-curl.mp4.asset.json";
import romanianDeadliftVideo from "@/assets/exercise-romanian-deadlift.mp4.asset.json";
import hipThrustVideo from "@/assets/exercise-hip-thrust.mp4.asset.json";
import calfRaiseVideo from "@/assets/exercise-calf-raise.mp4.asset.json";
import stepUpVideo from "@/assets/exercise-step-up.mp4.asset.json";
import plankVideo from "@/assets/exercise-plank.mp4.asset.json";
import crunchVideo from "@/assets/exercise-crunch.mp4.asset.json";
import legRaiseVideo from "@/assets/exercise-leg-raise.mp4.asset.json";
import russianTwistVideo from "@/assets/exercise-russian-twist.mp4.asset.json";
import mountainClimberVideo from "@/assets/exercise-mountain-climber.mp4.asset.json";
import burpeeVideo from "@/assets/exercise-burpee.mp4.asset.json";
import treadmillVideo from "@/assets/exercise-treadmill.mp4.asset.json";
import rowingVideo from "@/assets/exercise-rowing.mp4.asset.json";
import cyclingVideo from "@/assets/exercise-cycling.mp4.asset.json";

// Resolve asset URLs against Lovable's CDN so videos work in local dev (VS Code / localhost)
// as well as on the deployed Lovable preview/published domains.
const ASSET_CDN_BASE = "https://titan-prompt-coach.lovable.app";
const toAbsolute = (url: string) =>
  url.startsWith("http") ? url : `${ASSET_CDN_BASE}${url}`;

export type ExerciseCategory = "push" | "pull" | "legs" | "shoulders" | "core" | "cardio";

export type Exercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
  videoUrl: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  breathing: { down: string; up: string };
  cues: string[];
  mistakes: string[];
};

export const exercises: Exercise[] = [
  // ---------- PUSH ----------
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    category: "push",
    videoUrl: toAbsolute(benchPressVideo.url),
    primaryMuscles: ["Chest", "Triceps"],
    secondaryMuscles: ["Front Delts"],
    breathing: { down: "Inhale and brace as the bar lowers", up: "Exhale through the press" },
    cues: [
      "Retract shoulder blades, slight arch",
      "Bar path: lower chest to over shoulders",
      "Feet planted, drive through legs",
      "Wrists stacked over elbows",
    ],
    mistakes: ["Bouncing bar off chest", "Flared elbows (90°)", "Lifting hips off bench"],
  },
  {
    id: "pushup",
    name: "Push-Up",
    category: "push",
    videoUrl: toAbsolute(pushupVideo.url),
    primaryMuscles: ["Chest", "Triceps"],
    secondaryMuscles: ["Front Delts", "Core"],
    breathing: { down: "Inhale on the way down", up: "Exhale as you press up" },
    cues: [
      "Hands shoulder-width apart",
      "Body in a straight line, head to heels",
      "Elbows ~45° from torso",
      "Lower chest to just above the floor",
    ],
    mistakes: ["Sagging hips or piked butt", "Flared elbows (90°)", "Partial range of motion"],
  },
  {
    id: "chest-fly",
    name: "Dumbbell Chest Fly",
    category: "push",
    videoUrl: toAbsolute(chestFlyVideo.url),
    primaryMuscles: ["Chest"],
    secondaryMuscles: ["Front Delts", "Biceps"],
    breathing: { down: "Inhale as arms open", up: "Exhale as you squeeze together" },
    cues: [
      "Soft bend in elbows, locked angle",
      "Stretch chest at the bottom",
      "Squeeze chest at the top",
      "Move at the shoulder, not the elbow",
    ],
    mistakes: ["Bending elbows like a press", "Going too heavy", "Bouncing at the bottom"],
  },
  {
    id: "shoulder-press",
    name: "Dumbbell Shoulder Press",
    category: "shoulders",
    videoUrl: toAbsolute(shoulderPressVideo.url),
    primaryMuscles: ["Front Delts", "Side Delts"],
    secondaryMuscles: ["Triceps", "Upper Chest"],
    breathing: { down: "Inhale on the lower", up: "Exhale on the press" },
    cues: [
      "Start at ear height",
      "Press straight up, no flaring back",
      "Brace core, ribs down",
      "Full lockout overhead",
    ],
    mistakes: ["Arching lower back", "Pressing in front of head", "Half reps"],
  },
  {
    id: "lateral-raise",
    name: "Dumbbell Lateral Raise",
    category: "shoulders",
    videoUrl: toAbsolute(lateralRaiseVideo.url),
    primaryMuscles: ["Side Delts"],
    secondaryMuscles: ["Traps", "Front Delts"],
    breathing: { down: "Inhale on the lower", up: "Exhale as you lift" },
    cues: [
      "Slight bend in elbows",
      "Lift to shoulder height, no higher",
      "Lead with the elbows",
      "Slow 2-second negative",
    ],
    mistakes: ["Using momentum / swinging", "Shrugging traps", "Going too heavy and losing form"],
  },
  {
    id: "tricep-pushdown",
    name: "Tricep Pushdown",
    category: "push",
    videoUrl: toAbsolute(tricepPushdownVideo.url),
    primaryMuscles: ["Triceps"],
    secondaryMuscles: ["Forearms"],
    breathing: { down: "Exhale as you push down", up: "Inhale on the return" },
    cues: [
      "Elbows pinned to your sides",
      "Full extension at the bottom",
      "Slight forward lean",
      "Controlled return, no swinging",
    ],
    mistakes: ["Elbows drifting forward", "Using bodyweight to push", "Partial reps"],
  },
  {
    id: "dips",
    name: "Parallel Bar Dips",
    category: "push",
    videoUrl: toAbsolute(dipsVideo.url),
    primaryMuscles: ["Chest", "Triceps"],
    secondaryMuscles: ["Front Delts"],
    breathing: { down: "Inhale on the descent", up: "Exhale on the press" },
    cues: [
      "Slight forward lean for chest emphasis",
      "Lower until upper arms parallel",
      "Elbows track back, not flared wide",
      "Full lockout at top",
    ],
    mistakes: ["Going too deep (shoulder pain)", "Kipping with legs", "Shrugging at the top"],
  },

  // ---------- PULL ----------
  {
    id: "pullup",
    name: "Pull-Up",
    category: "pull",
    videoUrl: toAbsolute(pullupVideo.url),
    primaryMuscles: ["Lats", "Biceps"],
    secondaryMuscles: ["Rhomboids", "Rear Delts", "Core"],
    breathing: { down: "Inhale on the descent", up: "Exhale as you pull chin over bar" },
    cues: ["Full hang at the bottom", "Drive elbows down and back", "Chin clears the bar", "Controlled negative"],
    mistakes: ["Kipping or swinging", "Half reps (no full extension)", "Shrugging shoulders to ears"],
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    category: "pull",
    videoUrl: toAbsolute(latPulldownVideo.url),
    primaryMuscles: ["Lats"],
    secondaryMuscles: ["Biceps", "Rear Delts", "Mid Back"],
    breathing: { down: "Exhale as bar comes down", up: "Inhale on the return" },
    cues: [
      "Slight backward lean (~10–15°)",
      "Pull bar to upper chest",
      "Drive elbows down to floor",
      "Controlled return, full stretch",
    ],
    mistakes: ["Leaning back excessively", "Pulling with arms only", "Cutting reps short"],
  },
  {
    id: "bent-over-row",
    name: "Barbell Bent-Over Row",
    category: "pull",
    videoUrl: toAbsolute(bentOverRowVideo.url),
    primaryMuscles: ["Mid Back", "Lats"],
    secondaryMuscles: ["Biceps", "Rear Delts", "Lower Back"],
    breathing: { down: "Inhale on the lower", up: "Exhale as you row" },
    cues: [
      "Hinge at hips, flat back",
      "Bar pulled to lower chest / belly",
      "Squeeze shoulder blades",
      "Knees soft, hips back",
    ],
    mistakes: ["Rounding the lower back", "Standing up to lift the weight", "Yanking with biceps"],
  },
  {
    id: "bicep-curl",
    name: "Dumbbell Bicep Curl",
    category: "pull",
    videoUrl: toAbsolute(bicepCurlVideo.url),
    primaryMuscles: ["Biceps"],
    secondaryMuscles: ["Forearms"],
    breathing: { down: "Inhale on the lower", up: "Exhale on the curl" },
    cues: [
      "Elbows tucked at sides",
      "Supinate (turn palm up) on the way up",
      "Full curl, full stretch",
      "No swinging — slow negative",
    ],
    mistakes: ["Using shoulders/back to swing", "Half reps", "Elbows drifting forward"],
  },
  {
    id: "face-pull",
    name: "Cable Face Pull",
    category: "pull",
    videoUrl: toAbsolute(facePullVideo.url),
    primaryMuscles: ["Rear Delts", "Mid Traps"],
    secondaryMuscles: ["Rotator Cuff", "Rhomboids"],
    breathing: { down: "Inhale on return", up: "Exhale on the pull" },
    cues: [
      "Rope at upper-chest height or higher",
      "Pull rope to forehead",
      "Elbows high, externally rotate",
      "Squeeze rear delts at the end",
    ],
    mistakes: ["Going too heavy", "Pulling to chest instead of face", "Shrugging traps"],
  },

  // ---------- LEGS ----------
  {
    id: "squat",
    name: "Barbell Back Squat",
    category: "legs",
    videoUrl: toAbsolute(squatVideo.url),
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core", "Lower Back"],
    breathing: { down: "Big breath in, brace, descend", up: "Exhale through the sticking point" },
    cues: [
      "Feet shoulder-width, toes slightly out",
      "Knees track over toes",
      "Descend to parallel or below",
      "Drive through midfoot, chest up",
    ],
    mistakes: ["Knees caving inward", "Heels lifting off the floor", "Rounding the lower back at depth"],
  },
  {
    id: "deadlift",
    name: "Conventional Deadlift",
    category: "legs",
    videoUrl: toAbsolute(deadliftVideo.url),
    primaryMuscles: ["Glutes", "Hamstrings", "Lower Back"],
    secondaryMuscles: ["Quads", "Lats", "Forearms"],
    breathing: { down: "Inhale and brace before the pull", up: "Exhale at lockout" },
    cues: [
      "Bar over midfoot, close to shins",
      "Neutral spine, chest up",
      "Push the floor away",
      "Lock hips and knees together",
    ],
    mistakes: ["Rounding the lower back", "Bar drifting away from body", "Hyperextending at lockout"],
  },
  {
    id: "leg-press",
    name: "Leg Press",
    category: "legs",
    videoUrl: toAbsolute(legPressVideo.url),
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings"],
    breathing: { down: "Inhale on the lower", up: "Exhale on the press" },
    cues: [
      "Feet shoulder-width on the platform",
      "Lower until knees ~90°",
      "Knees track over toes",
      "Don't lock out knees hard",
    ],
    mistakes: ["Lower back rounding off pad", "Hands on knees", "Half range of motion"],
  },
  {
    id: "lunge",
    name: "Dumbbell Lunge",
    category: "legs",
    videoUrl: toAbsolute(lungeVideo.url),
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core"],
    breathing: { down: "Inhale on descent", up: "Exhale as you drive up" },
    cues: [
      "Long step forward",
      "Front knee tracks over toes",
      "Back knee almost touches floor",
      "Torso upright, core braced",
    ],
    mistakes: ["Short choppy step", "Knee caving inward", "Leaning forward excessively"],
  },
  {
    id: "leg-extension",
    name: "Leg Extension",
    category: "legs",
    videoUrl: toAbsolute(legExtensionVideo.url),
    primaryMuscles: ["Quads"],
    secondaryMuscles: [],
    breathing: { down: "Inhale on the lower", up: "Exhale on the extension" },
    cues: [
      "Knees aligned with machine pivot",
      "Full extension, brief squeeze",
      "Controlled 2-second negative",
      "Keep hips planted in seat",
    ],
    mistakes: ["Slamming the weight stack", "Lifting hips off seat", "Swinging the legs"],
  },
  {
    id: "leg-curl",
    name: "Lying Leg Curl",
    category: "legs",
    videoUrl: toAbsolute(legCurlVideo.url),
    primaryMuscles: ["Hamstrings"],
    secondaryMuscles: ["Calves", "Glutes"],
    breathing: { down: "Inhale on the lower", up: "Exhale on the curl" },
    cues: [
      "Pad just above heels",
      "Curl heels toward glutes",
      "Hips pressed into pad",
      "Slow 2-second negative",
    ],
    mistakes: ["Lifting hips off pad", "Partial range of motion", "Using momentum"],
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "legs",
    videoUrl: toAbsolute(romanianDeadliftVideo.url),
    primaryMuscles: ["Hamstrings", "Glutes"],
    secondaryMuscles: ["Lower Back", "Forearms"],
    breathing: { down: "Inhale on hip hinge", up: "Exhale as you drive up" },
    cues: [
      "Soft knee bend, lock the angle",
      "Push hips back, bar slides down legs",
      "Stop when hamstrings stretch (mid-shin)",
      "Drive hips forward to stand",
    ],
    mistakes: ["Squatting instead of hinging", "Rounding the back", "Bar drifting away from legs"],
  },
  {
    id: "hip-thrust",
    name: "Barbell Hip Thrust",
    category: "legs",
    videoUrl: toAbsolute(hipThrustVideo.url),
    primaryMuscles: ["Glutes"],
    secondaryMuscles: ["Hamstrings", "Quads"],
    breathing: { down: "Inhale on the lower", up: "Exhale at full extension" },
    cues: [
      "Upper back on bench, feet flat",
      "Drive through heels",
      "Squeeze glutes at top, ribs down",
      "Full hip extension — no hyperextension",
    ],
    mistakes: ["Overextending lower back", "Pushing through toes", "Short range of motion"],
  },
  {
    id: "calf-raise",
    name: "Standing Calf Raise",
    category: "legs",
    videoUrl: toAbsolute(calfRaiseVideo.url),
    primaryMuscles: ["Calves"],
    secondaryMuscles: [],
    breathing: { down: "Inhale on the lower", up: "Exhale on the raise" },
    cues: [
      "Full plantar flexion at the top",
      "Deep stretch at the bottom",
      "Pause briefly at top and bottom",
      "Strict — no bouncing",
    ],
    mistakes: ["Bouncing through reps", "Partial range", "Going too heavy"],
  },
  {
    id: "step-up",
    name: "Dumbbell Step-Up",
    category: "legs",
    videoUrl: toAbsolute(stepUpVideo.url),
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core"],
    breathing: { down: "Inhale on descent", up: "Exhale as you drive up" },
    cues: [
      "Whole foot on the box",
      "Drive through the heel",
      "Stand tall at the top",
      "Controlled lower, no slamming",
    ],
    mistakes: ["Pushing off the trailing leg", "Box too high (knee strain)", "Leaning excessively forward"],
  },

  // ---------- CORE ----------
  {
    id: "plank",
    name: "Forearm Plank",
    category: "core",
    videoUrl: toAbsolute(plankVideo.url),
    primaryMuscles: ["Core", "Abs"],
    secondaryMuscles: ["Shoulders", "Glutes"],
    breathing: { down: "Steady nasal breathing", up: "Exhale to brace deeper" },
    cues: [
      "Elbows under shoulders",
      "Body straight, head to heels",
      "Squeeze glutes, tuck pelvis slightly",
      "Brace abs as if expecting a punch",
    ],
    mistakes: ["Sagging hips", "Piking butt up", "Holding breath"],
  },
  {
    id: "crunch",
    name: "Crunch",
    category: "core",
    videoUrl: toAbsolute(crunchVideo.url),
    primaryMuscles: ["Abs"],
    secondaryMuscles: ["Obliques"],
    breathing: { down: "Inhale on the lower", up: "Exhale on the crunch" },
    cues: [
      "Lift shoulder blades off floor",
      "Chin off chest (fist gap)",
      "Focus on contracting abs, not pulling neck",
      "Slow controlled lower",
    ],
    mistakes: ["Yanking on the neck", "Going too fast", "Lifting whole back off floor"],
  },
  {
    id: "leg-raise",
    name: "Lying Leg Raise",
    category: "core",
    videoUrl: toAbsolute(legRaiseVideo.url),
    primaryMuscles: ["Lower Abs"],
    secondaryMuscles: ["Hip Flexors", "Core"],
    breathing: { down: "Inhale on the lower", up: "Exhale as you raise" },
    cues: [
      "Press lower back into floor",
      "Legs straight (or slight bend)",
      "Raise to vertical, slow lower",
      "Stop short of floor on the descent",
    ],
    mistakes: ["Arching lower back", "Using momentum", "Letting feet touch the floor"],
  },
  {
    id: "russian-twist",
    name: "Russian Twist",
    category: "core",
    videoUrl: toAbsolute(russianTwistVideo.url),
    primaryMuscles: ["Obliques"],
    secondaryMuscles: ["Abs", "Hip Flexors"],
    breathing: { down: "Steady — exhale on each twist", up: "Inhale at center" },
    cues: [
      "Slight backward lean, chest up",
      "Rotate from torso, not arms",
      "Touch weight to the floor each side",
      "Feet elevated for more difficulty",
    ],
    mistakes: ["Just moving arms", "Rounding the back", "Going too fast / sloppy"],
  },
  {
    id: "mountain-climber",
    name: "Mountain Climber",
    category: "core",
    videoUrl: toAbsolute(mountainClimberVideo.url),
    primaryMuscles: ["Core", "Hip Flexors"],
    secondaryMuscles: ["Shoulders", "Quads"],
    breathing: { down: "Quick rhythmic breathing", up: "Exhale on the drive" },
    cues: [
      "Strong plank position",
      "Hips low, in line with shoulders",
      "Drive knees toward chest",
      "Light, quick feet",
    ],
    mistakes: ["Hips bouncing high", "Hands drifting forward", "Half range knee drives"],
  },

  // ---------- CARDIO ----------
  {
    id: "burpee",
    name: "Burpee",
    category: "cardio",
    videoUrl: toAbsolute(burpeeVideo.url),
    primaryMuscles: ["Full Body"],
    secondaryMuscles: ["Core", "Chest", "Quads"],
    breathing: { down: "Inhale on the squat down", up: "Exhale on the jump" },
    cues: [
      "Squat, hands down, kick back to plank",
      "Full push-up (optional)",
      "Jump feet to hands",
      "Explosive jump with hands overhead",
    ],
    mistakes: ["Sagging hips in plank", "Skipping the push-up", "Landing stiff (no knee bend)"],
  },
  {
    id: "treadmill",
    name: "Treadmill Running",
    category: "cardio",
    videoUrl: toAbsolute(treadmillVideo.url),
    primaryMuscles: ["Quads", "Calves", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core"],
    breathing: { down: "Rhythmic — 3 in / 2 out for steady pace", up: "Match cadence" },
    cues: [
      "Land midfoot under hips",
      "Tall posture, slight forward lean",
      "Relaxed shoulders, arms swing front-to-back",
      "Quick cadence (~170–180 spm)",
    ],
    mistakes: ["Heel striking far in front", "Holding the rails", "Hunched shoulders"],
  },
  {
    id: "rowing",
    name: "Rowing Machine",
    category: "cardio",
    videoUrl: toAbsolute(rowingVideo.url),
    primaryMuscles: ["Back", "Legs"],
    secondaryMuscles: ["Biceps", "Core", "Glutes"],
    breathing: { down: "Inhale on recovery", up: "Exhale on the drive" },
    cues: [
      "Drive: legs → hips → arms",
      "Recovery: arms → hips → legs",
      "Lean back slightly at the finish",
      "Pull handle to lower ribs",
    ],
    mistakes: ["Pulling with arms first", "Rounding back at catch", "Bending knees too early on return"],
  },
  {
    id: "cycling",
    name: "Stationary Cycling",
    category: "cardio",
    videoUrl: toAbsolute(cyclingVideo.url),
    primaryMuscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Calves", "Core"],
    breathing: { down: "Steady rhythmic breathing", up: "Match cadence" },
    cues: [
      "Saddle height: slight knee bend at bottom",
      "Light grip on bars",
      "Push and pull through the pedal stroke",
      "Cadence ~80–100 rpm",
    ],
    mistakes: ["Saddle too low (knee strain)", "Bouncing in saddle", "Locking out knees"],
  },
];

export const categoryLabels: Record<ExerciseCategory, string> = {
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  shoulders: "Shoulders",
  core: "Core",
  cardio: "Cardio",
};
