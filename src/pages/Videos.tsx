import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CyberCard, CyberButton } from '../components/CyberComponents';
import { Play, Search, Filter, Clock, BookOpen, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

export function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const catFilter = searchParams.get('cat');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
      setVideos(vids);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         v.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = !catFilter || v.category.toLowerCase() === catFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      const id = (match && match[2].length === 11) ? match[2] : null;
      return id ? `https://www.youtube.com/embed/${id}` : null;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-cyber tracking-tighter">CYBER <span className="text-cyber-blue">TUTORIALS</span></h1>
          <p className="text-gray-400">Locked and loaded educational modules.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="SEARCH DATABASE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-cyber-dark border border-cyber-blue/30 rounded-lg py-2.5 pl-10 pr-4 text-sm font-cyber focus:border-cyber-blue outline-none transition-all"
          />
        </div>
      </header>

      {/* Video Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-video bg-gray-800 animate-pulse rounded-lg" />)}
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-20 glass-morphism rounded-xl border border-dashed border-gray-700">
           <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
           <p className="text-gray-400 font-cyber">NO INTEL FOUND FOR THIS QUERY</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <CyberCard key={video.id} className="group p-0" glow>
              <div 
                className="relative aspect-video cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <img 
                  src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeUrl.split('v=')[1]}/hqdefault.jpg`} 
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                  <div className="w-12 h-12 rounded-full bg-cyber-blue/90 flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <Play className="w-6 h-6 text-black fill-current translate-x-0.5" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-cyber text-cyber-blue border border-cyber-blue/30 uppercase">
                  {video.category}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-cyber font-bold group-hover:text-cyber-blue transition-colors line-clamp-1">{video.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{video.description}</p>
                <div className="flex items-center gap-4 pt-2 text-[10px] text-gray-500">
                   <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 15 MIN</span>
                   <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> BEGINNER</span>
                </div>
              </div>
            </CyberCard>
          ))}
        </div>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl glass-morphism rounded-2xl overflow-hidden border border-cyber-blue/50"
            >
              <div className="aspect-video w-full">
                <iframe 
                  src={getYoutubeEmbedUrl(selectedVideo.youtubeUrl) + "?autoplay=1"} 
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-cyber text-cyber-blue">{selectedVideo.title}</h2>
                  <CyberButton onClick={() => setSelectedVideo(null)} variant="outline">CLOSE TERMINAL</CyberButton>
                </div>
                <p className="text-gray-300">{selectedVideo.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
