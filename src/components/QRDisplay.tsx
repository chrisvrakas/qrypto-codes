
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';
import { Encryption } from '@/utils/encryption';

interface QRDisplayProps {
  data: string;
  isLoading?: boolean;
}

const QRDisplay: React.FC<QRDisplayProps> = ({ data, isLoading = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shareableUrl, setShareableUrl] = useState<string>('');
  
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => setIsVisible(true), 300);
      
      // Generate shareable URL
      try {
        const parsed = JSON.parse(data);
        setShareableUrl(Encryption.generateShareableURL(parsed.e, parsed.s));
      } catch (e) {
        console.error("Error parsing QR data for URL", e);
      }
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setShareableUrl('');
    }
  }, [data]);
  
  if (!data && !isLoading) {
    return null;
  }
  
  return (
    <div className={cn(
      "brutalist-box mt-8 max-w-md mx-auto transition-all duration-500 overflow-hidden",
      isVisible ? "opacity-100 h-auto" : "opacity-0 h-0",
      isLoading && "animate-pulse-slow"
    )}>
      <h2 className="text-xl mb-4 uppercase tracking-widest text-center">ENCRYPTED QR CODE</h2>
      
      {isLoading ? (
        <div className="h-64 w-64 mx-auto bg-gray-200 animate-pulse-slow" />
      ) : (
        <>
          <div className="p-4 bg-white mb-4 border-2 border-black mx-auto w-fit">
            <QRCodeSVG 
              value={shareableUrl || data} 
              size={256} 
              level="H"
              className="mx-auto"
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>
          
          <div className="text-sm font-bold mb-4 px-2 text-[#C6192F]">
            <p className="mb-2">✓ AES-256-GCM (NATIVE) ENCRYPTION</p>
            <p className="mb-2">✓ ARGON2 KEY DERIVATION</p>
            <p>✓ SHAMIR SECRET SHARING (3,2)</p>
          </div>
          
          {shareableUrl && (
            <div className="mb-4 text-center">
              <p className="text-sm mb-2">OR SHARE THIS LINK:</p>
              <div className="bg-[#E6E2D3] p-2 text-xs break-all border border-black">
                {shareableUrl}
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-center space-x-2">
            <button 
              onClick={() => {
                const blob = new Blob([data], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'encrypted-data.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="brutalist-button text-sm"
            >
              DOWNLOAD DATA
            </button>
            
            {shareableUrl && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shareableUrl);
                  alert('Link copied to clipboard!');
                }}
                className="brutalist-button text-sm"
              >
                COPY LINK
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QRDisplay;
