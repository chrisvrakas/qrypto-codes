
# CryptoQR Security Documentation

## Cryptographic Overview

CryptoQR implements multiple layers of cryptographic protection to ensure your data remains secure. This document outlines the security measures in place and their implementation details.

## Core Cryptographic Components

### 1. AES-256-GCM Encryption

CryptoQR uses AES-256-GCM (Galois/Counter Mode), a high-security authenticated encryption algorithm:

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

CryptoQR implements a variant of Shamir's Secret Sharing to split the encryption key into multiple shares:

- **Scheme**: (3,2) threshold scheme generating 3 shares, requiring 2 to reconstruct
- **Purpose**: Provides redundancy and an additional layer of security
- **Implementation**: Applied to the derived encryption key after password processing

This approach ensures that even if a portion of the encrypted data is compromised, the full secret remains protected.

### 4. Plausible Deniability with Trick Pin

The optional Trick Pin feature implements a form of plausible deniability:

- **Mechanism**: User can set a secondary "decoy" password
- **Function**: When used for decryption, appears to work but reveals different content
- **Purpose**: Protection against coercion attacks where users might be forced to reveal passwords

## Encryption Process Flow

1. User enters plaintext and a strong password
2. Password is processed through key derivation (Argon2 simulation) with a random salt
3. Derived key is used with AES-256-GCM to encrypt the plaintext
4. A copy of the key is split using Shamir's Secret Sharing into 3 shares (2 needed to reconstruct)
5. Encryption result, salt, IV (initialization vector), and key shares are packaged into a QR code
6. All cryptographic operations occur locally in the browser; no data is sent to any server

## Security Recommendations

- **Password Strength**: Use long, complex passwords with mixed characters
- **Separate Channels**: Share passwords through different communication channels than the encrypted QR codes
- **Device Security**: Ensure your device is free from malware and screen recording software
- **Physical Security**: Be aware of shoulder-surfing and public QR code scanning
- **Updates**: Keep your browser updated to maintain the security of the WebCrypto implementation

## Independent Verification

CryptoQR is open source, allowing security researchers and users to verify its cryptographic implementations. The source code is available for review on GitHub.

## Security Limitations

- **Browser Security**: The security model depends on the integrity of your web browser
- **Side-Channel Attacks**: No protection against hardware-level attacks or compromised devices
- **Memory Exposure**: Unencrypted data must exist briefly in memory during processing
- **Implementation Constraints**: Browser-based cryptography has some inherent limitations compared to native implementations

## Reporting Security Issues

If you discover a security vulnerability in CryptoQR, please report it responsibly by [creating an issue on GitHub](https://github.com/yourusername/cryptoqr/issues) or contacting the maintainers directly.
