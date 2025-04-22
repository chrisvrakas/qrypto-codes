# QRYPTO.CODES - Secure Client-Side Encryption Tool

## Overview
QRYPTO.CODES is a modern web application that provides advanced, secure, client-side encryption using state-of-the-art cryptographic techniques to protect your sensitive data.

## Features
- **Strong AES-256-GCM Encryption**: Native browser WebCrypto API with Argon2 key derivation
- **Shamir Secret Sharing (SSS)**: Secret is split into multiple parts for added security and disaster recovery
- **Trick Pin for Plausible Deniability**: Set a decoy password that decrypts to a harmless message if coerced
- **100% Client-Side**: All encryption/decryption happens in your browser; no data sent to any server
- **Easy QR Code Transfer**: Share or scan securely across air-gapped devices
- **Responsive and Fast**: Built with React, TypeScript, TailwindCSS
- **Open Source**: Transparent code, no backdoors

## Advanced Security Techniques

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

## Deployment Options

### Option 1: Deploy to Your Own Domain

1. **Build the project**:
   
```sh
   npm install
   npm run build
   ```

2. **Deploy the `dist` folder to your web server**:
   - For Apache: Copy contents to your web root directory
   - For Nginx: Configure to serve static files from the dist directory
   - For cloud hosting (AWS S3, Netlify, Vercel): Upload the dist folder

3. **Configure your domain**:
   - Point your DNS to your hosting provider
   - If using HTTPS (recommended), set up SSL certificates

### Option 2: Quick Deployment via Netlify/Vercel

1. Connect your GitHub repository to Netlify or Vercel
2. Set the build command to `npm run build`
3. Set the publish directory to `dist`
4. Configure your custom domain in the provider's settings

## Development

```sh
# Clone the repository
git clone <your-repository-url>

# Navigate to project directory
cd QRYPTO.CODES

# Install dependencies
npm install

# Start development server
npm run dev
```

## Security Information

QRYPTO.CODES uses native browser cryptography (WebCrypto API) to implement AES-256-GCM encryption with Argon2 key derivation. All encryption and decryption operations happen entirely in your browser - no data is ever sent to any server.

### Best Practices for Users
- Use strong, unique passwords
- Share passwords through separate secure channels from the QR codes
- For highly sensitive data, consider additional security measures

## License
This project is open source under the [MIT License](LICENSE).

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
