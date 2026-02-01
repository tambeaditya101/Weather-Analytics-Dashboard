import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDate, celsiusToFahrenheit } from '../utils/weatherUtils';
import './WeatherCharts.css';

const WeatherCharts = ({ forecast, temperatureUnit }) => {
  const temperatureData = forecast.daily.map(day => ({
    date: formatDate(day.dt),
    max: temperatureUnit === 'fahrenheit' ? celsiusToFahrenheit(day.temp_max) : day.temp_max,
    min: temperatureUnit === 'fahrenheit' ? celsiusToFahrenheit(day.temp_min) : day.temp_min,
    avg: temperatureUnit === 'fahrenheit' ? celsiusToFahrenheit(day.temp_avg) : day.temp_avg,
  }));

  const precipitationData = forecast.daily.map(day => ({
    date: formatDate(day.dt),
    rain: day.rain,
    probability: day.pop * 100,
  }));

  const windData = forecast.daily.map(day => ({
    date: formatDate(day.dt),
    speed: day.wind_speed,
  }));

  const humidityData = forecast.daily.map(day => ({
    date: formatDate(day.dt),
    humidity: day.humidity,
  }));

  return (
    <div className="weather-charts">
      <div className="chart-container">
        <h3>Temperature Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={temperatureData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: `Temperature (°${temperatureUnit === 'celsius' ? 'C' : 'F'})`, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="max" stroke="#d32f2f" name="Max" strokeWidth={2} />
            <Line type="monotone" dataKey="avg" stroke="#667eea" name="Avg" strokeWidth={2} />
            <Line type="monotone" dataKey="min" stroke="#1976d2" name="Min" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Precipitation & Probability</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={precipitationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" label={{ value: 'Rain (mm)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Probability (%)', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="rain" fill="#1976d2" name="Rainfall (mm)" />
            <Bar yAxisId="right" dataKey="probability" fill="#667eea" name="Probability (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Wind Speed Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={windData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Wind Speed (m/s)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="speed" stroke="#764ba2" name="Wind Speed" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Humidity Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={humidityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="humidity" stroke="#00acc1" name="Humidity" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherCharts;
