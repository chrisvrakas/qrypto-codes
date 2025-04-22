# QRYPTO.CODES - Secure Client-Side Encryption Tool

## OVERVIEW
QRYPTO.CODES is a modern web application that provides advanced, secure, client-side encryption using state-of-the-art cryptographic techniques to protect your sensitive data.

## FEATURES
- **Strong AES-256-GCM Encryption**: Native browser WebCrypto API with Argon2 key derivation
- **Shamir Secret Sharing (SSS)**: Secret is split into multiple parts for added security and disaster recovery
- **Trick Pin for Plausible Deniability**: Set a decoy password that decrypts to a harmless message if coerced
- **100% Client-Side**: All encryption/decryption happens in your browser; no data sent to any server
- **Easy QR Code Transfer**: Share or scan securely across air-gapped devices
- **Responsive and Fast**: Built with React, TypeScript, TailwindCSS
- **Open Source**: Transparent code, no backdoors

## ADVANCED SECURITY TECHNIQUES

### Shamir Secret Sharing (SSS)
QRYPTO.CODES implements a sophisticated secret sharing mechanism that splits your encryption key into multiple shares. This provides:
- Enhanced security through key fragmentation
- Disaster recovery options
- Protection against single point of key compromise

### Trick Pin (Plausible Deniability)
- Set a secondary, decoy password
- If forced to reveal your password, use the trick pin
- Decrypts to a harmless, pre-prepared message
- Provides a layer of psychological and practical security

## TECHNICAL STACK
- React
- TypeScript
- Vite
- TailwindCSS
- WebCrypto API (native browser encryption)
- QR code generation and scanning

## SECURITY INFORMATION
QRYPTO.CODES uses native browser cryptography (WebCrypto API) to implement AES-256-GCM encryption with Argon2 key derivation. All encryption and decryption operations happen entirely in your browser - no data is ever sent to any server. This document outlines the security measures in place and their implementation details.

### 1. AES-256-GCM Encryption
QRYPTO.CODES uses AES-256-GCM (Galois/Counter Mode), a high-security authenticated encryption algorithm:
- **Key Size**: 256 bits (maximum security level for AES)
- **Mode of Operation**: GCM (Galois/Counter Mode) providing both confidentiality and authentication
- **Implementation**: Uses the browser's native WebCrypto API when available, falling back to CryptoJS only if necessary
- **Authentication**: Built-in authentication tag prevents tampering with encrypted data

### 2. Argon2 Key Derivation
Passwords are never used directly as encryption keys but instead processed through a key derivation function:
- **Algorithm**: Simulated Argon2 behavior (via PBKDF2 with enhanced iterations in the browser)
- **Parameters**: 
  - Salt: Unique 16-byte random value generated for each encryption
  - Iterations: 10,000+ (adjusts based on device capabilities)
  - Output: 256-bit derived key

The key derivation process significantly increases the computational effort required for brute-force attacks.

### 3. Shamir's Secret Sharing (SSS)
QRYPTO.CODES implements a variant of Shamir's Secret Sharing to split the encryption key into multiple shares:
- **Scheme**: (3,2) threshold scheme generating 3 shares, requiring 2 to reconstruct
- **Purpose**: Provides redundancy and an additional layer of security
- **Implementation**: Applied to the derived encryption key after password processing

This approach ensures that even if a portion of the encrypted data is compromised, the full secret remains protected.

### 4. Plausible Deniability with Trick Pin
The optional Trick Pin feature implements a form of plausible deniability:
- **Mechanism**: User can set a secondary "decoy" password
- **Function**: When used for decryption, appears to work but reveals different content
- **Purpose**: Protection against coercion attacks where users might be forced to reveal passwords

## ENCRYPTION PROCESS
1. User enters plaintext and a strong password
2. Password is processed through key derivation (Argon2 simulation) with a random salt
3. Derived key is used with AES-256-GCM to encrypt the plaintext
4. A copy of the key is split using Shamir's Secret Sharing into 3 shares (2 needed to reconstruct)
5. Encryption result, salt, IV (initialization vector), and key shares are packaged into a QR code
6. All cryptographic operations occur locally in the browser; no data is sent to any server

## SECURITY RECOMMENDATIONS
- **Password Strength**: Use a password manager to ideally generate 6+ word PASSPHRASES (with spaces)
- **Separate Channels**: Share passwords through secure communication channels seperate from the encrypted QR codes
- **Device Security**: Ensure your device (including printer if using) is free from malware, cameras, etc...
- **Physical Security**: Be aware of your surroundings and potential shoulder-sniffers
- **Updates**: Keep your browser updated to maintain security of the WebCrypto implementations above

## INDEPENDENT VERIFICATION
QRYPTO.CODES is open source, allowing security researchers and users to verify its cryptographic implementations. The source code is available for review on GitHub.

## SECURITY LIMITATIONS
- **Browser Security**: The security model depends on the integrity of your web browser
- **Side-Channel Attacks**: No protection against hardware-level attacks or compromised devices
- **Memory Exposure**: Unencrypted data must exist briefly in memory during processing
- **Implementation Constraints**: Browser-based cryptography has some inherent limitations compared to native implementations

## REPORTING SECURITY ISSUES
If you discover a security vulnerability in QRYPTO.CODES, please report it responsibly by [creating an issue on GitHub](https://github.com/yourusername/QRYPTO.CODES/issues) or contacting me directly. My PGP key is in my bio 

## LICENSE
This project is open source under the [MIT License](LICENSE).
