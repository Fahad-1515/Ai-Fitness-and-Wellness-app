import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Camera, CameraOff, Volume2, VolumeX, Activity } from "lucide-react";
import Layout from "@/components/Layout";
import {
  initializePoseDetection,
  detectExercise,
  analyzePushup,
  analyzeSquat,
  analyzePlank,
  analyzeHandRaise,
  drawPoseLandmarks,
  type PoseAnalysis
} from "@/utils/poseDetection";
import { tts } from "@/utils/textToSpeech";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WorkoutFormChecker = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [currentExercise, setCurrentExercise] = useState<string>("auto");
  const [analysis, setAnalysis] = useState<PoseAnalysis | null>(null);
  const [fps, setFps] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const isActiveRef = useRef<boolean>(false);
  const lastAnalysisTimeRef = useRef<number>(0);
  const fpsCounterRef = useRef<{ frames: number; lastTime: number }>({ frames: 0, lastTime: 0 });

  useEffect(() => {
    return () => {
      stopCamera();
      tts.stop();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsInitializing(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        await videoRef.current.play();
        
        // Initialize pose detection
        await initializePoseDetection();
        
        setIsActive(true);
        isActiveRef.current = true;
        setIsInitializing(false);
        
        if (isSpeechEnabled) {
          tts.speak("Workout form checker activated. Show me your exercise!", 'high');
        }
        
        toast.success("Camera started! Position yourself in frame");
        
        // Start analysis loop
        processFrame();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
    isActiveRef.current = false;
    setAnalysis(null);
    tts.stop();
    
    if (isSpeechEnabled) {
      tts.speak("Form checker stopped", 'high');
    }
  };

  const processFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !isActiveRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== 4) {
      animationRef.current = requestAnimationFrame(processFrame);
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const poseLandmarker = await initializePoseDetection();
      const startTime = performance.now();
      
      const results = await poseLandmarker.detectForVideo(video, startTime);

      // Update FPS
      const now = performance.now();
      fpsCounterRef.current.frames++;
      if (now - fpsCounterRef.current.lastTime > 1000) {
        setFps(fpsCounterRef.current.frames);
        fpsCounterRef.current.frames = 0;
        fpsCounterRef.current.lastTime = now;
      }

      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        
        // Draw pose landmarks
        drawPoseLandmarks(ctx, landmarks, canvas.width, canvas.height);

        // Analyze every 500ms
        if (now - lastAnalysisTimeRef.current > 500) {
          let exerciseType = currentExercise;
          
          // Auto-detect exercise if set to auto
          if (exerciseType === "auto") {
            exerciseType = detectExercise(landmarks);
          }

          let newAnalysis: PoseAnalysis | null = null;

          switch (exerciseType) {
            case "pushup":
              newAnalysis = analyzePushup(landmarks);
              break;
            case "squat":
              newAnalysis = analyzeSquat(landmarks);
              break;
            case "plank":
              newAnalysis = analyzePlank(landmarks);
              break;
            case "handraise":
              newAnalysis = analyzeHandRaise(landmarks);
              break;
          }

          if (newAnalysis) {
            setAnalysis(newAnalysis);

            // Voice coaching: speak corrections for every detected issue
            if (isSpeechEnabled && newAnalysis.issues.length > 0) {
              const firstIssue = newAnalysis.issues[0];
              const isPositive =
                firstIssue.includes("Great") ||
                firstIssue.includes("Perfect") ||
                firstIssue.includes("Solid");
              // Only speak corrections, not praise (avoids spam)
              if (!isPositive) {
                tts.speak(firstIssue, 'normal');
              }
            }
          }

          lastAnalysisTimeRef.current = now;
        }
      } else {
        // No person detected
        if (analysis !== null) {
          setAnalysis(null);
        }
      }
    } catch (error) {
      console.error("Error processing frame:", error);
    }

    animationRef.current = requestAnimationFrame(processFrame);
  };

  const toggleSpeech = () => {
    const newState = !isSpeechEnabled;
    setIsSpeechEnabled(newState);
    
    if (newState) {
      tts.speak("Voice feedback enabled", 'high');
    } else {
      tts.stop();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Real-Time Form Checker
          </h1>
          <p className="text-muted-foreground">
            AI-powered workout form analysis with voice coaching
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Camera Feed</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {fps} FPS
                  </Badge>
                  {analysis && (
                    <Badge className={getScoreColor(analysis.score)}>
                      Score: {analysis.score}%
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />
                {!isActive && !isInitializing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                {isInitializing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Initializing AI...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                {!isActive ? (
                  <Button 
                    onClick={startCamera} 
                    className="flex-1"
                    disabled={isInitializing}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <Button 
                    onClick={stopCamera} 
                    variant="destructive" 
                    className="flex-1"
                  >
                    <CameraOff className="h-4 w-4 mr-2" />
                    Stop Camera
                  </Button>
                )}

                <Button
                  onClick={toggleSpeech}
                  variant="outline"
                  disabled={!isActive}
                >
                  {isSpeechEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exercise Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={currentExercise} onValueChange={setCurrentExercise}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-Detect</SelectItem>
                    <SelectItem value="pushup">Push-up</SelectItem>
                    <SelectItem value="squat">Squat</SelectItem>
                    <SelectItem value="plank">Plank</SelectItem>
                    <SelectItem value="handraise">Hand Raise</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {analysis && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Exercise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">
                      {analysis.exercise}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Form Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {analysis.issues.map((issue, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-sm ${
                          issue.includes("Great") || issue.includes("Perfect") || issue.includes("Solid")
                            ? "bg-green-500/10 text-green-700 dark:text-green-300"
                            : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {issue}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Angles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(analysis.keyAngles).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <Badge variant="secondary">{value}°</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkoutFormChecker;
