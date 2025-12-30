import { RoadmapGenerator } from "@/components/roadmap-generator";
import { FloatingLeaves } from "@/components/floating-leaves";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-bloom-bg to-white relative overflow-hidden">
      {/* Floating Leaves Animation */}
      <FloatingLeaves />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bloom-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-bloom-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <RoadmapGenerator />
    </main>
  );
}
