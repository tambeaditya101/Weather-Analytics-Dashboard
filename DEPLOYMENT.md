# Deployment Guide

This guide will help you deploy the Weather Analytics Dashboard to various hosting platforms.

## Prerequisites

Before deploying, make sure you have:
1. An OpenWeatherMap API key from https://openweathermap.org/api
2. The application built successfully (`npm run build`)
3. A hosting platform account (Vercel, Netlify, GitHub Pages, etc.)

## Environment Variables

The application requires one environment variable:

```
VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
```

**Important**: Never commit your actual API key to the repository. Use the platform's environment variable settings.

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variable in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `VITE_WEATHER_API_KEY` with your API key

5. Redeploy:
```bash
vercel --prod
```

### Option 2: Netlify

1. Build the project:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

4. Set environment variable in Netlify dashboard:
   - Go to Site settings > Build & deploy > Environment
   - Add `VITE_WEATHER_API_KEY` with your API key

5. Trigger a new deployment from the dashboard

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update vite.config.js to set the base path:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/Weather-Analytics-Dashboard/'
})
```

4. Deploy:
```bash
npm run deploy
```

**Note**: GitHub Pages doesn't support environment variables securely. You'll need to hardcode the API key in the code (not recommended for production) or use a backend proxy.

### Option 4: Docker

1. Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_WEATHER_API_KEY
ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Create a `.dockerignore`:
```
node_modules
dist
.git
.env
```

3. Build the Docker image:
```bash
docker build --build-arg VITE_WEATHER_API_KEY=your_api_key -t weather-dashboard .
```

4. Run the container:
```bash
docker run -p 80:80 weather-dashboard
```

## Production Checklist

Before deploying to production:

- [ ] Obtain a valid OpenWeatherMap API key
- [ ] Set up environment variables on your hosting platform
- [ ] Test the build locally (`npm run build && npm run preview`)
- [ ] Verify all features work correctly
- [ ] Check responsive design on different devices
- [ ] Test API rate limits and caching
- [ ] Set up error monitoring (optional)
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS (most platforms do this automatically)

## API Rate Limits

OpenWeatherMap free tier limits:
- 60 calls/minute
- 1,000,000 calls/month

The application's caching mechanism (60-second cache) helps stay within these limits.

## Troubleshooting

### API calls are failing
- Check if your API key is correctly set in environment variables
- Verify the API key is active on OpenWeatherMap
- Check browser console for CORS errors
- Ensure you're not exceeding rate limits

### Build fails
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version (should be 16+)
- Verify all dependencies are installed

### Environment variables not working
- For Vite, environment variables must start with `VITE_`
- Restart the dev server after changing .env
- For production, set environment variables in your hosting platform

## Performance Optimization

For better performance in production:

1. Enable gzip compression on your server
2. Use a CDN for static assets
3. Implement service workers for offline support (optional)
4. Consider code splitting for larger bundles

## Monitoring

Consider adding monitoring tools:
- Google Analytics for usage tracking
- Sentry for error tracking
- LogRocket for session replay

## Support

For issues or questions:
- Check the README.md for basic setup
- Review OpenWeatherMap API documentation
- Open an issue on GitHub
