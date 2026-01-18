import { RoadmapGenerator } from "@/components/roadmap-generator";
import { FloatingLeaves } from "@/components/floating-leaves";
import { OnboardingTour } from "@/components/onboarding-tour";

export default function Home() {
  return (
    <main className="min-h-screen bg-bloom-bg relative overflow-hidden transition-colors duration-300">
      {/* Floating Leaves Animation */}
      <FloatingLeaves />

      {/* Onboarding Tour for first-time users */}
      <OnboardingTour />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bloom-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-bloom-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <RoadmapGenerator />
    </main>
  );
}
