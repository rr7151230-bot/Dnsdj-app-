import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CyberCard, CyberButton } from '../../components/CyberComponents';
import { Settings, Save, Smartphone, QrCode, Bell } from 'lucide-react';

export function AdminConfig() {
  const [config, setConfig] = useState<any>({ upiId: '', announcement: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'config', 'main')).then(snap => {
      if (snap.exists()) setConfig(snap.data());
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await setDoc(doc(db, 'config', 'main'), config);
    setSaving(false);
    alert('SYSTEM_PARAMETERS_UPDATED');
  };

  if (loading) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-cyber flex items-center gap-2 uppercase tracking-widest">
         <Settings className="w-6 h-6 text-cyber-blue" />
         CORE_SYSTEM_PARAMS
      </h2>

      <form onSubmit={handleSave} className="space-y-6">
         <CyberCard glow className="space-y-6">
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-cyber text-gray-500 flex items-center gap-2 mb-2">
                     <Smartphone className="w-3 h-3 text-cyber-blue" /> UPI_ID_IDENTIFIER
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-cyber-black border border-gray-700 rounded p-2.5 text-sm font-mono text-cyber-blue"
                    value={config.upiId} 
                    onChange={e => setConfig({...config, upiId: e.target.value})} 
                    placeholder="example@upi"
                  />
               </div>

               <div>
                  <label className="text-[10px] font-cyber text-gray-500 flex items-center gap-2 mb-2">
                     <Bell className="w-3 h-3 text-cyber-blue" /> GLOBAL_ANNOUNCEMENT_BEACON
                  </label>
                  <textarea 
                    className="w-full bg-cyber-black border border-gray-700 rounded p-2.5 text-sm h-24"
                    value={config.announcement} 
                    onChange={e => setConfig({...config, announcement: e.target.value})}
                    placeholder="Broadcast to all agents..."
                  />
               </div>
            </div>

            <CyberButton disabled={saving} type="submit" className="w-full gap-2">
               <Save className="w-4 h-4" />
               {saving ? "REWRITING_SECTORS..." : "COMMIT_CHANGES"}
            </CyberButton>
         </CyberCard>

         <div className="grid grid-cols-2 gap-4">
            <CyberCard className="p-4 text-center opacity-50">
               <p className="text-[8px] font-cyber text-gray-500 mb-1">SYSTEM_Uptime</p>
               <p className="text-lg font-cyber">99.99%</p>
            </CyberCard>
            <CyberCard className="p-4 text-center opacity-50">
               <p className="text-[8px] font-cyber text-gray-500 mb-1">DATA_INTEGRITY</p>
               <p className="text-lg font-cyber text-green-500">VERIFIED</p>
            </CyberCard>
         </div>
      </form>
    </div>
  );
}
