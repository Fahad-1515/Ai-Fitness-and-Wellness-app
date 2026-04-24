import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Lifestyle from "./pages/Lifestyle";
import Profile from "./pages/Profile";
import AICoach from "./pages/AICoach";
import WorkoutFormChecker from "./pages/WorkoutFormChecker";
import HealthAssessment from "./pages/HealthAssessment";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/lifestyle" element={<Lifestyle />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/form-checker" element={<WorkoutFormChecker />} />
          <Route path="/health-assessment" element={<HealthAssessment />} />
          <Route path="/exercise-library" element={<ExerciseLibrary />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
