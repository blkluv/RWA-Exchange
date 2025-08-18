# OneRWA Marketplace - Deployment Guide

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/oneRwa-Marketplace)

### Manual Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` with your client ID

## Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `.next` folder to Netlify
   - Or connect your GitHub repository
   - Set `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` in environment variables

## Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set environment variables**
   ```bash
   railway variables set NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
   ```

## Environment Variables

Required environment variables for production:

```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
```

Optional environment variables:

```env
# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Custom RPC endpoints
NEXT_PUBLIC_AVALANCHE_RPC=your_avalanche_rpc_url
NEXT_PUBLIC_POLYGON_RPC=your_polygon_rpc_url
```

## Build Configuration

The project includes optimized build configuration:

- **Next.js 14** with App Router
- **Webpack optimizations** for Web3 libraries
- **Bundle analysis** available with `npm run analyze`
- **TypeScript** strict mode enabled

## Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting for wallet connections
- Lazy loading of heavy components
- Optimized bundle size for Web3 dependencies

## Security Considerations

- Environment variables are properly scoped with `NEXT_PUBLIC_`
- No private keys or sensitive data in client-side code
- HTTPS enforced in production
- Content Security Policy headers recommended

## Monitoring

Consider adding these monitoring tools:

- **Sentry** for error tracking
- **Google Analytics** for user analytics
- **Web3 Analytics** for transaction tracking
- **Uptime monitoring** for availability

## Custom Domain

After deployment, you can add a custom domain:

1. **Vercel**: Project Settings → Domains
2. **Netlify**: Site Settings → Domain Management
3. **Railway**: Project Settings → Domains

## Support

For deployment issues:
- Check the [Next.js deployment docs](https://nextjs.org/docs/deployment)
- Review [Thirdweb deployment guide](https://portal.thirdweb.com/deploy)
- Join the [thirdweb Discord](https://discord.gg/thirdweb) for help