import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CyberCard, CyberButton } from '../components/CyberComponents';
import { CreditCard, Upload, Send, ShieldCheck, AlertCircle, QrCode, Smartphone, Copy, Check } from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { QRCodeSVG } from 'qrcode.react';
import { useSearchParams } from 'react-router-dom';

export function Payment() {
  const { profile, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const targetItem = searchParams.get('item') || 'PREMIUM CLEARANCE';
  const targetPrice = searchParams.get('price') || '499';
  const upiNumber = '7667745113';
  const upiId = '7667745113@ybl'; // Standard PhonePe handle

  useEffect(() => {
    getDoc(doc(db, 'config', 'main')).then(snap => {
      if (snap.exists()) setConfig(snap.data());
    });
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    try {
      setUploading(true);
      
      const storageRef = ref(storage, `payments/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'payments'), {
        userId: user.uid,
        userEmail: user.email,
        item: targetItem,
        amount: targetPrice,
        screenshotUrl: url,
        status: 'pending',
        timestamp: serverTimestamp()
      });

      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  if (profile?.membership === 'premium' && targetItem === 'PREMIUM CLEARANCE') {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500">
           <ShieldCheck className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-cyber uppercase tracking-widest">CLEARANCE VERIFIED</h1>
        <p className="text-gray-400">You already have full access to the DNSDJ CYBER network.</p>
        <CyberButton onClick={() => window.history.back()}>RETURN TO TERMINAL</CyberButton>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-cyber tracking-tighter uppercase">ACCESS <span className="text-cyber-blue">PORTAL</span></h1>
        <p className="text-gray-400">Complete transaction for: <span className="text-white font-cyber">{targetItem}</span></p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Step 1: Payment Details */}
        <CyberCard glow className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-cyber-blue text-black flex items-center justify-center font-cyber font-bold">01</div>
             <h2 className="text-lg font-cyber uppercase">TRANSFER INTEL</h2>
          </div>

          <div className="space-y-4">
             <div className="bg-cyber-black p-4 rounded-lg border border-cyber-blue/20 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-2 font-cyber">SCAN TO PAY</p>
                <div className="bg-white p-2 inline-block rounded-lg mb-4">
                  <QRCodeSVG 
                    value={`upi://pay?pa=${upiId}&pn=DNSDJCYBER&am=${targetPrice}&cu=INR`} 
                    size={160} 
                  />
                </div>
                <div className="space-y-3">
                   <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-gray-500 uppercase font-cyber">UPI NUMBER</p>
                      <div className="flex items-center justify-center gap-2">
                         <span className="font-mono text-xl text-cyber-blue tracking-wider">{upiNumber}</span>
                         <button 
                          onClick={copyToClipboard}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                         >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                         </button>
                      </div>
                   </div>
                   <div className="h-px bg-white/10 w-full" />
                   <p className="text-lg font-cyber flex items-center justify-center gap-2">
                      <span className="text-gray-500 text-sm">TOTAL:</span>
                      <span className="text-white">₹{targetPrice}.00</span>
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
                   <Smartphone className="w-5 h-5 mx-auto mb-2 text-cyber-blue" />
                   <p className="text-[10px] text-gray-400">PHONEPE / GPAY</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
                   <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-cyber-blue" />
                   <p className="text-[10px] text-gray-400">100% SECURE</p>
                </div>
             </div>
          </div>
        </CyberCard>

        {/* Step 2: Upload Proof */}
        <CyberCard glow className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-cyber-blue text-black flex items-center justify-center font-cyber font-bold">02</div>
             <h2 className="text-lg font-cyber">UPLOAD PROOF</h2>
          </div>

          {status === 'success' ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500">
                  <Send className="w-8 h-8 text-green-500" />
               </div>
               <p className="font-cyber text-sm">PROOF SUBMITTED</p>
               <p className="text-xs text-gray-500 px-4">Our high-rank agents will verify your payment within 1-2 hours.</p>
               <CyberButton onClick={() => setStatus('idle')} variant="outline" className="text-[10px]">SUBMIT ANOTHER</CyberButton>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-6">
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                  file ? "border-cyber-blue bg-cyber-blue/5" : "border-gray-700 hover:border-cyber-blue/50"
                )}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  id="file-upload"
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Upload className={cn("w-10 h-10 mx-auto mb-4", file ? "text-cyber-blue" : "text-gray-500")} />
                {file ? (
                  <p className="text-cyber-blue font-cyber text-sm">{file.name}</p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-cyber uppercase tracking-wider">TAP TO UPLOAD</p>
                    <p className="text-[10px] text-gray-500">Take a screenshot of successful payment</p>
                  </div>
                )}
              </div>

              <CyberButton 
                disabled={!file || uploading} 
                className="w-full h-12 gap-2"
                type="submit"
              >
                {uploading ? "TRANSMITTING..." : "SUBMIT FOR APPROVAL"}
              </CyberButton>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-xs">
                   <AlertCircle className="w-4 h-4" />
                   TRANSMISSION FAILED. TRY AGAIN.
                </div>
              )}
            </form>
          )}
        </CyberCard>
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
