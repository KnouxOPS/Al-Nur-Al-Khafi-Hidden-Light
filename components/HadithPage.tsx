import React, { useState } from 'react';
import { Search, Quote } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

interface Hadith {
  id: number;
  source: string;
  narrator: string;
  text: string;
  category: string;
}

const hadiths: Hadith[] = [
  {
    id: 1,
    source: "Sahih Bukhari",
    narrator: "Abu Huraira",
    text: "The Prophet ﷺ said, 'The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger.'",
    category: "Character"
  },
  {
    id: 2,
    source: "Sahih Muslim",
    narrator: "An-Nu'man bin Bashir",
    text: "The Prophet ﷺ said, 'The parable of the believers in their affection, mercy, and compassion for each other is that of a body. When any limb aches, the whole body reacts with sleeplessness and fever.'",
    category: "Community"
  },
  {
    id: 3,
    source: "Tirmidhi",
    narrator: "Abdullah ibn Masud",
    text: "The Prophet ﷺ said, 'Shall I not tell you for whom the Hellfire is forbidden? It is forbidden for everyone who is accessible, polite, and easy-going.'",
    category: "Manners"
  },
  {
    id: 4,
    source: "Sahih Bukhari",
    narrator: "Anas bin Malik",
    text: "The Prophet ﷺ said, 'None of you will have faith till he wishes for his (Muslim) brother what he likes for himself.'",
    category: "Faith"
  },
  {
    id: 5,
    source: "Sahih Muslim",
    narrator: "Abu Huraira",
    text: "The Prophet ﷺ said, 'Wealth is not in having many possessions, but rather (true) wealth is feeling sufficiency in the soul.'",
    category: "Spirituality"
  }
];

const HadithPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(hadiths.map(h => h.category)));

  const filteredHadiths = hadiths.filter(hadith => {
    const matchesSearch = hadith.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          hadith.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? hadith.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen relative pt-10 pb-20">
       <ParticleBackground />
       
       <div className="relative z-10 max-w-5xl mx-auto px-4">
         <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gold-100 mb-4">Pearls of Wisdom</h2>
            <p className="text-slate-400">Authentic narrations from the Messenger of Allah ﷺ</p>
         </div>

         {/* Filter & Search */}
         <div className="mb-12 space-y-4">
            <div className="relative max-w-lg mx-auto">
               <input 
                 type="text" 
                 placeholder="Search keywords..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-deep-800/80 border border-white/10 rounded-full py-3 px-12 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-slate-600"
               />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!selectedCategory ? 'bg-gold-600 text-deep-900' : 'bg-white/5 text-slate-400 hover:text-white'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-gold-600 text-deep-900' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
         </div>

         {/* Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {filteredHadiths.map(hadith => (
             <div key={hadith.id} className="bg-white/5 border border-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors group">
               <div className="mb-4 text-gold-500/30 group-hover:text-gold-500/60 transition-colors">
                 <Quote size={32} />
               </div>
               <p className="text-lg text-slate-200 font-serif leading-relaxed mb-6">
                 "{hadith.text}"
               </p>
               <div className="flex items-center justify-between text-sm border-t border-white/10 pt-4">
                 <div>
                    <span className="block text-gold-400 font-semibold">{hadith.narrator}</span>
                    <span className="text-slate-500 text-xs">{hadith.source}</span>
                 </div>
                 <span className="px-2 py-1 rounded bg-deep-900 text-slate-400 text-xs uppercase tracking-wider">
                   {hadith.category}
                 </span>
               </div>
             </div>
           ))}
         </div>
         
         {filteredHadiths.length === 0 && (
           <div className="text-center text-slate-500 mt-12">
             No hadiths found matching your criteria.
           </div>
         )}
       </div>
    </div>
  );
};

export default HadithPage;