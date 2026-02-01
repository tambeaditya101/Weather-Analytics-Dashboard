# Quick Start Guide

Get the Weather Analytics Dashboard up and running in 5 minutes!

## Prerequisites

- Node.js 16+ installed ([Download here](https://nodejs.org/))
- A free OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/tambeaditya101/Weather-Analytics-Dashboard.git
cd Weather-Analytics-Dashboard
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including React, Redux Toolkit, Recharts, and more.

### 3. Configure API Key

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder with your API key:

```env
VITE_WEATHER_API_KEY=your_actual_api_key_here
```

**How to get an API key:**
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Navigate to "API keys" in your account
4. Copy your API key
5. Paste it into the `.env` file

### 4. Start the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 5. Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

## What You'll See

Upon loading, the dashboard will:
1. Display weather cards for 6 default cities (New York, London, Tokyo, Paris, Mumbai, Sydney)
2. Show current temperature, weather conditions, humidity, and wind speed
3. Automatically refresh data every 60 seconds

## Using the Dashboard

### Search for Cities
1. Click the search box in the header
2. Type at least 2 characters of a city name
3. Select from the autocomplete results
4. The city will be added to your dashboard

### Add to Favorites
1. Click the star icon (☆) on any city card
2. The city will be saved to your favorites (★)
3. Favorites persist across browser sessions
4. Remove by clicking the filled star

### Switch Temperature Units
1. Click the °C / °F button in the header
2. All temperatures will update instantly
3. Your preference is saved automatically

### View Detailed Weather
1. Click any city card
2. See hourly forecast (next 24 hours)
3. View 7-day forecast
4. Check detailed statistics (pressure, visibility, etc.)
5. Explore interactive charts for trends
6. Click the X button to return to dashboard

## Troubleshooting

### "No cities to display" message
- The API calls might be failing
- Check your `.env` file has the correct API key
- Ensure your API key is activated (may take a few minutes after signup)
- Check browser console for errors (F12)

### Port 5173 already in use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Build fails
```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### API rate limit errors
- Free tier: 60 calls/minute, 1M calls/month
- The app caches data for 60 seconds to minimize calls
- Wait a minute if you hit the limit

## Production Build

To create a production build:

```bash
npm run build
```

The build output will be in the `dist/` folder.

Preview the production build:

```bash
npm run preview
```

## Next Steps

- Read the full [README.md](README.md) for detailed features
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for hosting instructions
- See [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute

## Features Overview

✅ Real-time weather for multiple cities
✅ 5-7 day forecast with hourly breakdowns
✅ Smart search with autocomplete
✅ Favorite cities with persistence
✅ Temperature unit toggle (°C/°F)
✅ Interactive charts (temperature, precipitation, wind)
✅ Automatic data refresh (60s)
✅ Responsive design (mobile, tablet, desktop)
✅ Beautiful gradient UI

## Need Help?

- Check the console for error messages (F12 in browser)
- Verify your API key is correct and active
- Ensure you have a stable internet connection
- Review the full [README.md](README.md) for more details
- Open an issue on GitHub if problems persist

## Default Cities

The dashboard loads these cities by default:
- New York, USA
- London, UK
- Tokyo, Japan
- Paris, France
- Mumbai, India
- Sydney, Australia

You can search and add any city in the world!

---

**Enjoy exploring weather data! 🌤️**
