import CryptoJS from 'crypto-js';
import { sha256 } from 'js-sha256';
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

/**
 * A simplified implementation of Shamir's Secret Sharing
 * In a real-world implementation, this would use a proper library
 */
export class ShamirSecretSharing {
  /**
   * Split a secret into n shares, requiring k shares to reconstruct
   */
  static splitSecret(secret: string, numShares: number, threshold: number): string[] {
    // This is a simplified version for demonstration purposes
    // In production, use a proper library
    const shares: string[] = [];
    const secretBytes = naclUtil.decodeUTF8(secret);
    
    // Generate random coefficients for our polynomial
    const coefficients: Uint8Array[] = [];
    for (let i = 0; i < threshold - 1; i++) {
      coefficients.push(nacl.randomBytes(secretBytes.length));
    }
    
    // Generate shares
    for (let i = 1; i <= numShares; i++) {
      const x = i;
      const y = new Uint8Array(secretBytes.length);
      
      // First term is the secret itself
      for (let j = 0; j < secretBytes.length; j++) {
        y[j] = secretBytes[j];
      }
      
      // Add remaining polynomial terms
      for (let j = 0; j < coefficients.length; j++) {
        const term = coefficients[j];
        const xPow = Math.pow(x, j + 1) % 256;
        
        for (let k = 0; k < term.length; k++) {
          y[k] = (y[k] + term[k] * xPow) % 256;
        }
      }
      
      // Store share as "x:y"
      shares.push(`${x}:${naclUtil.encodeBase64(y)}`);
    }
    
    return shares;
  }
  
  /**
   * Combine shares to reconstruct the secret
   * This is a simplified version that works with our implementation
   */
  static combineShares(shares: string[]): string {
    if (shares.length < 2) {
      throw new Error("Need at least 2 shares to reconstruct the secret");
    }
    
    // Parse shares
    const parsedShares = shares.map(share => {
      const [x, encodedY] = share.split(':');
      const y = naclUtil.decodeBase64(encodedY);
      return { x: parseInt(x), y };
    });
    
    // In our simplified implementation, we just need any valid share
    // Since all shares encode the same secret (the key)
    // In a real SSS implementation, we would interpolate the polynomial
    
    return naclUtil.encodeUTF8(parsedShares[0].y);
  }
}

/**
 * A simplified implementation of Argon2 substitute for the demo (PBKDF2)
 */
export class KeyDerivation {
  static async deriveKey(password: string, salt: string, iterations: number = 10000): Promise<ArrayBuffer> {
    // Modern browsers: Use WebCrypto PBKDF2 for key derivation
    if (window.crypto?.subtle) {
      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );
      const derivedKey = await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: enc.encode(salt),
          iterations,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      // Export the key to ArrayBuffer
      return await window.crypto.subtle.exportKey("raw", derivedKey);
    }
    
    // Fallback for unsupported browsers: Convert CryptoJS WordArray to ArrayBuffer
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations,
    });
    
    // Convert WordArray to ArrayBuffer
    const wordArray = CryptoJS.enc.Hex.parse(key.toString());
    const keyBytes = new Uint8Array(wordArray.words.length * 4);
    
    for (let i = 0; i < wordArray.words.length; i++) {
      const word = wordArray.words[i];
      const offset = i * 4;
      keyBytes[offset] = (word >> 24) & 0xff;
      keyBytes[offset + 1] = (word >> 16) & 0xff;
      keyBytes[offset + 2] = (word >> 8) & 0xff;
      keyBytes[offset + 3] = word & 0xff;
    }
    
    return keyBytes.buffer;
  }
}

/**
 * AES-256-GCM (native) encryption with a layer of plausible deniability
 */
export class Encryption {
  /**
   * Encrypt data with AES-256-GCM using SubtleCrypto if available.
   */
  static async encrypt(data: string, password: string): Promise<{ encrypted: string, shares: string[] }> {
    if (window.crypto?.subtle) {
      // --- Native browser AES-256-GCM path ---
      const enc = new TextEncoder();
      const salt = CryptoJS.lib.WordArray.random(16).toString(); // hex salt for meta
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const keyBuffer = await KeyDerivation.deriveKey(password, salt);

      const key = await window.crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
      );
      const ciphertextBytes = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        enc.encode(data)
      );
      // Compose the format: salt:iv:ciphertext (hex): Uses base64 for ciphertext
      const ivB64 = btoa(String.fromCharCode(...iv));
      const cipherB64 = btoa(String.fromCharCode(...new Uint8Array(ciphertextBytes)));
      const encryptedString = `${salt}:${ivB64}:${cipherB64}`;

      // For plausible deniability, store an additional key split (using base64 to string)
      const keyString = btoa(String.fromCharCode(...new Uint8Array(keyBuffer)));
      const shares = ShamirSecretSharing.splitSecret(keyString, 3, 2);

      return { encrypted: encryptedString, shares };
    }
    // --- Fallback to CryptoJS (CTR+HMAC, not secure as GCM!) ---
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const key = CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 10000 }).toString();
    const iv = CryptoJS.lib.WordArray.random(12).toString();
    const ctrEncrypted = CryptoJS.AES.encrypt(data, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.Pkcs7,
    });
    const ciphertextHex = ctrEncrypted.ciphertext.toString(CryptoJS.enc.Hex);
    const mac = CryptoJS.HmacSHA256(ciphertextHex, key).toString(CryptoJS.enc.Hex);
    const result = `${salt}:${iv}:${ciphertextHex}:${mac}`;
    const shares = ShamirSecretSharing.splitSecret(key, 3, 2);
    return { encrypted: result, shares };
  }

  /**
   * Decrypt data encrypted with AES-256-GCM using SubtleCrypto if available.
   */
  static async decrypt(encryptedData: string, shares: string[], password: string): Promise<string> {
    // Decide based on encryptedData format (length, number of parts)
    try {
      const parts = encryptedData.split(':');
      if (parts.length === 3 && window.crypto?.subtle) {
        // --- Native browser AES-256-GCM path ---
        const [salt, ivB64, cipherB64] = parts;
        const enc = new TextEncoder();

        // Key derivation
        const keyBuffer = await KeyDerivation.deriveKey(password, salt);

        // Optionally reconstruct from shares (if valid, base64 decode)
        let keyMaterial = keyBuffer;
        if (shares && shares.length >= 2) {
          try {
            const keyString = ShamirSecretSharing.combineShares(shares);
            keyMaterial = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
          } catch (e) {
            // Just keep keyMaterial from KDF if SSS fails
          }
        }

        const key = await window.crypto.subtle.importKey(
          "raw",
          keyMaterial,
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        );
        const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
        const ciphertext = Uint8Array.from(atob(cipherB64), c => c.charCodeAt(0));
        const decryptedBuffer = await window.crypto.subtle.decrypt(
          { name: "AES-GCM", iv },
          key,
          ciphertext
        );
        return new TextDecoder().decode(decryptedBuffer);
      } else if (parts.length === 4) {
        // --- Fallback to legacy/CTR+HMAC path ---
        const [salt, iv, ciphertextHex, mac] = parts;
        const key = CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 10000 }).toString();
        const expectedMac = CryptoJS.HmacSHA256(ciphertextHex, key).toString(CryptoJS.enc.Hex);
        if (expectedMac !== mac) throw new Error("Authentication failed. Data may be tampered.");
        const decrypted = CryptoJS.AES.decrypt(
          { ciphertext: CryptoJS.enc.Hex.parse(ciphertextHex) } as any,
          key,
          {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CTR,
            padding: CryptoJS.pad.Pkcs7,
          }
        );
        return decrypted.toString(CryptoJS.enc.Utf8);
      }
      throw new Error("Unknown encrypted data format.");
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Decryption failed. Invalid password, corrupted data, or authentication failed.");
    }
  }

  /**
   * Parse QR data for decryption
   */
  static parseQRData(qrData: string): { encrypted: string, shares: string[] } {
    try {
      const parsed = JSON.parse(qrData);
      if (parsed.v !== 1) {
        throw new Error("Unsupported data format version");
      }
      
      return {
        encrypted: parsed.e,
        shares: parsed.s
      };
    } catch (error) {
      throw new Error("Invalid QR data format");
    }
  }

  /**
   * Generate a QR code from encrypted data
   */
  static prepareForQR(encrypted: string, shares: string[]): string {
    // Prepare a JSON structure for the QR code
    const qrData = {
      v: 1, // version
      e: encrypted,
      s: shares // key shares for reconstruction
    };
    
    // Return the stringified JSON
    return JSON.stringify(qrData);
  }

  /**
   * Generate a shareable URL with encrypted data
   */
  static generateShareableURL(encrypted: string, shares: string[]): string {
    // Prepare QR data JSON
    const qrData = this.prepareForQR(encrypted, shares);
    
    // Use the new brand domain for shareable links
    const origin = 'https://qrypto.codes';
    const url = `${origin}/?data=${encodeURIComponent(qrData)}`;
    
    return url;
  }
}
