const API_KEY = '17c94ac7d6eea2a004934ba9239628fb';

class WeatherData {
  constructor() {
    this.temperature;
    this.weather;
    this.forecast;
  }

  formatTemperature(temperature) {
    return Math.round(temperature - 273.15);
  }

  getTemperature(temp) {
    this.temperature = temp.main;
    return this.temperature;
  }

  getWeather(weather) {
    this.weather = weather.weather;
    return this.weather;
  }

  getForecast(forest) {
    this.forecast = forest;
    return this.forecast;
  }

  getDate() {
    let today = new Date().getDate();
    let forestList = this.forecast.list;
    let dates = forestList.map((item) => new Date(item.dt_txt));
    let dayOne = dates.findIndex((item) => item.getDate() == today + 1 && item.getHours() == 6);
    let dayTwo = dates.findIndex((item) => item.getDate() == today + 2 && item.getHours() == 6);
    let dayThree = dates.findIndex((item) => item.getDate() == today + 3 && item.getHours() == 6);

    return [forestList[dayOne], forestList[dayTwo], forestList[dayThree]];
  }

  formattedDate(date) {
    let formattedDate = '';
    switch (date) {
      case 1:
        formattedDate = 'Monday';
        break;
      case 2:
        formattedDate = 'Tuesday';
        break;
      case 3:
        formattedDate = 'Wednesday';
        break;
      case 4:
        formattedDate = 'Thursday';
        break;
      case 5:
        formattedDate = 'Friday';
        break;
      case 6:
        formattedDate = 'Saturday';
        break;
      case 7:
        formattedDate = 'Sunday';
        break;

      default:
        break;
    }
    return formattedDate;
  }

  /* Función que hace el llamado asincrono al API*/
  async fetchData(city, argWeather, api_key) {
    const API = `https://api.openweathermap.org/data/2.5/${argWeather}?q=${city}&appid=${api_key}`;
    let response = await new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest();
      xhttp.open('GET', API, true);
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
          xhttp.status === 200 ? resolve(JSON.parse(xhttp.responseText)) : reject(new Error('Error', API));
        }
      };
      xhttp.send();
    });
    return response;
  }

  getWeatherData(data) {
    let main = this.getTemperature(data);
    let weather = {
      name: data.name,
      country: data.sys.country,
      clime: this.getWeather(data)[0].main,
      icon: this.getWeather(data)[0].icon,
      temperature: this.formatTemperature(main.temp),
      humidity: main.humidity,
      wind: data.wind.speed,
      day: this.formattedDate(new Date(data.dt_txt).getDay()),
      temperatureMax: this.formatTemperature(main.temp_max),
      temperatureMin: this.formatTemperature(main.temp_min),
    };
    return weather;
  }

  showWeatherBogota(data) {
    const bannerDescription = document.querySelector('.banner-description');
    let main = this.getWeatherData(data);
    bannerDescription.innerHTML += `
      <div class="weather">
        <img src="http://openweathermap.org/img/w/${main.icon}.png" />
        <small>${main.clime}</small>
      </div>
      <div class="temperature">
        <p>${main.temperature} <small>°C</small> </p>
      </div>
    `;
  }

  showWeatherParis(data) {
    const mainCard = document.querySelector('.main-card');
    const weather = this.getWeatherData(data);
    mainCard.innerHTML += `<div class="card-container">
      <div class="card-head">
        <figure>
          <img src="http://openweathermap.org/img/w/${weather.icon}.png" />
        </figure>
        <div class="temperature">
          <p class="temp">${weather.temperature} <small>°C</small> </p>
        </div>
        <div class="location">
          <p class="city">${weather.name}
            <small class="country">${weather.country}</small>
          </p>
        </div>
      </div>
      <div class="card-content">
        <div class="humidity">
          <p>Humidity: <span>${weather.humidity}%</span></p>
        </div>
        <div class="cardinal">
          <p>West</p>
        </div>
        <div class="velocity">
          <p>${weather.wind}km/h</p>
        </div>
      </div>
    </div>`;
  }

  showCardForecastBogota(forecast) {
    this.forecast = this.getForecast(forecast);
    let arrDates = this.getDate();
    const elementCard = document.querySelector('.main-forecast_content');
    arrDates.forEach((date) => {
      let weather = this.getWeatherData(date);
      elementCard.innerHTML += `<div class="card">
        <div class="card-day">
        <img src="http://openweathermap.org/img/w/${weather.icon}.png" />
          <div class="day">
            <h6>${weather.day}</h6>
            <small>${weather.clime}</small>
          </div>
        </div>
        <div class="card-temperature">
          <p>
            <span class="max">${weather.temperatureMax}°</span> 
            / 
            <span class="min"> ${weather.temperatureMax}°</span></p>
        </div>
      </div>`;
    });
  }

  async getData() {
    let weatherBogota = await this.fetchData('Bogota', 'weather', API_KEY);
    let forecast = await this.fetchData('Bogota', 'forecast', API_KEY);
    let weatherParis = await this.fetchData('Paris', 'weather', API_KEY);

    this.showWeatherBogota(weatherBogota);
    this.showCardForecastBogota(forecast);
    this.showWeatherParis(weatherParis);
  }
}

const weather = new WeatherData();
weather.getData();
