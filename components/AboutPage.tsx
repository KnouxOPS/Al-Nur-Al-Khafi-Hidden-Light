import React from 'react';
import { Info, Heart, Github, Mail } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen relative pt-10 pb-24">
      <ParticleBackground />
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        
        <div className="text-center mb-12">
           <h1 className="text-4xl font-serif font-bold text-gold-100 mb-2">Hidden Light</h1>
           <p className="text-gold-400 font-serif text-lg">النور الخفي</p>
        </div>

        <div className="prose prose-invert prose-gold max-w-none bg-deep-emerald/30 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
           <p className="lead text-lg text-slate-300">
             This project is a humanitarian, cognitive, and spiritual attempt to introduce Prophet Muhammad ﷺ to humanity — Muslims and non-Muslims alike — with the dignity, accuracy, and beauty that his legacy deserves.
           </p>
           
           <div className="my-8 h-px bg-white/10"></div>

           <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <Heart size={20} className="text-gold-500" />
             Our Mission
           </h3>
           <p className="text-slate-400 mb-6">
             To create a sacred digital sanctuary that bridges hearts with the light of the Prophet ﷺ using modern technology, authentic sources, and sacred design principles.
           </p>

           <h3 className="text-xl font-bold text-white mb-4">Open Source</h3>
           <p className="text-slate-400 mb-6">
             "Hidden Light" is an open contribution to the world. We believe knowledge should be accessible to all.
           </p>

           <div className="flex gap-4 mt-8">
              <a href="https://github.com/al-nur-al-khafi" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
                 <Github size={18} />
                 GitHub
              </a>
              <a href="mailto:sacred@alnuralkhafi.com" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
                 <Mail size={18} />
                 Contact
              </a>
           </div>
        </div>

        <div className="text-center mt-12 text-slate-500 text-sm">
           <p>Developed with ❤️ and Reverence</p>
           <p className="mt-2 font-serif">"This is not just code - This is an Amanah"</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;