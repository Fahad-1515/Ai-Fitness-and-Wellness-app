import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseAnalysis {
  exercise: string;
  issues: string[];
  score: number;
  keyAngles: Record<string, number>;
}

let poseLandmarker: PoseLandmarker | null = null;

export const initializePoseDetection = async (): Promise<PoseLandmarker> => {
  if (poseLandmarker) return poseLandmarker;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numPoses: 1,
    minPoseDetectionConfidence: 0.5,
    minPosePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  return poseLandmarker;
};

export const calculateAngle = (
  a: PoseLandmark,
  b: PoseLandmark,
  c: PoseLandmark
): number => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  
  return angle;
};

export const analyzePushup = (landmarks: PoseLandmark[]): PoseAnalysis => {
  const issues: string[] = [];
  let score = 100;

  // Key landmarks for pushup
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftElbow = landmarks[13];
  const rightElbow = landmarks[14];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];

  // Calculate angles
  const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const bodyAngle = calculateAngle(leftShoulder, leftHip, leftKnee);

  const keyAngles = {
    leftArm: Math.round(leftArmAngle),
    rightArm: Math.round(rightArmAngle),
    body: Math.round(bodyAngle)
  };

  // Check elbow angle (should be around 90 degrees at bottom)
  if (leftArmAngle < 70 || leftArmAngle > 110) {
    issues.push("Keep your elbows at 90 degrees");
    score -= 20;
  }

  // Check body alignment (should be straight)
  if (bodyAngle < 160) {
    issues.push("Keep your body straight - engage your core");
    score -= 25;
  }

  // Check hand position
  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
  const handWidth = Math.abs(leftWrist.x - rightWrist.x);
  
  if (handWidth < shoulderWidth * 0.8) {
    issues.push("Hands should be shoulder-width apart");
    score -= 15;
  }

  return {
    exercise: "Push-up",
    issues: issues.length > 0 ? issues : ["Great form!"],
    score: Math.max(0, score),
    keyAngles
  };
};

export const analyzeSquat = (landmarks: PoseLandmark[]): PoseAnalysis => {
  const issues: string[] = [];
  let score = 100;

  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];
  const leftAnkle = landmarks[27];
  const rightAnkle = landmarks[28];
  const leftShoulder = landmarks[11];

  // Calculate angles
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);

  const keyAngles = {
    leftKnee: Math.round(leftKneeAngle),
    rightKnee: Math.round(rightKneeAngle),
    hip: Math.round(hipAngle)
  };

  // Check squat depth (knee angle should be around 90 degrees or less)
  if (leftKneeAngle > 110) {
    issues.push("Go deeper - aim for 90 degrees at the knees");
    score -= 20;
  }

  // Check knee alignment
  if (Math.abs(leftKnee.x - leftAnkle.x) > 0.1) {
    issues.push("Keep knees aligned with toes");
    score -= 25;
  }

  // Check back angle
  if (hipAngle < 70) {
    issues.push("Keep chest up - don't lean too far forward");
    score -= 20;
  }

  return {
    exercise: "Squat",
    issues: issues.length > 0 ? issues : ["Perfect squat!"],
    score: Math.max(0, score),
    keyAngles
  };
};

export const analyzePlank = (landmarks: PoseLandmark[]): PoseAnalysis => {
  const issues: string[] = [];
  let score = 100;

  const leftShoulder = landmarks[11];
  const leftElbow = landmarks[13];
  const leftHip = landmarks[23];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];

  // Calculate body line angle
  const bodyAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);
  const shoulderToHip = calculateAngle(leftElbow, leftShoulder, leftHip);

  const keyAngles = {
    bodyLine: Math.round(bodyAngle),
    shoulderAlignment: Math.round(shoulderToHip)
  };

  // Check if body is straight
  if (bodyAngle < 165) {
    if (leftHip.y > leftShoulder.y + 0.1) {
      issues.push("Hips are too high - lower them");
    } else {
      issues.push("Hips are sagging - engage your core");
    }
    score -= 30;
  }

  // Check shoulder alignment
  if (shoulderToHip < 75 || shoulderToHip > 105) {
    issues.push("Keep shoulders directly over elbows");
    score -= 20;
  }

  return {
    exercise: "Plank",
    issues: issues.length > 0 ? issues : ["Solid plank!"],
    score: Math.max(0, score),
    keyAngles
  };
};

export const analyzeHandRaise = (landmarks: PoseLandmark[]): PoseAnalysis => {
  const issues: string[] = [];
  let score = 100;

  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftElbow = landmarks[13];
  const rightElbow = landmarks[14];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  // Arm elevation: angle at shoulder between hip and wrist
  const leftArmElevation = calculateAngle(leftHip, leftShoulder, leftWrist);
  const rightArmElevation = calculateAngle(rightHip, rightShoulder, rightWrist);

  // Elbow straightness
  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

  const keyAngles = {
    leftArm: Math.round(leftArmElevation),
    rightArm: Math.round(rightArmElevation),
    leftElbow: Math.round(leftElbowAngle),
    rightElbow: Math.round(rightElbowAngle),
  };

  // Symmetry check
  if (Math.abs(leftArmElevation - rightArmElevation) > 20) {
    issues.push("Raise both arms evenly");
    score -= 20;
  }

  // Elbows should stay mostly straight (not bent)
  if (leftElbowAngle < 150 || rightElbowAngle < 150) {
    issues.push("Keep your arms straight - don't bend elbows");
    score -= 20;
  }

  // Wrists should not go above shoulders (lateral raise standard)
  const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
  if (leftWrist.y < avgShoulderY - 0.05 || rightWrist.y < avgShoulderY - 0.05) {
    issues.push("Don't raise hands above shoulder height");
    score -= 15;
  }

  // Encourage proper range - arms should reach near shoulder level
  const avgElevation = (leftArmElevation + rightArmElevation) / 2;
  if (avgElevation < 70) {
    issues.push("Raise arms higher - to shoulder level");
    score -= 20;
  }

  // Shoulders shouldn't shrug (wrists too close to head)
  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
  if (Math.abs(leftWrist.y - leftShoulder.y) < 0.05 && Math.abs(leftWrist.x - leftShoulder.x) < shoulderWidth * 0.3) {
    issues.push("Relax your shoulders - don't shrug");
    score -= 10;
  }

  return {
    exercise: "Hand Raise",
    issues: issues.length > 0 ? issues : ["Excellent raises!"],
    score: Math.max(0, score),
    keyAngles,
  };
};

export const detectExercise = (landmarks: PoseLandmark[]): string => {
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];
  const leftElbow = landmarks[13];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];

  // Calculate relative positions
  const shoulderToHipDistance = Math.abs(leftShoulder.y - leftHip.y);
  const hipToKneeDistance = Math.abs(leftHip.y - leftKnee.y);
  const elbowHeight = leftElbow.y;
  const shoulderHeight = leftShoulder.y;
  const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;

  // Hand raise detection - upright torso, arms extended away from body
  const torsoUpright = shoulderToHipDistance > 0.2 && leftHip.y > leftShoulder.y;
  const wristsAwayFromHips = Math.abs(leftWrist.y - avgShoulderY) < 0.25 && Math.abs(rightWrist.y - avgShoulderY) < 0.25;
  if (torsoUpright && wristsAwayFromHips && hipToKneeDistance > shoulderToHipDistance * 0.8) {
    return "handraise";
  }

  // Plank detection - body horizontal, elbows on ground
  if (Math.abs(leftShoulder.y - leftHip.y) < 0.15 && leftElbow.y > leftShoulder.y) {
    return "plank";
  }

  // Pushup detection - similar to plank but hands on ground
  if (Math.abs(leftShoulder.y - leftHip.y) < 0.2 && elbowHeight < shoulderHeight + 0.3) {
    return "pushup";
  }

  // Squat detection - knees bent, upright torso
  if (hipToKneeDistance < shoulderToHipDistance * 0.8) {
    return "squat";
  }

  return "unknown";
};

export const drawPoseLandmarks = (
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmark[],
  width: number,
  height: number
) => {
  // Draw connections
  const connections = [
    [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
    [11, 23], [12, 24], [23, 24], // Torso
    [23, 25], [25, 27], [24, 26], [26, 28], // Legs
  ];

  // Dark dotted skeleton with subtle white halo for visibility on any background
  ctx.lineCap = 'round';
  ctx.setLineDash([2, 8]);

  // Halo
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 6;
  connections.forEach(([start, end]) => {
    const s = landmarks[start];
    const e = landmarks[end];
    ctx.beginPath();
    ctx.moveTo(s.x * width, s.y * height);
    ctx.lineTo(e.x * width, e.y * height);
    ctx.stroke();
  });

  // Dark dotted line
  ctx.strokeStyle = '#0a0a0a';
  ctx.lineWidth = 4;
  connections.forEach(([start, end]) => {
    const s = landmarks[start];
    const e = landmarks[end];
    ctx.beginPath();
    ctx.moveTo(s.x * width, s.y * height);
    ctx.lineTo(e.x * width, e.y * height);
    ctx.stroke();
  });

  ctx.setLineDash([]);

  // Joint dots — dark with white ring
  landmarks.forEach((landmark) => {
    const x = landmark.x * width;
    const y = landmark.y * height;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
  });
};
