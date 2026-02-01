import { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    // Reset after a moment to trigger useEffect
    setTimeout(() => setSelectedCity(null), 100);
  };

  return (
    <div className="App">
      <Header onCitySelect={handleCitySelect} />
      <Dashboard selectedCity={selectedCity} />
    </div>
  );
}

export default App;
