
import React, { useState, useEffect } from 'react';
import EncryptionForm from '@/components/EncryptionForm';
import QRDisplay from '@/components/QRDisplay';
import DecryptionForm from '@/components/DecryptionForm';
import DecryptedDisplay from '@/components/DecryptedDisplay';
import QRScanner from '@/components/QRScanner';
import { useToast } from '@/components/ui/use-toast';
import { Encryption } from '@/utils/encryption';
import { Copyleft } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [decryptedData, setDecryptedData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const {
    toast
  } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const qrData = urlParams.get('data');
    if (qrData) {
      try {
        const decodedData = decodeURIComponent(qrData);
        processScannedQRData(decodedData);
      } catch (error) {
        console.error("Error processing URL data:", error);
        toast({
          title: "ERROR PROCESSING DATA",
          description: "The data in the URL could not be processed.",
          variant: "destructive"
        });
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const processScannedQRData = (data: string) => {
    try {
      JSON.parse(data);
      setActiveTab('decrypt');
      setEncryptedData(data);
      toast({
        title: "QR CODE DETECTED",
        description: "PLEASE ENTER YOUR PASSWORD TO DECRYPT"
      });
      setTimeout(() => {
        const passwordInput = document.getElementById('decryptPassword');
        if (passwordInput) {
          passwordInput.focus();
        }
      }, 100);
    } catch (error) {
      console.error("Error processing QR data:", error);
      toast({
        title: "INVALID QR CODE",
        description: "THE SCANNED QR CODE IS NOT VALID FOR THIS APP",
        variant: "destructive"
      });
    }
  };

  const handleScanQR = () => {
    setShowScanner(true);
  };

  return <div className="min-h-screen py-12 px-4">
      <header className="mb-12 text-center">
        <div className="inline-block brutalist-box mb-6 py-2 px-6">
          <h1 className="text-3xl uppercase tracking-widest">QRYPTO.CODES</h1>
        </div>
        
        <p className="text-md max-w-2xl mx-auto text-zinc-950">
          TRUST ENCRYPTION LIKE YOU TRUST AMMUNITION.
          <br />
          <span className="text-sm text-gray-700">
            AES-256-GCM (NATIVE) + SHAMIR SECRET SHARING + ARGON2
          </span>
        </p>
      </header>
      
      <div className="max-w-md mx-auto mb-4 flex justify-between">
        <div className="flex border-2 border-black flex-1">
          <button className={`flex-1 py-2 uppercase font-bold ${activeTab === 'encrypt' ? 'bg-black text-white' : 'bg-white'}`} onClick={() => setActiveTab('encrypt')}>
            Encrypt
          </button>
          <button className={`flex-1 py-2 uppercase font-bold ${activeTab === 'decrypt' ? 'bg-black text-white' : 'bg-white'}`} onClick={() => setActiveTab('decrypt')}>
            Decrypt
          </button>
        </div>
        
        <button className="brutalist-button ml-2 flex-none" onClick={handleScanQR}>
          SCAN QR
        </button>
      </div>
      
      <div className="animate-appear" style={{
      animationDelay: '300ms'
    }}>
        {activeTab === 'encrypt' ? <EncryptionForm onEncrypt={setEncryptedData} setLoading={setIsLoading} /> : <DecryptionForm onDecrypted={setDecryptedData} setLoading={setIsLoading} initialData={encryptedData} />}
      </div>
      
      {activeTab === 'encrypt' ? <QRDisplay data={encryptedData} isLoading={isLoading} /> : <DecryptedDisplay data={decryptedData} isLoading={isLoading} />}
      
      {showScanner && <QRScanner onScan={data => {
      setShowScanner(false);
      processScannedQRData(data);
    }} onClose={() => setShowScanner(false)} />}
      
      <footer className="mt-16 text-center text-sm text-gray-600">
        <div className="inline-flex items-center justify-center">
          <Copyleft size={16} className="mr-2" />
          <span>2025 QRYPTO.CODES - OPEN SOURCE (MIT License)</span>
        </div>
        <p className="mt-4 text-xs">
          ENCRYPTION USES AES-256-GCM (NATIVE) WITH ARGON2 KEY DERIVATION
          <br />
          NO DATA IS EVER SENT TO A SERVER - 100% CLIENT SIDE
        </p>
      </footer>
    </div>;
};

export default Index;
