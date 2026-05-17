import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CyberCard, CyberButton } from '../components/CyberComponents';
import { User, Shield, Key, History, CreditCard, LogOut } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { Link } from 'react-router-dom';

export function Profile() {
  const { profile, logout } = useAuth();

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full border-2 border-cyber-blue p-1">
          <div className="w-full h-full rounded-full bg-cyber-blue/10 flex items-center justify-center">
             <User className="w-12 h-12 text-cyber-blue" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-cyber">{profile.displayName?.toUpperCase()}</h1>
          <p className="text-gray-400 font-mono tracking-tight">{profile.email}</p>
          <div className={cn(
             "inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border",
             profile.membership === 'premium' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/50" : "bg-gray-800 text-gray-500 border-gray-700"
          )}>
             {profile.membership} CLEARANCE
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
           {/* Tier Info */}
           <CyberCard glow className="space-y-4">
              <h2 className="text-lg font-cyber flex items-center gap-2">
                 <Shield className="w-5 h-5 text-cyber-blue" />
                 SECURITY STATUS
              </h2>
              <div className="space-y-3">
                 <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-gray-500 uppercase tracking-tighter">Account Type</span>
                    <span className={profile.membership === 'premium' ? 'text-yellow-500' : 'text-gray-300'}>{profile.membership.toUpperCase()}</span>
                 </div>
                 <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-gray-500 uppercase tracking-tighter">Enrolled Since</span>
                    <span className="text-gray-300">{formatDate(profile.createdAt)}</span>
                 </div>
                 <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-gray-500 uppercase tracking-tighter">Role</span>
                    <span className="text-cyan-500 text-xs font-mono">{profile.role.toUpperCase()}</span>
                 </div>
              </div>
              {profile.membership !== 'premium' && (
                <Link to="/payment" className="block">
                  <CyberButton className="w-full">UPGRADE TO PREMIUM</CyberButton>
                </Link>
              )}
           </CyberCard>

           {/* Quick Actions */}
           <div className="grid grid-cols-2 gap-4">
              <CyberCard className="flex flex-col items-center gap-3 p-4 text-center cursor-pointer hover:bg-white/5">
                 <Key className="w-6 h-6 text-cyber-blue" />
                 <span className="text-[10px] font-cyber uppercase">Change Secret</span>
              </CyberCard>
              <CyberCard onClick={logout} className="flex flex-col items-center gap-3 p-4 text-center cursor-pointer hover:bg-red-500/10 border-transparent hover:border-red-500/30">
                 <LogOut className="w-6 h-6 text-red-500" />
                 <span className="text-[10px] font-cyber uppercase text-red-500">Terminate Session</span>
              </CyberCard>
           </div>
        </div>

        <div className="space-y-8">
           {/* History */}
           <CyberCard glow className="h-full space-y-4">
              <h2 className="text-lg font-cyber flex items-center gap-2">
                 <History className="w-5 h-5 text-cyber-blue" />
                 ACTIVITY LOG
              </h2>
              
              <div className="space-y-4">
                {(!profile.downloadHistory || profile.downloadHistory.length === 0) ? (
                   <div className="py-12 text-center text-gray-600 space-y-2">
                      <CreditCard className="w-8 h-8 mx-auto opacity-20" />
                      <p className="text-xs uppercase tracking-widest">No local logs found</p>
                   </div>
                ) : (
                  profile.downloadHistory.map((id: string, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                       <span className="text-xs text-gray-300 font-mono">FILE_GET: {id.slice(0, 10)}...</span>
                       <span className="text-[10px] text-gray-500">SUCCESS</span>
                    </div>
                  ))
                )}
              </div>
           </CyberCard>
        </div>
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
