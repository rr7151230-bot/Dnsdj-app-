import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CyberCard, CyberButton } from '../../components/CyberComponents';
import { Plus, Trash2, Youtube, Image as ImageIcon, X } from 'lucide-react';

export function AdminVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newVid, setNewVid] = useState({ title: '', description: '', category: 'hacking', youtubeUrl: '', thumbnailUrl: '' });

  useEffect(() => {
    return onSnapshot(query(collection(db, 'videos'), orderBy('createdAt', 'desc')), snap => {
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'videos'), { ...newVid, createdAt: serverTimestamp() });
    setIsAdding(false);
    setNewVid({ title: '', description: '', category: 'hacking', youtubeUrl: '', thumbnailUrl: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('TERMINATE RECORD?')) {
      await deleteDoc(doc(db, 'videos', id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-cyber">VIDEO_CONTENT_MANAGEMENT</h2>
        <CyberButton onClick={() => setIsAdding(true)} className="flex items-center gap-2">
           <Plus className="w-4 h-4" /> ADD_MODULE
        </CyberButton>
      </div>

      {isAdding && (
        <CyberCard glow className="bg-cyber-blue/5 border-cyber-blue/30 relative">
          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input 
               placeholder="MODULE TITLE" 
               className="bg-cyber-black border border-gray-700 rounded p-2 text-sm font-cyber"
               value={newVid.title} onChange={e => setNewVid({...newVid, title: e.target.value})} required
             />
             <input 
               placeholder="CATEGORY (e.g. hacking, tools)" 
               className="bg-cyber-black border border-gray-700 rounded p-2 text-sm font-cyber"
               value={newVid.category} onChange={e => setNewVid({...newVid, category: e.target.value})} required
             />
             <input 
               placeholder="YOUTUBE URL" 
               className="bg-cyber-black border border-gray-700 rounded p-2 text-sm font-cyber md:col-span-2"
               value={newVid.youtubeUrl} onChange={e => setNewVid({...newVid, youtubeUrl: e.target.value})} required
             />
             <textarea 
               placeholder="DESCRIPTION" 
               className="bg-cyber-black border border-gray-700 rounded p-2 text-sm font-cyber h-20 md:col-span-2"
               value={newVid.description} onChange={e => setNewVid({...newVid, description: e.target.value})} required
             />
             <CyberButton type="submit" className="md:col-span-2">UPLINK TO DATABASE</CyberButton>
          </form>
        </CyberCard>
      )}

      <div className="grid gap-4">
        {videos.map(vid => (
          <CyberCard key={vid.id} className="flex flex-col md:flex-row items-center gap-4 py-3">
             <div className="w-24 aspect-video bg-gray-800 rounded overflow-hidden">
                <img src={`https://img.youtube.com/vi/${vid.youtubeUrl.split('v=')[1]}/default.jpg`} className="w-full h-full object-cover" />
             </div>
             <div className="flex-1 space-y-1">
                <p className="font-cyber text-sm">{vid.title.toUpperCase()}</p>
                <p className="text-[10px] text-gray-500">{vid.category.toUpperCase()}</p>
             </div>
             <div className="flex gap-2">
                <CyberButton variant="outline" className="p-2 border-red-500/30 text-red-500 hover:bg-red-500" onClick={() => handleDelete(vid.id)}>
                   <Trash2 className="w-4 h-4" />
                </CyberButton>
             </div>
          </CyberCard>
        ))}
      </div>
    </div>
  );
}
