
import React, { useState, useEffect } from 'react';
import { Encryption } from '@/utils/encryption';
import { useToast } from '@/components/ui/use-toast';

interface DecryptionFormProps {
  onDecrypted: (text: string) => void;
  setLoading: (loading: boolean) => void;
  initialData?: string;
}

const DecryptionForm: React.FC<DecryptionFormProps> = ({ onDecrypted, setLoading, initialData = '' }) => {
  const [encryptedData, setEncryptedData] = useState('');
  const [password, setPassword] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const { toast } = useToast();
  
  // Set initial data when provided (e.g., from QR scan)
  useEffect(() => {
    if (initialData) {
      setEncryptedData(initialData);
      
      // If we just received data from a scan, focus the password field
      const passwordInput = document.getElementById('decryptPassword');
      if (passwordInput) {
        passwordInput.focus();
      }
    }
  }, [initialData]);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setEncryptedData(content);
    };
    reader.readAsText(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!encryptedData || !password) {
      toast({
        title: "ERROR",
        description: "BOTH ENCRYPTED DATA AND PASSWORD ARE REQUIRED",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Artificial delay to show loading state (remove in production)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Parse the QR data to get encrypted content and shares
      const { encrypted, shares } = Encryption.parseQRData(encryptedData);
      
      // Decrypt the data
      const decrypted = await Encryption.decrypt(encrypted, shares, password);
      
      // Update state with decrypted text
      setDecryptedText(decrypted);
      onDecrypted(decrypted);
      
      toast({
        title: "SUCCESS",
        description: "DATA DECRYPTED SUCCESSFULLY",
      });
    } catch (error) {
      console.error("Decryption error:", error);
      toast({
        title: "DECRYPTION FAILED",
        description: error instanceof Error ? error.message : "AN ERROR OCCURRED DURING DECRYPTION",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="brutalist-box max-w-md mx-auto">
      <h2 className="text-xl mb-4 uppercase tracking-widest">DECRYPT DATA</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="encryptedData">
            ENCRYPTED DATA:
          </label>
          <textarea
            id="encryptedData"
            rows={4}
            className="brutalist-input"
            value={encryptedData}
            onChange={(e) => setEncryptedData(e.target.value)}
            placeholder="PASTE ENCRYPTED JSON DATA HERE..."
          />
          <div className="mt-2">
            <p className="text-xs mb-1">OR UPLOAD ENCRYPTED FILE:</p>
            <input 
              type="file" 
              onChange={handleFileUpload} 
              className="brutalist-input py-1 px-2 text-sm" 
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-bold" htmlFor="decryptPassword">
            DECRYPTION PASSWORD:
          </label>
          <input
            id="decryptPassword"
            type="password"
            className="brutalist-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ENTER YOUR DECRYPTION PASSWORD"
          />
        </div>
        
        <div className="text-center">
          <button type="submit" className="brutalist-button">
            DECRYPT DATA
          </button>
        </div>
      </form>
      
      {decryptedText && (
        <div className="mt-6 p-4 border-2 border-black bg-white">
          <h3 className="font-bold mb-2">DECRYPTED TEXT:</h3>
          <p className="whitespace-pre-wrap break-words">{decryptedText}</p>
        </div>
      )}
    </div>
  );
};

export default DecryptionForm;
