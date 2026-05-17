import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      try {
        setUser(u);
        if (u) {
          const docRef = doc(db, 'users', u.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            const isAdminEmail = u.email === 'sharmanetworking8472@gmail.com' || u.email === 'rr7151230@gmail.com';
            
            if (isAdminEmail && data.role !== 'admin') {
              const updatedProfile = { ...data, role: 'admin', membership: 'premium' };
              await setDoc(docRef, updatedProfile);
              setProfile(updatedProfile);
            } else {
              setProfile(data);
            }
          } else {
            // New user
            const isAdminEmail = u.email === 'sharmanetworking8472@gmail.com' || u.email === 'rr7151230@gmail.com';
            const newProfile = {
              userId: u.uid,
              email: u.email,
              displayName: u.displayName,
              role: isAdminEmail ? 'admin' : 'user',
              membership: isAdminEmail ? 'premium' : 'free',
              downloadHistory: [],
              createdAt: new Date().toISOString()
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Add custom parameters to ensure account selection
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login Error:", error.code, error.message);
      if (error.code === 'auth/popup-blocked') {
        alert("Please allow popups for this site to login, or try again.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  const logout = () => signOut(auth);

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
