import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footprints, Play, Square, RotateCcw } from "lucide-react";
import ProgressRing from "./ProgressRing";

interface StepCounterProps {
  onStepsUpdate?: (steps: number) => void;
  initialSteps?: number;
  goal?: number;
}

const StepCounter = ({ onStepsUpdate, initialSteps = 0, goal = 10000 }: StepCounterProps) => {
  const [steps, setSteps] = useState(initialSteps);
  const [isTracking, setIsTracking] = useState(false);
  const [hasAccelerometer, setHasAccelerometer] = useState(true);
  const [needsPermission, setNeedsPermission] = useState(false);
  const lastAccelRef = useRef({ x: 0, y: 0, z: 0 });
  const stepThreshold = 1.2;
  const lastStepTimeRef = useRef(0);
  const cooldownMs = 300;

  useEffect(() => {
    setSteps(initialSteps);
  }, [initialSteps]);

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

    const { x: lx, y: ly, z: lz } = lastAccelRef.current;
    const dx = (acc.x ?? 0) - lx;
    const dy = (acc.y ?? 0) - ly;
    const dz = (acc.z ?? 0) - lz;
    const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);

    lastAccelRef.current = { x: acc.x ?? 0, y: acc.y ?? 0, z: acc.z ?? 0 };

    const now = Date.now();
    if (magnitude > stepThreshold && now - lastStepTimeRef.current > cooldownMs) {
      lastStepTimeRef.current = now;
      setSteps((prev) => {
        const newSteps = prev + 1;
        onStepsUpdate?.(newSteps);
        return newSteps;
      });
    }
  }, [onStepsUpdate]);

  const startTracking = useCallback(async () => {
    if (!window.DeviceMotionEvent) {
      setHasAccelerometer(false);
      return;
    }

    // iOS 13+ requires explicit permission via user gesture
    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission !== "granted") {
          setHasAccelerometer(false);
          setNeedsPermission(false);
          return;
        }
      } catch {
        setHasAccelerometer(false);
        setNeedsPermission(false);
        return;
      }
    }

    window.addEventListener("devicemotion", handleMotion);
    setIsTracking(true);
    setNeedsPermission(false);
  }, [handleMotion]);

  const stopTracking = () => {
    window.removeEventListener("devicemotion", handleMotion);
    setIsTracking(false);
  };

  const resetSteps = () => {
    setSteps(0);
    onStepsUpdate?.(0);
  };

  // Auto-start tracking on mount when possible (no permission prompt needed)
  useEffect(() => {
    if (!window.DeviceMotionEvent) {
      setHasAccelerometer(false);
      return;
    }
    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      // iOS — needs a user tap to grant motion permission
      setNeedsPermission(true);
    } else {
      window.addEventListener("devicemotion", handleMotion);
      setIsTracking(true);
    }
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [handleMotion]);

  const progress = Math.min((steps / goal) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-primary" />
            Step Counter
          </span>
          <Badge variant={isTracking ? "default" : "secondary"}>
            {isTracking ? "Tracking" : "Paused"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <ProgressRing value={steps} max={goal} label="Steps" size={120} strokeWidth={8} />
          </div>
        </div>

        {!hasAccelerometer && (
          <p className="text-sm text-muted-foreground text-center">
            Accelerometer not available. Enter steps manually in the form below.
          </p>
        )}

        {hasAccelerometer && needsPermission && !isTracking && (
          <p className="text-xs text-muted-foreground text-center">
            Tap Enable to allow motion sensors (required on iOS).
          </p>
        )}

        {hasAccelerometer && !needsPermission && isTracking && (
          <p className="text-xs text-muted-foreground text-center">
            Auto-tracking via motion sensors. Keep your phone with you.
          </p>
        )}

        <div className="flex gap-2">
          {needsPermission && !isTracking ? (
            <Button onClick={startTracking} className="flex-1" size="sm" disabled={!hasAccelerometer}>
              <Play className="h-4 w-4 mr-1" />
              Enable Sensors
            </Button>
          ) : isTracking ? (
            <Button onClick={stopTracking} variant="destructive" className="flex-1" size="sm">
              <Square className="h-4 w-4 mr-1" />
              Pause
            </Button>
          ) : (
            <Button onClick={startTracking} className="flex-1" size="sm" disabled={!hasAccelerometer}>
              <Play className="h-4 w-4 mr-1" />
              Resume
            </Button>
          )}
          <Button onClick={resetSteps} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepCounter;
