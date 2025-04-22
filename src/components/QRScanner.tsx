
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Scanner } from '@yudiel/react-qr-scanner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
      <div className="brutalist-box bg-white w-full max-w-md mx-auto p-4">
        <h2 className="text-xl mb-4 uppercase tracking-widest text-center">QR CODE SCANNER</h2>
        
        <div className="mb-6">
          <Scanner
            onScan={(result) => {
              // Check if result exists and handle properly based on its structure
              if (result && result.length > 0) {
                // Access the rawValue property which should exist on IDetectedBarcode
                // If it doesn't exist, fall back to stringifying the entire result
                const scannedText = result[0].rawValue || JSON.stringify(result[0]);
                onScan(scannedText);
                toast({
                  title: "QR CODE SCANNED",
                  description: "QR CODE DATA DETECTED",
                });
              }
            }}
            onError={(error) => {
              console.error(error);
              toast({
                title: "SCAN ERROR",
                description: "COULD NOT SCAN QR CODE",
                variant: "destructive",
              });
            }}
            scanDelay={500}
            constraints={{ facingMode: 'environment' }}
          />
        </div>
        
        <div className="text-center">
          <button className="brutalist-button" onClick={onClose}>
            CANCEL SCAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
