'use client';

import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import About from '@/components/About';
// import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import FloatingChat from '@/components/FloatingChat';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navbar />
      <Hero />
      <About />
      {/* <Projects /> */}
      <Contact />
      <FloatingChat />
    </div>
  );
}
