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

## Technical Stack
- React
- TypeScript
- Vite
- TailwindCSS
- WebCrypto API (native browser encryption)
- QR code generation and scanning

## Security Information
QRYPTO.CODES uses native browser cryptography (WebCrypto API) to implement AES-256-GCM encryption with Argon2 key derivation. All encryption and decryption operations happen entirely in your browser - no data is ever sent to any server.

### Best Practices for Users
- Use strong, unique PASS PHRASES (6 words or more with spaces between)
- Share passwords through separate and secure channels 
- For highly sensitive data like private keys, consider additional security measures (ie. airgapped machines, your printer, and surroundings)

## License
This project is open source under the [MIT License](LICENSE).
