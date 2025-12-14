import React from 'react';
import { ArrowRight, Star, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';

const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 text-center">
        <div className="animate-float mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-gold-accent/30 flex items-center justify-center bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
                <span className="font-serif text-6xl md:text-8xl text-gold-accent opacity-90">ﷺ</span>
            </div>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 mb-6 drop-shadow-sm">
          Revealing the Hidden Light
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-300 max-w-2xl font-light leading-relaxed mb-10">
          "And We have not sent you, [O Muhammad], except as a mercy to the worlds."
          <span className="block text-sm text-gold-600 mt-2 font-serif opacity-80">Quran 21:107</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/biography"
            className="group px-8 py-4 bg-gold-600 hover:bg-gold-500 text-deep-900 font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(202,138,4,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
          >
            Explore His Life
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/ai-search" 
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full border border-white/10 hover:border-gold-accent/50 transition-all flex items-center justify-center backdrop-blur-sm"
          >
            Ask AI
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 bg-deep-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Star className="text-gold-400" size={32} />}
              title="A Life of Purpose"
              description="Trace the timeline of the Prophet's life from birth to the final sermon, understanding the context of his mission."
            />
            <FeatureCard 
              icon={<Heart className="text-gold-400" size={32} />}
              title="Universal Mercy"
              description="Discover stories of compassion, ethics, and justice that transformed a society and continue to inspire billions."
            />
            <FeatureCard 
              icon={<Shield className="text-gold-400" size={32} />}
              title="Enduring Wisdom"
              description="Access a curated collection of authentic Hadiths categorized by topic for daily reflection and guidance."
            />
          </div>
        </div>
      </section>

      {/* Quran Verse Section */}
      <section className="relative z-10 py-32 px-4 text-center">
        <div className="max-w-4xl mx-auto">
            <p className="font-serif text-3xl md:text-5xl text-slate-200 leading-loose" dir="rtl">
                وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ
            </p>
            <p className="mt-6 text-xl text-gold-400 font-light italic">
                "And indeed, you are of a great moral character."
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-600 to-transparent mx-auto mt-8 opacity-50"></div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-accent/30 hover:bg-white/10 transition-all duration-300 group">
    <div className="mb-6 p-4 rounded-full bg-deep-900 w-fit group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 font-serif">{title}</h3>
    <p className="text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default HomePage;