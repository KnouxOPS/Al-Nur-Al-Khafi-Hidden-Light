import React from 'react';
import { Users, Star, ArrowUpRight } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const companions = [
  { name: "Abu Bakr As-Siddiq", title: "The Truthful", desc: "The closest companion and first Caliph, known for his unwavering faith and generosity." },
  { name: "Umar ibn Al-Khattab", title: "Al-Faruq", desc: "Known for his justice, strength, and pivotal role in expanding the Islamic state." },
  { name: "Uthman ibn Affan", title: "Dhun-Nurayn", desc: "The possessor of two lights, known for his modesty and compiling the Quran." },
  { name: "Ali ibn Abi Talib", title: "Asadullah", desc: "The Lion of Allah, known for his deep wisdom, bravery, and eloquence." },
  { name: "Khadijah bint Khuwaylid", title: "Mother of Believers", desc: "The first wife of the Prophet ﷺ and the first to accept Islam." },
  { name: "Aisha bint Abi Bakr", title: "The Scholar", desc: "A profound scholar who narrated thousands of hadiths and taught many companions." }
];

const CompanionsPage: React.FC = () => {
  return (
    <div className="min-h-screen relative pt-10 pb-24">
      <ParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-gold-500/10 rounded-full mb-4">
            <Users className="text-gold-400" size={24} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-gold-100 mb-4">The Companions</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            "My companions are like stars; whichever of them you follow, you will be guided."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companions.map((comp, idx) => (
            <div key={idx} className="group bg-white/5 border border-white/5 rounded-xl p-6 hover:bg-white/10 hover:border-gold-accent/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-deep-navy/50 rounded-lg text-gold-400 group-hover:text-gold-200 transition-colors">
                    <Star size={20} />
                 </div>
                 <ArrowUpRight size={16} className="text-slate-600 group-hover:text-gold-400 transition-colors opacity-0 group-hover:opacity-100" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 font-serif mb-1">{comp.name}</h3>
              <span className="text-xs uppercase tracking-widest text-gold-500/80 mb-3 block">{comp.title}</span>
              <p className="text-slate-400 text-sm leading-relaxed">
                {comp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanionsPage;