'use client';

import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';

// Optimasi Performance: Lazy load komponen di bawah fold
const About = dynamic(() => import('@/components/About'));
const TechStack = dynamic(() => import('@/components/Mytools'));
const Projects = dynamic(() => import('@/components/Projects'));
const Contact = dynamic(() => import('@/components/Contact'));
const FloatingChat = dynamic(() => import('@/components/ChatWidget'), { ssr: false });

const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false,
  loading: () => <nav className="sticky top-0 z-50 h-[73px] bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800" />
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navbar />
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Contact />
      <FloatingChat />
    </div>
  );
}
