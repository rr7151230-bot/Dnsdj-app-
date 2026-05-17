import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Videos } from './pages/Videos';
import { Resources } from './pages/Resources';
import { Profile } from './pages/Profile';
import { Payment } from './pages/Payment';
import { AdminPanel } from './pages/Admin/AdminPanel';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-cyber-black text-white selection:bg-cyber-blue selection:text-black">
          {/* Animated Background */}
          <div className="fixed inset-0 opacity-20 pointer-events-none overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.1),transparent_70%)]" />
             <div className="particles absolute inset-0" />
             <div className="matrix-bg absolute inset-0 opacity-10" />
          </div>

          <Navbar />
          
          <main className="pt-20 px-4 max-w-7xl mx-auto pb-20 relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
              <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
            </Routes>
          </main>

          {/* Footer Decoration */}
          <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-30 cyber-glow" />
        </div>
      </Router>
    </AuthProvider>
  );
}
