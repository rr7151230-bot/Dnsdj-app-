import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CyberCard, CyberButton } from '../../components/CyberComponents';
import { Check, X, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    return onSnapshot(query(collection(db, 'payments'), orderBy('timestamp', 'desc')), snap => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const handleStatus = async (payment: any, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'payments', payment.id), { status: newStatus });
      
      // Upgrade user ONLY if item is Premium Clearance or equivalent
      const isPremiumUpgrade = payment.item === 'PREMIUM CLEARANCE' || !payment.item;
      
      if (newStatus === 'approved' && isPremiumUpgrade) {
        await updateDoc(doc(db, 'users', payment.userId), { membership: 'premium' });
      }
      alert(`TRANSACTION ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-cyber">TRANSACTION_VERIFICATION</h2>
        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/50 rounded flex items-center gap-2">
           <Clock className="w-4 h-4 text-yellow-500" />
           <span className="text-[10px] font-cyber text-yellow-500">{pendingCount} PENDING</span>
        </div>
      </div>

      <div className="grid gap-4">
        {payments.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl">
             <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-2" />
             <p className="text-gray-500 font-cyber uppercase tracking-widest text-xs">NO TRANSACTIONS RECORDED</p>
          </div>
        ) : (
          payments.map(payment => (
            <CyberCard key={payment.id} className={cn(
              "flex flex-col md:flex-row md:items-center justify-between gap-4 py-4",
              payment.status === 'pending' && "border-yellow-500/30"
            )}>
               <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                     <p className="font-cyber text-sm">{payment.userEmail}</p>
                     <span className={cn(
                       "text-[8px] px-1.5 py-0.5 rounded border uppercase",
                       payment.status === 'pending' && "text-yellow-500 border-yellow-500/30",
                       payment.status === 'approved' && "text-green-500 border-green-500/30",
                       payment.status === 'rejected' && "text-red-500 border-red-500/30",
                     )}>
                        {payment.status}
                     </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-[10px] text-gray-500 font-mono">
                     <span className="text-cyber-blue font-cyber">{payment.item || 'PREMIUM CLEARANCE'}</span>
                     <span>ID: {payment.id.slice(0, 8)}</span>
                     <span>AMOUNT: ₹{payment.amount}</span>
                     <span>DATE: {payment.timestamp ? formatDate(payment.timestamp.toDate()) : '...'}</span>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <a 
                    href={payment.screenshotUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-white/5 border border-white/10 rounded hover:bg-cyber-blue/10 hover:border-cyber-blue transition-all"
                  >
                     <ExternalLink className="w-5 h-5 text-gray-400" />
                  </a>

                  {payment.status === 'pending' && (
                    <div className="flex gap-2">
                       <CyberButton 
                         onClick={() => handleStatus(payment, 'approved')} 
                         className="p-2 bg-green-500 hover:bg-green-600 text-black border-none"
                       >
                          <Check className="w-4 h-4" />
                       </CyberButton>
                       <CyberButton 
                         onClick={() => handleStatus(payment, 'rejected')} 
                         className="p-2 bg-red-500 hover:bg-red-600 text-black border-none"
                       >
                          <X className="w-4 h-4" />
                       </CyberButton>
                    </div>
                  )}
               </div>
            </CyberCard>
          ))
        )}
      </div>
    </div>
  );
}

import { cn } from '../../lib/utils';
