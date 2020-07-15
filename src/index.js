const API_KEY = '17c94ac7d6eea2a004934ba9239628fb';

class WeatherData {
  constructor() {
    this.temperature;
    this.weather;
    this.forecast;
    this.fetchData = this.fetchData.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.showWeatherGeneric = this.showWeatherGeneric.bind(this);
  }

  getTemperature(temperature) {
    this.temperature = temperature.main;
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

  /**
   * Función encargada de pasar la temperatura de Kelvin a Celsius
   * @param {float} temperature
   * @returns temperature // Temperatura en Celsius
   * @memberof WeatherData
   */
  formatTemperature(temperature) {
    return Math.round(temperature - 273.15);
  }


  /**
   *Función para obterner los datos clima de los próximos tres días.
   * @memberof WeatherData
   */
  getDate() {
    let today = new Date().getDate();
    let forestList = this.forecast.list;
    let dates = forestList.map((item) => new Date(item.dt_txt));
    let dayOne = dates.findIndex((item) => item.getDate() == today + 1 && item.getHours() == 6);
    let dayTwo = dates.findIndex((item) => item.getDate() == today + 2 && item.getHours() == 6);
    let dayThree = dates.findIndex((item) => item.getDate() == today + 3 && item.getHours() == 6);
    return [forestList[dayOne], forestList[dayTwo], forestList[dayThree]];
  }

  /**
   * Función encargada de formatear la fecha donde le llega un número y 
   * lo convierte en un dia de la semana   *
   * @param {*} date // dia de un fecha en valor númerico
   * @returns formattedDate // día de una fecha en String
   * @memberof WeatherData
   */
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
        'NA'
        break;
    }
    return formattedDate;
  }


  /**
   * Función que hace el llamado asincrono al API dependiendo de los argumentos que reciba
   * @param {string} city //Trae la ciudad requerida
   * @param {string} argWeather 
   * argWeather: Se pueden utlizar dos: weather / forescast
   * weather: trae los datos del día actual -- forescast: trae el pronostico de lso días siguientes
   * @param {number} api_key valor que pide el API para realizar el llamado
   * @returns response // Promesa con los datos del API según los argumentos
   * @memberof WeatherData
   */
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

  /**
   * Función encargada de obtener todos los datos que se utilizan en la aplicación para 
   * ser mostrados luego
   * @param {object} data // Valores asincriconos del API
   * @returns weather // Retorna todos los datos obtenidos y generalizados del API
   * @memberof WeatherData
   */

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
      cardinal: data.coord,
    };
    return weather;
  }

  /**
   * Función encargada de mostrar los datos de clima en Bogota en el banner superior la maqueta.
   * @param {object} data // Valores asincriconos del API
   * @memberof WeatherData
   */
  showWeatherBogota(data) {
    const bannerHead = document.querySelector('.banner-head');
    const bannerDescription = document.querySelector('.banner-description');
    let main = this.getWeatherData(data);
    bannerHead.innerHTML += `<h2><img src="../src/images/icon-location.png" alt="icon location" />${main.name}</h2>`
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

  /**
   * Función encargada de mostrar los datos de clima en Paris en una ficha de la parte derecha
   * @param {object} data // Valores asincriconos del API 
   * @memberof WeatherData
   */

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
          <p>${weather.cardinal.lat}° ${weather.cardinal.lon}°</p>
        </div>
        <div class="velocity">
          <p>${weather.wind}km/h</p>
        </div>
      </div>
    </div>`;
  }

  /**
   * Función encargada de mostrar los datos de clima en Singapore en una ficha de la parte derecha
   * @param {object} data // Valores asincriconos del API
   * @memberof WeatherData
   */

  showWeatherGeneric(data) {
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
          <p>${weather.cardinal.lat}° ${weather.cardinal.lon}°</p>
        </div>
        <div class="velocity">
          <p>${weather.wind}km/h</p>
        </div>
      </div>
    </div>`;
  }

  /**
   * Función encargada de mostrar los datos de clima en Paris en una ficha de la parte derecha
   * @param {object} forecast // Valores asincriconos del API
   * @memberof WeatherData
   */

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



  /**
   * Funcíon encargada de llamar a la función @fetchData y enviar el datos a las respetivas 
   * funciones que muestran los datos en el HTML
   * @memberof WeatherData
   */
  async getData() {
    let city = 'Bogota';
    let weatherBogota = await this.fetchData(city, 'weather', API_KEY);
    let forecast = await this.fetchData(city, 'forecast', API_KEY);
    let weatherParis = await this.fetchData('Paris', 'weather', API_KEY);
    let weatherSingapur = await this.fetchData('Singapur', 'weather', API_KEY);

    this.showWeatherBogota(weatherBogota);
    this.showCardForecastBogota(forecast);
    this.showWeatherParis(weatherParis);
    this.showWeatherGeneric(weatherSingapur);
  }

  /**
   * Función encargada de llamar a la función @fetchData y enviar el datos a las respetivas
   * funciones que muestran los datos en el HTML dependiendo la ciudad que se digite
   * @param {*} city
   * @memberof WeatherData
   */
  async getLocation(city) {
    try {
      let weather = await this.fetchData(city, 'weather', API_KEY);
      this.showWeatherGeneric(weather);
    } catch (error) {
      console.log(error.message);
    }
  }


  async addLocation(e) {
    console.log("WeatherData -> addLocation -> e", e)
    let target = e.target.classList.value;
    let city = prompt('What country do you want to consult?');
    let cityFormatted = city.charAt(0).toUpperCase() + city.slice(1);
    this.getLocation(cityFormatted);
  }
}

const btnAdd = document.querySelector('button.add-location');
const weather = new WeatherData();
weather.getData();
btnAdd.addEventListener('click', (e) => weather.addLocation(e));