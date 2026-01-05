'use client';

import TiltCard from './animations/TiltCard';
import BlurText from './animations/BlurText';

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Platform e-commerce modern dengan fitur katalog produk, keranjang belanja, dan sistem pembayaran terintegrasi.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80',
      tags: ['React', 'Next.js', 'Tailwind CSS'],
      status: 'Coming Soon',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Aplikasi manajemen tugas dengan fitur drag-and-drop, prioritas task, dan reminder notifikasi real-time.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&q=80',
      tags: ['React', 'TypeScript', 'Firebase'],
      status: 'Coming Soon',
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      description: 'Dashboard analytics untuk menganalisis performa konten di berbagai platform media sosial dengan visualisasi data.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80',
      tags: ['Next.js', 'Chart.js', 'API'],
      status: 'Coming Soon',
    },
    {
      id: 4,
      title: 'AI Chat Assistant',
      description: 'Aplikasi chatbot bertenaga AI untuk customer service dan support otomatis dengan response time cepat.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&q=80',
      tags: ['Python', 'React', 'Machine Learning'],
      status: 'Coming Soon',
    },
    {
      id: 5,
      title: 'Weather Forecast App',
      description: 'Aplikasi cuaca real-time dengan notifikasi alerts dan prediksi jangka panjang yang akurat.',
      image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=600&h=400&fit=crop&q=80',
      tags: ['React', 'Weather API', 'Tailwind'],
      status: 'Coming Soon',
    },
    {
      id: 6,
      title: 'Design System',
      description: 'Component library dan design system lengkap dengan dokumentasi untuk konsistensi design di berbagai project.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&q=80',
      tags: ['Figma', 'Storybook', 'React'],
      status: 'Coming Soon',
    },
  ];

  return (
    <section id="projects" className="relative py-24 bg-black light:bg-white border-t border-neutral-800 light:border-neutral-200 overflow-hidden transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white light:text-black mb-4">
            <BlurText text="Upcoming Projects" delay={100} />
          </h2>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto animate-fade-up animation-delay-200">
            Proyek-proyek menarik yang sedang saya kerjakan dan akan segera diluncurkan
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <TiltCard key={project.id}>
              <div
                className="group relative bg-neutral-950 light:bg-neutral-50 rounded-xl overflow-hidden border border-neutral-800 light:border-neutral-200 hover:border-neutral-600 light:hover:border-neutral-400 transition-all duration-500 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/20">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white light:text-black mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    {project.title}
                  </h3>
                  <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-neutral-900 light:bg-neutral-100 border border-neutral-700 light:border-neutral-300 text-neutral-400 light:text-neutral-600 text-xs rounded font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Overlay Line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white light:bg-black group-hover:w-full transition-all duration-500" />
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Info */}
        <div className="mt-16 text-center">
          <p className="text-neutral-500 text-lg animate-fade-up">
            Lebih banyak project akan datang. Nantikan update terbaru.
          </p>
        </div>
      </div>
    </section>
  );
}
