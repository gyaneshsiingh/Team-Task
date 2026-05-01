import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";

export function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col" style={{ background: 'hsl(220,20%,6%)' }}>
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  );
}
