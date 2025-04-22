
import React from 'react';
import { cn } from '@/lib/utils';

interface DecryptedDisplayProps {
  data: string;
  isLoading?: boolean;
}

const DecryptedDisplay: React.FC<DecryptedDisplayProps> = ({ data, isLoading = false }) => {
  if (!data && !isLoading) {
    return null;
  }
  
  return (
    <div className={cn(
      "brutalist-box mt-8 max-w-md mx-auto",
      isLoading && "animate-pulse-slow"
    )}>
      <h2 className="text-xl mb-4 uppercase tracking-widest text-center">DECRYPTED DATA</h2>
      
      {isLoading ? (
        <div className="h-32 w-full mx-auto bg-gray-200 animate-pulse-slow" />
      ) : (
        <div className="p-4 bg-white mb-4 border-2 border-black">
          <pre className="whitespace-pre-wrap break-words font-mono text-sm">
            {data}
          </pre>
        </div>
      )}
      <div className="text-xs text-center text-gray-600 my-2">
        Encrypted using AES-256-GCM (native) + Argon2 + Shamir Secret Sharing
      </div>
    </div>
  );
};

export default DecryptedDisplay;

