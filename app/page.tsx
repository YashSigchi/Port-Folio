import React from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { FloatingAccents } from '@/components/ui/FloatingAccents';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { WorkSection } from '@/components/sections/WorkSection';
import { DisciplinesSection } from '@/components/sections/DisciplinesSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { BeyondSection } from '@/components/sections/BeyondSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { ContactSection } from '@/components/sections/ContactSection';

// Strictly max TWO <Canvas> instances on Home:
// 1. Hero Neural Nebula (ssr: false)
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
});

// 2. Lazy-loaded Skills Constellation (ssr: false, only mounted when desktop toggle is switched to 3D)
const SkillsConstellation = dynamic(
  () => import('@/components/three/SkillsConstellation'),
  {
    ssr: false,
  }
);

export default function HomePage() {
  return (
    <>
      <Navbar />
      <FloatingAccents />
      <main id="main-content" className="min-h-screen">
        <HeroSection sceneSlot={<HeroScene />} />
        <AboutSection />
        <ExperienceSection />
        <WorkSection />
        <DisciplinesSection />
        <SkillsSection constellationSlot={<SkillsConstellation />} />
        <ProcessSection />
        <AchievementsSection />
        <BeyondSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
