import React from 'react';
import { Shield, Map, Flag } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const battles = [
  { 
    name: "Battle of Badr", 
    date: "2 AH (624 CE)", 
    result: "Victory",
    desc: "The first major battle between Muslims and Quraysh. Despite being outnumbered 3:1, the Muslims achieved a decisive victory.",
    mapParams: "opacity=0.4" 
  },
  { 
    name: "Battle of Uhud", 
    date: "3 AH (625 CE)", 
    result: "Setback",
    desc: "A battle of great lessons where a moment of disobedience led to a reversal of victory. The Prophet ﷺ was injured.",
    mapParams: "opacity=0.3" 
  },
  { 
    name: "Battle of the Trench", 
    date: "5 AH (627 CE)", 
    result: "Strategic Victory",
    desc: "A 30-day siege of Medina. The Muslims dug a trench to defend the city, leading to the withdrawal of the confederate forces.",
    mapParams: "opacity=0.4" 
  }
];

const BattlesPage: React.FC = () => {
  return (
    <div className="min-h-screen relative pt-10 pb-24">
      <ParticleBackground />
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-gold-500/10 rounded-full mb-4">
            <Shield className="text-gold-400" size={24} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-gold-100 mb-4">Chronicles of Struggle</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Understanding the context of defensive struggles and the ethics of engagement established by the Prophet ﷺ.
          </p>
        </div>

        <div className="space-y-12">
           {battles.map((battle, idx) => (
             <div key={idx} className="bg-deep-emerald/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto bg-deep-navy relative overflow-hidden">
                   {/* Abstract Map Representation */}
                   <div className="absolute inset-0 bg-gradient-to-br from-gold-900/10 to-transparent"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Map size={48} className="text-white/10" />
                   </div>
                   <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded text-xs text-gold-200 border border-white/10">
                        {battle.date}
                      </span>
                   </div>
                </div>
                <div className="p-8 md:w-2/3">
                   <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold font-serif text-white">{battle.name}</h3>
                      <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        battle.result === 'Victory' ? 'bg-green-900/30 text-green-400 border border-green-800' : 
                        battle.result === 'Setback' ? 'bg-red-900/30 text-red-400 border border-red-800' :
                        'bg-blue-900/30 text-blue-400 border border-blue-800'
                      }`}>
                        {battle.result}
                      </span>
                   </div>
                   <p className="text-slate-300 leading-relaxed mb-6">
                     {battle.desc}
                   </p>
                   <button className="text-gold-400 text-sm hover:text-gold-300 flex items-center gap-2 transition-colors">
                     <Flag size={14} /> View Strategic Details
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default BattlesPage;