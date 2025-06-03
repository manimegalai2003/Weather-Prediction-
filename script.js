
// Weather Dashboard JavaScript
class WeatherDashboard {
  constructor() {
    this.apiKey = ''; // Free tier - users can get their own key
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.currentCity = 'London'; // Default city
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadWeatherData(this.currentCity);
    
    // Auto-refresh every 10 minutes
    setInterval(() => {
      if (this.currentCity) {
        this.loadWeatherData(this.currentCity);
      }
    }, 600000);
  }

  bindEvents() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('cityInput');
    const retryBtn = document.getElementById('retryBtn');

    searchBtn.addEventListener('click', () => this.handleSearch());
    cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    });

    retryBtn.addEventListener('click', () => {
      this.loadWeatherData(this.currentCity);
    });

    // Popular cities
    const cityButtons = document.querySelectorAll('.city-btn');
    cityButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const city = btn.getAttribute('data-city');
        this.loadWeatherData(city);
      });
    });
  }

  handleSearch() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    
    if (city) {
      this.loadWeatherData(city);
      cityInput.value = '';
    }
  }

  async loadWeatherData(city) {
    this.showLoading();
    
    try {
      // For demo purposes, we'll use a mock API or JSONPlaceholder for structure
      // In production, users would need to get their own OpenWeatherMap API key
      const weatherData = await this.fetchWeatherData(city);
      this.displayWeatherData(weatherData);
      this.currentCity = city;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      this.showError(error.message);
    }
  }

  async fetchWeatherData(city) {
    // Since we don't have an API key, we'll simulate the API response
    // In a real implementation, you would use:
    // const url = `${this.baseUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    // const response = await fetch(url);
    
    // For demonstration, we'll create realistic weather data
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate API delay
        const mockData = this.generateMockWeatherData(city);
        
        if (city.toLowerCase() === 'error') {
          reject(new Error('City not found'));
        } else {
          resolve(mockData);
        }
      }, 1000);
    });
  }

  generateMockWeatherData(city) {
    const weatherConditions = [
      { main: 'Clear', description: 'clear sky', icon: '01d' },
      { main: 'Clouds', description: 'few clouds', icon: '02d' },
      { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
      { main: 'Clouds', description: 'broken clouds', icon: '04d' },
      { main: 'Rain', description: 'light rain', icon: '10d' },
      { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
      { main: 'Snow', description: 'light snow', icon: '13d' },
    ];

    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const temperature = Math.floor(Math.random() * 35) + 5; // 5-40°C
    const humidity = Math.floor(Math.random() * 60) + 30; // 30-90%
    const windSpeed = Math.floor(Math.random() * 20) + 1; // 1-20 m/s
    const windDirection = Math.floor(Math.random() * 360); // 0-360°
    const pressure = Math.floor(Math.random() * 100) + 980; // 980-1080 hPa
    const visibility = Math.floor(Math.random() * 10) + 5; // 5-15 km

    return {
      name: city,
      sys: {
        country: this.getCountryCode(city),
        sunrise: Date.now() / 1000 - 3600, // 1 hour ago
        sunset: Date.now() / 1000 + 7200, // 2 hours from now
      },
      main: {
        temp: temperature,
        feels_like: temperature + Math.floor(Math.random() * 6) - 3,
        humidity: humidity,
        pressure: pressure,
      },
      weather: [randomCondition],
      wind: {
        speed: windSpeed,
        deg: windDirection,
        gust: windSpeed + Math.floor(Math.random() * 5),
      },
      visibility: visibility * 1000, // Convert to meters
      dt: Date.now() / 1000,
    };
  }

  getCountryCode(city) {
    const countryCodes = {
      'london': 'GB',
      'new york': 'US',
      'tokyo': 'JP',
      'paris': 'FR',
      'sydney': 'AU',
      'dubai': 'AE',
      'moscow': 'RU',
      'berlin': 'DE',
      'rome': 'IT',
      'madrid': 'ES',
    };
    
    return countryCodes[city.toLowerCase()] || 'XX';
  }

  displayWeatherData(data) {
    this.hideLoading();
    this.hideError();
    this.showWeatherData();

    // Update location
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('country').textContent = data.sys.country;
    
    // Update current weather
    document.getElementById('temperature').textContent = Math.round(data.main.temp);
    document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like);
    document.getElementById('weatherDescription').textContent = data.weather[0].description;
    
    // Update weather icon
    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Update stats
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // Update sun times
    document.getElementById('sunrise').textContent = this.formatTime(data.sys.sunrise);
    document.getElementById('sunset').textContent = this.formatTime(data.sys.sunset);
    
    // Update wind details
    document.getElementById('windSpeedDetail').textContent = `${data.wind.speed} m/s`;
    document.getElementById('windGust').textContent = `${data.wind.gust || data.wind.speed} m/s`;
    document.getElementById('windDirection').textContent = data.wind.deg;
    
    // Update wind arrow
    const windArrow = document.getElementById('windArrow');
    windArrow.style.transform = `rotate(${data.wind.deg}deg)`;
    
    // Update last updated time
    document.getElementById('lastUpdated').textContent = `Last updated: ${this.formatTime(data.dt)}`;
    
    // Update background based on weather
    this.updateBackground(data.weather[0].main);
    
    console.log('Weather data updated:', data);
  }

  formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  updateBackground(weatherCondition) {
    const body = document.body;
    
    // Remove existing weather classes
    body.classList.remove('clear', 'clouds', 'rain', 'thunderstorm', 'snow');
    
    // Add new weather class
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        break;
      case 'clouds':
        body.style.background = 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)';
        break;
      case 'rain':
        body.style.background = 'linear-gradient(135deg, #4B79A1 0%, #283E51 100%)';
        break;
      case 'thunderstorm':
        body.style.background = 'linear-gradient(135deg, #2C3E50 0%, #4A6741 100%)';
        break;
      case 'snow':
        body.style.background = 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)';
        break;
      default:
        body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('weatherData').classList.add('hidden');
  }

  hideLoading() {
    document.getElementById('loading').classList.add('hidden');
  }

  showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('weatherData').classList.add('hidden');
  }

  hideError() {
    document.getElementById('error').classList.add('hidden');
  }

  showWeatherData() {
    document.getElementById('weatherData').classList.remove('hidden');
  }
}

// Additional API Integration Examples
class DataFetcher {
  static async fetchJSONPlaceholderData() {
    try {
      // Example of fetching from JSONPlaceholder API
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const data = await response.json();
      console.log('JSONPlaceholder data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching JSONPlaceholder data:', error);
    }
  }

  static async fetchQuoteAPI() {
    try {
      // Example of fetching from a quote API
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      console.log('Random quote:', data);
      return data;
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  }

  static async fetchNewsAPI() {
    try {
      // Example structure for news API (would need API key)
      // const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
      
      // Mock news data for demonstration
      const mockNews = {
        articles: [
          {
            title: "Sample News Article",
            description: "This is a sample news article description",
            url: "https://example.com",
            publishedAt: new Date().toISOString()
          }
        ]
      };
      
      console.log('News data (mock):', mockNews);
      return mockNews;
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }
}

// Initialize the weather dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new WeatherDashboard();
  
  // Example of fetching additional API data
  DataFetcher.fetchJSONPlaceholderData();
  DataFetcher.fetchQuoteAPI();
  DataFetcher.fetchNewsAPI();
  
  console.log('Weather Dashboard initialized with API integration examples');
});

// Utility functions for DOM manipulation
function updateElementText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
  }
}

function updateElementHTML(elementId, html) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = html;
  }
}

function toggleElementVisibility(elementId, show = true) {
  const element = document.getElementById(elementId);
  if (element) {
    if (show) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }
}

// Example of periodic data fetching
setInterval(() => {
  DataFetcher.fetchQuoteAPI().then(quote => {
    if (quote) {
      console.log(`Daily quote: "${quote.content}" - ${quote.author}`);
    }
  });
}, 300000); // Fetch new quote every 5 minutes

console.log('Weather Dashboard with API Integration loaded successfully!');
