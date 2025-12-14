import React from 'react';
import { Scroll, Heart, Feather } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const quotes = [
  { text: "Kindness is a mark of faith, and whoever has not kindness has not faith.", topic: "Kindness" },
  { text: "A white has no superiority over a black nor a black has any superiority over white except by piety and good action.", topic: "Equality" },
  { text: "The best among you is the one who doesn't harm others with his tongue and hands.", topic: "Character" },
  { text: "Riches are not from an abundance of worldly good but from a contented mind.", topic: "Contentment" },
];

const WisdomPage: React.FC = () => {
  return (
    <div className="min-h-screen relative pt-10 pb-24">
      <ParticleBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-gold-500/10 rounded-full mb-4">
            <Feather className="text-gold-400" size={24} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-gold-100 mb-4">Timeless Wisdom</h2>
          <p className="text-slate-400">Ethical teachings that transcend time and place.</p>
        </div>

        <div className="grid gap-8">
           {quotes.map((quote, idx) => (
             <div key={idx} className="relative bg-white/5 p-10 rounded-2xl border border-white/5 text-center hover:border-gold-accent/20 transition-all duration-500 group">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-gold-500/10">
                   <Scroll size={40} />
                </div>
                <p className="relative z-10 text-xl md:text-2xl font-serif leading-relaxed text-slate-200">
                  "{quote.text}"
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                   <div className="h-px w-8 bg-gold-500/30"></div>
                   <span className="text-gold-400 text-xs uppercase tracking-widest">{quote.topic}</span>
                   <div className="h-px w-8 bg-gold-500/30"></div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default WisdomPage;