import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { CyberCard, CyberButton } from '../../components/CyberComponents';
import { Video, FileText, CreditCard, Users, Settings, Plus, BarChart3, ChevronRight } from 'lucide-react';
import { AdminVideos } from './AdminVideos';
import { AdminFiles } from './AdminFiles';
import { AdminPayments } from './AdminPayments';
import { AdminUsers } from './AdminUsers';
import { AdminConfig } from './AdminConfig';

export function AdminPanel() {
  const location = useLocation();

  const menuItems = [
    { name: 'Analytics', path: '/admin', icon: BarChart3 },
    { name: 'Tutorials', path: '/admin/videos', icon: Video },
    { name: 'Downloads', path: '/admin/files', icon: FileText },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Agents', path: '/admin/users', icon: Users },
    { name: 'System', path: '/admin/config', icon: Settings },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 space-y-4">
        <div className="px-4 py-2">
           <h2 className="text-2xl font-cyber text-cyber-blue">H4CKER <span className="text-white">ROOT</span></h2>
           <p className="text-[10px] text-gray-500 uppercase tracking-widest">Main Control Center</p>
        </div>
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex-shrink-0">
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-all lg:w-full",
                  isActive 
                    ? "bg-cyber-blue/10 border-cyber-blue text-cyber-blue shadow-[0_0_10px_rgba(0,242,255,0.2)]" 
                    : "bg-white/5 border-transparent text-gray-400 hover:border-gray-700"
                )}>
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span className="text-xs font-cyber hidden lg:inline">{item.name}</span>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 hidden lg:inline", isActive ? "opacity-100" : "opacity-0")} />
                </div>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 space-y-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/videos" element={<AdminVideos />} />
          <Route path="/files" element={<AdminFiles />} />
          <Route path="/payments" element={<AdminPayments />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/config" element={<AdminConfig />} />
        </Routes>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="TOTAL AGENTS" value="1,248" delta="+12%" icon={Users} />
      <StatCard title="REVENUE" value="₹12.4K" delta="+5%" icon={CreditCard} />
      <StatCard title="MODULES" value="48" delta="0%" icon={Video} />
      <StatCard title="TRANSFERS" value="230" delta="+18%" icon={FileText} />
      
      <CyberCard className="md:col-span-2 h-64 flex items-center justify-center">
         <p className="text-gray-500 font-cyber">TRAFFIC_GRAPHS_LOADING...</p>
      </CyberCard>
      <CyberCard className="md:col-span-2 h-64 flex items-center justify-center">
         <p className="text-gray-500 font-cyber">RECENT_ACTIVITY_STREAM...</p>
      </CyberCard>
    </div>
  );
}

function StatCard({ title, value, delta, icon: Icon }: any) {
  return (
    <CyberCard glow className="space-y-4">
       <div className="flex items-center justify-between">
          <div className="p-2 bg-cyber-blue/10 border border-cyber-blue/30 rounded">
             <Icon className="w-4 h-4 text-cyber-blue" />
          </div>
          <span className="text-[10px] text-green-500 font-mono tracking-tighter">{delta}</span>
       </div>
       <div>
          <p className="text-[10px] text-gray-500 font-cyber mb-1 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-cyber text-white">{value}</p>
       </div>
    </CyberCard>
  );
}

import { cn } from '../../lib/utils';
