import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CyberCard, CyberButton } from '../../components/CyberComponents';
import { Plus, Trash2, FileText, Package, X } from 'lucide-react';

export function AdminFiles() {
  const [files, setFiles] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newFile, setNewFile] = useState({ title: '', description: '', category: 'tools', fileUrl: '', isPremium: true, type: 'pdf' });

  useEffect(() => {
    return onSnapshot(query(collection(db, 'files'), orderBy('createdAt', 'desc')), snap => {
      setFiles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'files'), { ...newFile, createdAt: serverTimestamp() });
    setIsAdding(false);
    setNewFile({ title: '', description: '', category: 'tools', fileUrl: '', isPremium: true, type: 'pdf' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('WIPE DATA?')) {
      await deleteDoc(doc(db, 'files', id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-cyber">FILE_REPOSITORY_MANAGEMENT</h2>
        <CyberButton onClick={() => setIsAdding(true)} className="flex items-center gap-2">
           <Plus className="w-4 h-4" /> UPLOAD_INTEL
        </CyberButton>
      </div>

      {isAdding && (
        <CyberCard glow className="bg-cyber-blue/5 border-cyber-blue/30 relative">
          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input placeholder="FILE TITLE" className="bg-cyber-black border border-gray-700 rounded p-2 text-sm font-cyber" value={newFile.title} onChange={e => setNewFile({...newFile, title: e.target.value})} required />
             <select className="bg-cyber-black border border-gray-700 rounded p-2 text-sm font-cyber" value={newFile.type} onChange={e => setNewFile({...newFile, type: e.target.value})}>
                <option value="pdf">PDF_REPORT</option>
                <option value="zip">ZIP_ARCHIVE</option>
                <option value="notes">FIELD_NOTES</option>
             </select>
             <input placeholder="FILE URL (e.g. GDrive/Mega link)" className="bg-cyber-black border border-gray-700 rounded p-2 text-sm font-cyber md:col-span-2" value={newFile.fileUrl} onChange={e => setNewFile({...newFile, fileUrl: e.target.value})} required />
             <div className="flex items-center gap-2 md:col-span-2">
                <input type="checkbox" checked={newFile.isPremium} onChange={e => setNewFile({...newFile, isPremium: e.target.checked})} />
                <span className="text-[10px] font-cyber">PREMIUM_ENCRYPTION_OVERRIDE</span>
             </div>
             <textarea placeholder="DESCRIPTION" className="bg-cyber-black border border-gray-700 rounded p-2 text-sm font-cyber h-20 md:col-span-2" value={newFile.description} onChange={e => setNewFile({...newFile, description: e.target.value})} required />
             <CyberButton type="submit" className="md:col-span-2">ARCHIVE TO NETWORK</CyberButton>
          </form>
        </CyberCard>
      )}

      <div className="grid gap-4">
        {files.map(file => (
          <CyberCard key={file.id} className="flex items-center justify-between py-3">
             <div className="flex items-center gap-4">
                <div className="p-2 mr-2 bg-cyber-blue/10 rounded">
                   {file.type === 'pdf' ? <FileText className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                </div>
                <div>
                   <p className="font-cyber text-sm">{file.title.toUpperCase()}</p>
                   <p className="text-[10px] text-gray-500 uppercase">{file.type} • {file.isPremium ? 'PREMIUM' : 'FREE'}</p>
                </div>
             </div>
             <CyberButton variant="outline" className="p-2 border-red-500/30 text-red-500 hover:bg-red-500" onClick={() => handleDelete(file.id)}>
                <Trash2 className="w-4 h-4" />
             </CyberButton>
          </CyberCard>
        ))}
      </div>
    </div>
  );
}
