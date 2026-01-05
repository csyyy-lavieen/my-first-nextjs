'use client';

import Image from "next/image";
import SplitText from "./animations/SplitText";
import BlurText from "./animations/BlurText";
import Particles from "./animations/Particles";
import GradientText from "./animations/GradientText";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden transition-colors duration-300">
      {/* Particles Background */}
      <Particles />

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-black/5 dark:bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-black/5 dark:bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-20 sm:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Photo */}
          <div className="flex-shrink-0 flex justify-center lg:justify-start animate-scale-in animation-delay-200">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all duration-500 group animate-glow">
              <Image
                src="/30a3dea9-5a37-4eca-892d-edf0cc822353.jpg"
                alt="Andi Putra Fathahillah"
                width={256}
                height={256}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-neutral-600 dark:text-neutral-400 font-medium text-lg mb-4 animate-blur-reveal">
              Halo, saya
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight text-black dark:text-white">
              <SplitText text="Andi Putra" delay={200} />
              <br />
              <GradientText text="Fathahillah" className="text-5xl sm:text-6xl lg:text-7xl" />
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-neutral-600 dark:text-neutral-400 mb-6 animate-blur-reveal" style={{ animationDelay: '400ms' }}>
              <BlurText text="Frontend Developer" delay={600} />
            </p>

            <div className="space-y-4 mb-8">
              <p className="text-neutral-500 leading-relaxed text-lg max-w-2xl animate-fade-up animation-delay-300">
                Siswa SMK jurusan RPL yang sedang menjalani internship di{' '}
                <span className="text-black dark:text-white font-semibold">PT Ashari Tech, Bandung</span>.
              </p>
              <p className="text-neutral-500 leading-relaxed text-lg max-w-2xl animate-fade-up animation-delay-400">
                Passionate tentang menciptakan pengalaman digital yang memukau dengan fokus pada detail dan performa.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up animation-delay-500">
              <a
                href="#projects"
                className="group px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all hover:scale-105 text-center relative overflow-hidden"
              >
                <span className="relative z-10">Lihat Proyek</span>
                <div className="absolute inset-0 animate-shine" />
              </a>
              <a
                href="#contact"
                className="group px-8 py-4 border-2 border-neutral-400 dark:border-neutral-600 text-black dark:text-white font-bold rounded-lg hover:border-black dark:hover:border-white hover:bg-black/5 dark:hover:bg-white/5 transition-all hover:scale-105 text-center"
              >
                Hubungi Saya
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
