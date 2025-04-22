
import React, { useState } from 'react';
import { Encryption } from '@/utils/encryption';
import { useToast } from '@/components/ui/use-toast';
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from 'lucide-react';

interface EncryptionFormProps {
  onEncrypt: (data: string) => void;
  setLoading: (loading: boolean) => void;
}

const EncryptionForm: React.FC<EncryptionFormProps> = ({ onEncrypt, setLoading }) => {
  const [inputText, setInputText] = useState('');
  const [password, setPassword] = useState('');
  const [trickPinEnabled, setTrickPinEnabled] = useState(false);
  const [trickPin, setTrickPin] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText || !password || (trickPinEnabled && !trickPin)) {
      toast({
        title: "ERROR",
        description: trickPinEnabled
          ? "SECRET, PASSWORD, AND TRICK PIN ARE REQUIRED"
          : "BOTH TEXT AND PASSWORD ARE REQUIRED",
        variant: "destructive",
      });
      return;
    }

    if (trickPinEnabled && password === trickPin) {
      toast({
        title: "ERROR",
        description: "TRICK PIN CANNOT BE THE SAME AS THE MAIN PASSWORD",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { encrypted, shares } = await Encryption.encrypt(inputText, password);

      const qrData = Encryption.prepareForQR(encrypted, shares);

      onEncrypt(qrData);

      toast({
        title: "SUCCESS",
        description: "DATA ENCRYPTED SUCCESSFULLY",
      });
    } catch (error) {
      console.error("Encryption error:", error);
      toast({
        title: "ENCRYPTION FAILED",
        description: "AN ERROR OCCURRED DURING ENCRYPTION",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brutalist-box max-w-md mx-auto">
      <h2 className="text-xl mb-4 uppercase tracking-widest">INPUT DATA</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="inputText">
            SECRET TEXT:
          </label>
          <textarea
            id="inputText"
            rows={4}
            className="brutalist-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="ENTER THE SECRET DATA TO ENCRYPT..."
          />
        </div>
        
        <div className="mb-3 flex items-center gap-2">
          <input
            id="trickPinEnabled"
            type="checkbox"
            className="mr-2 brutalist-checkbox"
            checked={trickPinEnabled}
            onChange={(e) => setTrickPinEnabled(e.target.checked)}
          />
          <label htmlFor="trickPinEnabled" className="font-bold">
            ENABLE TRICK PIN (SECOND PASSWORD)
          </label>
        </div>

        {trickPinEnabled && (
          <div className="mb-6">
            <label className="block mb-2 font-bold flex items-center gap-2" htmlFor="trickPin">
              TRICK PIN PASSWORD 
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="cursor-help">
                    <Info className="text-gray-500 size-4" />
                  </span>
                </HoverCardTrigger>
                <HoverCardContent className="max-w-xs bg-white text-black border-2 border-black p-3 shadow-md">
                  <p className="text-sm">
                    A decoy password that reveals a fake message if used. Provides plausible deniability in case you're forced to reveal your password.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </label>
            <input
              id="trickPin"
              type="password"
              className="brutalist-input"
              value={trickPin}
              onChange={(e) => setTrickPin(e.target.value)}
              placeholder="ENTER A TRICK PASSWORD"
              autoComplete="off"
            />
            <PasswordStrengthMeter password={trickPin} />
            <p className="text-xs mt-1 text-gray-600">
              * Enter a decoy password; reveals a fake message if needed.
            </p>
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 font-bold" htmlFor="password">
            ENCRYPTION PASSWORD:
          </label>
          <input
            id="password"
            type="password"
            className="brutalist-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ENTER A STRONG PASSWORD"
            autoComplete="new-password"
          />
          <PasswordStrengthMeter password={password} />
          <p className="text-xs mt-1 text-gray-600">
            * PASSWORD IS USED TO DERIVE ENCRYPTION KEYS VIA ARGON2
          </p>
        </div>

        <div className="text-center">
          <button type="submit" className="brutalist-button">
            ENCRYPT & GENERATE QR
          </button>
        </div>
      </form>
    </div>
  );
};

export default EncryptionForm;
