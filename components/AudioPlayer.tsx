import React from 'react';
import { Play, Pause, Volume2, SkipForward, SkipBack } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';

const AudioPlayer: React.FC = () => {
  const { audioPlaying, toggleAudio } = useStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-deep-emerald/95 border-t border-white/5 backdrop-blur-lg z-50 transform transition-transform duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-gold-accent/20 flex items-center justify-center">
            <Volume2 size={20} className="text-gold-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">Ambient Recitation</p>
            <p className="text-xs text-slate-400">Surah Al-Ahzab (Verse 56)</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={toggleAudio}
            className="w-10 h-10 rounded-full bg-gold-600 hover:bg-gold-500 flex items-center justify-center text-deep-900 transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
          >
            {audioPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>

          <button className="text-slate-400 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Progress (Fake) */}
        <div className="hidden md:flex items-center gap-2 w-1/3">
           <span className="text-xs text-slate-500">0:45</span>
           <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gold-500 rounded-full"></div>
           </div>
           <span className="text-xs text-slate-500">3:12</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;