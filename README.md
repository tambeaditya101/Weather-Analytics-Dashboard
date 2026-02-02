# Weather Analytics Dashboard

A comprehensive weather analytics dashboard built with React (Hooks) and Redux Toolkit, featuring real-time weather data, forecasts, interactive charts, and city management.

## Features

### 🌟 Core Features

- **Real-time Weather Data**: Display current weather for multiple cities with automatic refresh every 60 seconds
- **Multi-City Dashboard**: View weather cards for multiple cities simultaneously
- **Detailed City View**: Click any city to see detailed information including:
  - 5-7 day weather forecast
  - Hourly forecast (24 hours)
  - Detailed statistics (pressure, visibility, cloudiness, sunrise/sunset)

### 🔍 Search & Favorites

- **Smart Search**: API-powered autocomplete for city search
- **Favorites Management**: Save favorite cities with localStorage persistence
- **Quick Access**: Favorite cities are automatically displayed on the dashboard

### 📊 Analytics & Charts

- **Temperature Trends**: Line charts showing min, max, and average temperatures
- **Precipitation Analysis**: Bar charts for rainfall and probability
- **Wind Speed Trends**: Track wind patterns over time
- **Humidity Monitoring**: Visualize humidity changes

### ⚙️ Settings & Preferences

- **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit
- **Data Caching**: Intelligent caching reduces API calls (60-second cache duration)
- **Persistent Settings**: User preferences saved to localStorage

### 🎨 User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Intuitive Navigation**: Easy-to-use interface with clear visual hierarchy

## Tech Stack

- **Frontend**: React 18 with Hooks
- **State Management**: Redux Toolkit
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **API**: OpenWeatherMap API
- **Styling**: CSS3 with modern features

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key (get it from https://openweathermap.org/api)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tambeaditya101/Weather-Analytics-Dashboard.git
cd Weather-Analytics-Dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Configure the API key:

- Create a local `.env` file in the project root (do NOT commit this file).
- Add your OpenWeatherMap API key using the Vite prefix `VITE_WEATHER_API_KEY`:

```bash
# .env (example)
VITE_WEATHER_API_KEY=your_actual_openweathermap_api_key_here
```

- Restart the dev server after creating/updating `.env` so Vite picks up the variable.

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
Weather-Analytics-Dashboard/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx       # Header with search and unit toggle
│   │   ├── Header.css       # Header styles
│   │   ├── Dashboard.jsx    # Main dashboard with city cards
│   │   ├── Dashboard.css    # Main dashboard styles
│   │   ├── CityCard.jsx     # Individual city weather card
│   │   ├── CityCard.css     # Individual city weather card styles
│   │   ├── CityDetail.jsx   # Detailed city view
│   │   ├── CityDetail.css   # Detailed city view styles
│   │   └── WeatherCharts.jsx # Charts for weather trends
│   │   └── WeatherCharts.css # Charts for weather trends styles
│   ├── features/            # Redux slices
│   │   ├── weatherSlice.js  # Weather data state management
│   │   └── settingsSlice.js # User settings state management
│   ├── services/            # API services
│   │   └── weatherApi.js    # Weather API integration
│   ├── store/               # Redux store configuration
│   │   └── store.js         # Store setup
│   ├── utils/               # Utility functions
│   │   └── weatherUtils.js  # Weather-related utilities
│   │   └── rateLimiter.js   # rate-limiter logic
│   ├── apiCient.js          # custom api client
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Features in Detail

### Caching Mechanism

The application implements a smart caching system:

- API responses are cached for 60 seconds
- Reduces unnecessary API calls
- Improves performance and respects API rate limits
- Ensures data freshness with automatic refresh

### State Management

Redux Toolkit is used for efficient state management:

- **Weather Slice**: Manages weather data, forecasts, and search results
- **Settings Slice**: Handles user preferences (favorites, temperature unit)
- Persistent state using localStorage

### Responsive Design

The dashboard adapts to different screen sizes:

- Desktop: Multi-column grid layout
- Tablet: Optimized 2-column layout
- Mobile: Single-column layout with touch-friendly controls

## API Integration

The application integrates with OpenWeatherMap API:

- Current Weather Data API
- 5 Day / 3 Hour Forecast API
- Geocoding API for city search

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from OpenWeatherMap
- Built with React and Redux Toolkit
