
# CryptoQR - Secure Client-Side Encryption Tool

## Overview
CryptoQR is a modern web application that provides secure, client-side encryption using AES-256-GCM with Argon2 key derivation. Convert sensitive text into encrypted QR codes that can be scanned and decrypted only by those with the correct password.

## Features
- **Secure Encryption**: AES-256-GCM encryption with Argon2 key derivation
- **100% Client-Side**: All encryption/decryption happens in your browser - no data ever leaves your device
- **QR Code Integration**: Easily share encrypted data via scannable QR codes
- **Responsive Design**: Works on desktop and mobile devices
- **Open Source**: Transparent security you can verify

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
cd cryptoqr

# Install dependencies
npm install

# Start development server
npm run dev
```

## Security Information

CryptoQR uses native browser cryptography (WebCrypto API) to implement AES-256-GCM encryption with Argon2 key derivation. All encryption and decryption operations happen entirely in your browser - no data is ever sent to any server.

### Best Practices for Users
- Use strong, unique passwords
- Share passwords through separate secure channels from the QR codes
- For highly sensitive data, consider additional security measures

## License
This project is open source under the [MIT License](LICENSE).

