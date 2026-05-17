import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { CyberCard, CyberButton } from '../components/CyberComponents';
import { Lock, Download, FileText, Package, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface File {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  isPremium: boolean;
  type: string;
  createdAt: string;
}

export function Resources() {
  const { profile } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'files'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as File)));
      setLoading(false);
    });
  }, []);

  const isPremium = profile?.membership === 'premium';

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-cyber tracking-tighter">PREMIUM <span className="text-cyber-blue">RESOURCES</span></h1>
        <p className="text-gray-400">Encrypted tools and sensitive field notes.</p>
      </header>

      {!isPremium && (
        <CyberCard glow className="bg-yellow-500/10 border-yellow-500/30 flex flex-col md:flex-row items-center gap-6">
           <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-yellow-500" />
           </div>
           <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-xl font-cyber text-yellow-500">LEVEL 2 ACCESS REQUIRED</h2>
              <p className="text-sm text-gray-300">You are currently on standard clearance. Upgrade to PREMIUM to unlock all files, tools, and notes.</p>
           </div>
           <Link to="/payment">
             <CyberButton className="bg-yellow-500 text-black border-none hover:bg-yellow-600">UPGRADE NOW</CyberButton>
           </Link>
        </CyberCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-48 bg-gray-800 animate-pulse rounded-xl" />)
        ) : (
          files.map((file) => (
            <CyberCard key={file.id} className="relative group overflow-hidden">
               {/* Background Icon */}
               <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  {file.type === 'pdf' ? <FileText size={120} /> : <Package size={120} />}
               </div>

               <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                     <div className={cn(
                       "p-2 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue",
                       !isPremium && file.isPremium && "text-yellow-500 border-yellow-500/30 bg-yellow-500/10"
                     )}>
                        {file.type === 'pdf' ? <FileText className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                     </div>
                     {file.isPremium && (
                       <span className={cn(
                         "text-[10px] font-cyber px-2 py-0.5 rounded border",
                         isPremium ? "text-green-500 border-green-500/30" : "text-yellow-500 border-yellow-500/30"
                       )}>
                         {isPremium ? 'UNLOCKED' : 'PREMIUM'}
                       </span>
                     )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-cyber font-bold tracking-tight">{file.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{file.description}</p>
                  </div>

                  <div className="pt-2">
                    {file.isPremium && !isPremium ? (
                      <Link to="/payment">
                        <CyberButton variant="outline" className="w-full text-[10px] border-yellow-500/50 text-yellow-500 hover:bg-yellow-500">
                           UNLOCK ACCESS
                        </CyberButton>
                      </Link>
                    ) : (
                      <CyberButton 
                        onClick={() => window.open(file.fileUrl, '_blank')}
                        className="w-full text-xs gap-2"
                      >
                         <Download className="w-4 h-4" /> DOWNLOAD FILE
                      </CyberButton>
                    )}
                  </div>
               </div>
            </CyberCard>
          ))
        )}
      </div>

      {files.length === 0 && !loading && (
        <div className="text-center py-20 space-y-4">
           <AlertCircle className="w-12 h-12 text-gray-600 mx-auto" />
           <p className="text-gray-500 font-cyber">NO FILES IN CURRENT DIRECTORY</p>
        </div>
      )}
    </div>
  );
}

import { cn } from '../lib/utils';
