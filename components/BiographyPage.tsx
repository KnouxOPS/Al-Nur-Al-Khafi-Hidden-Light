import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

interface Event {
  year: number;
  yearAH?: number;
  title: string;
  description: string;
  location?: string;
}

const events: Event[] = [
  {
    year: 570,
    title: "The Year of the Elephant",
    description: "Birth of Muhammad ﷺ in Mecca. His father Abdullah had passed away before his birth.",
    location: "Mecca"
  },
  {
    year: 576,
    title: "Loss of Mother",
    description: "His mother Aminah passes away when he is six years old. He is taken into the care of his grandfather Abdul-Muttalib.",
    location: "Abwa"
  },
  {
    year: 595,
    title: "Marriage to Khadijah (RA)",
    description: "At age 25, he marries Khadijah bint Khuwaylid, a noble businesswoman of Mecca.",
    location: "Mecca"
  },
  {
    year: 610,
    title: "The First Revelation",
    description: "At age 40, in the Cave of Hira, the Angel Jibreel (Gabriel) brings the first revelation of the Quran: 'Read in the name of your Lord...'",
    location: "Cave of Hira, Mecca"
  },
  {
    year: 622,
    yearAH: 1,
    title: " The Hijrah (Migration)",
    description: "Migration from Mecca to Medina (Yathrib), marking the beginning of the Islamic calendar and the establishment of the first Islamic state.",
    location: "Medina"
  },
  {
    year: 624,
    yearAH: 2,
    title: "Battle of Badr",
    description: "A decisive victory for the Muslims despite being outnumbered, affirming the divine support for the new community.",
    location: "Badr"
  },
  {
    year: 630,
    yearAH: 8,
    title: "Conquest of Mecca",
    description: "The Prophet ﷺ enters Mecca peacefully with 10,000 companions. He grants general amnesty to the people of Mecca.",
    location: "Mecca"
  },
  {
    year: 632,
    yearAH: 10,
    title: "Farewell Sermon & Passing",
    description: "Delivers the Farewell Sermon emphasizing equality and human rights. Passes away in Medina at the age of 63.",
    location: "Medina"
  }
];

const BiographyPage: React.FC = () => {
  return (
    <div className="min-h-screen relative pt-10 pb-20">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gold-100 mb-4">The Prophetic Timeline</h2>
          <p className="text-slate-400">Key milestones in the blessed life of Muhammad ﷺ</p>
        </div>

        <div className="space-y-12">
          {events.map((event, index) => (
            <div key={index} className="relative pl-8 md:pl-0">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-accent/50 to-transparent -translate-x-1/2"></div>
              
              <div className={`md:flex items-center justify-between ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                {/* Content */}
                <div className="md:w-[45%] mb-8 md:mb-0">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-6 hover:border-gold-accent/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-2 text-gold-400 font-mono text-sm">
                            <Calendar size={14} />
                            {event.year} CE {event.yearAH && `/ ${event.yearAH} AH`}
                        </span>
                        {event.location && (
                             <span className="inline-flex items-center gap-1 text-slate-500 text-xs">
                                <MapPin size={12} />
                                {event.location}
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-serif">{event.title}</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 -translate-x-[5px] md:-translate-x-1/2 md:-translate-y-1/2 w-3 h-3 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] z-20">
                    <div className="absolute w-full h-full rounded-full bg-gold-500 animate-ping opacity-75"></div>
                </div>
                
                {/* Spacer for layout balance */}
                <div className="md:w-[45%]"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-20">
           <div className="inline-block p-4 border-t border-b border-white/10">
               <p className="font-serif text-2xl text-slate-400">
                   "My likeness and that of the prophets before me is that of a person who built a house and perfected it..."
               </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BiographyPage;