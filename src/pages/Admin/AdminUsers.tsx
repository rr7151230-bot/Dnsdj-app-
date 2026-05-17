import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CyberCard, CyberButton } from '../../components/CyberComponents';
import { User, Shield, Search } from 'lucide-react';

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    return onSnapshot(collection(db, 'users'), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const toggleRole = async (user: any) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (confirm(`PROMOTE/DEMOTE AGENT TO ${newRole.toUpperCase()}?`)) {
      await updateDoc(doc(db, 'users', user.id), { role: newRole });
    }
  };

  const setTier = async (user: any, tier: string) => {
    await updateDoc(doc(db, 'users', user.id), { membership: tier });
  };

  const filtered = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-cyber uppercase tracking-widest">AGENT_DATABASE</h2>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
           <input 
             type="text" 
             placeholder="FILTER AGENTS..." 
             className="w-full bg-cyber-black border border-gray-700 rounded py-1.5 pl-8 pr-4 text-xs font-mono outline-none focus:border-cyber-blue"
             value={search} onChange={e => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(u => (
          <CyberCard key={u.id} className="py-3 px-4">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className={cn(
                     "w-10 h-10 rounded-full flex items-center justify-center border",
                     u.role === 'admin' ? "border-cyber-blue bg-cyber-blue/5" : "border-gray-700"
                   )}>
                      {u.role === 'admin' ? <Shield className="w-5 h-5 text-cyber-blue" /> : <User className="w-5 h-5 text-gray-500" />}
                   </div>
                   <div>
                      <p className="font-cyber text-sm tracking-tight">{u.displayName || 'NO_NAME'}</p>
                      <p className="font-mono text-[10px] text-gray-500">{u.email}</p>
                   </div>
                </div>

                <div className="flex items-center gap-2">
                   <select 
                     className="bg-cyber-black border border-gray-700 rounded px-2 py-1 text-[10px] font-cyber outline-none"
                     value={u.membership}
                     onChange={(e) => setTier(u, e.target.value)}
                   >
                     <option value="free">FREE_CLEARANCE</option>
                     <option value="premium">LEVEL_2_ACCESS</option>
                   </select>

                   <CyberButton 
                     variant="outline" 
                     className={cn("text-[10px] py-1 border-transparent", u.role === 'admin' ? "text-cyber-blue" : "text-gray-500")}
                     onClick={() => toggleRole(u)}
                   >
                      {u.role === 'admin' ? 'ROOT' : 'USER'}
                   </CyberButton>
                </div>
             </div>
          </CyberCard>
        ))}
      </div>
    </div>
  );
}

import { cn } from '../../lib/utils';
