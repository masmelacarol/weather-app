const API_KEY = "17c94ac7d6eea2a004934ba9239628fb";

const fetchData = async (city, argWeather, api_key) => {
  const API = `https://api.openweathermap.org/data/2.5/${argWeather}?q=${city}&appid=${api_key}`;
  let response = await new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', API, true);
    xhttp.onreadystatechange = (() => {
      if (xhttp.readyState === 4) {
        (xhttp.status === 200) ?
        resolve(JSON.parse(xhttp.responseText)): reject(new Error('Error', API));
      }
    });
    xhttp.send();
  });
  return response;
}

const getData = async () => {
  let data = await fetchData("Bogota", "weather", API_KEY);
  let forecast = await fetchData("Bogota", "forecast", API_KEY);

  showDataBogota(data);
  showCardForecast(forecast);
}


const showDataBogota = (data) => {
  const bannerDescription = document.querySelector('.banner-description');
  let temperature = new WeatherBogota(data).getTemperature();
  let weather = new WeatherBogota(data).getWeather();
  bannerDescription.innerHTML += `
    <div class="weather">
      <img src="http://openweathermap.org/img/w/${weather[0].icon}.png" />
      <small>${weather[0].main}</small>
    </div>
    <div class="temperature">
      <p>${temperature} <small>°C</small> </p>
    </div>
  `
}

const showCardForecast = (forecast) => {
  let data = new WeatherBogota(forecast).getForecast();
  let today = new Date().getDate();
  let dayOne = data.map(item => new Date(item.dt_txt)).findIndex(item => item.getDate() == today + 1 && item.getHours() == 6);
  let dayTwo = data.map(item => new Date(item.dt_txt)).findIndex(item => item.getDate() == today + 2 && item.getHours() == 6);
  let dayThree = data.map(item => new Date(item.dt_txt)).findIndex(item => item.getDate() == today + 3 && item.getHours() == 6);

  const elementCard = document.querySelector('.main-forecast_content');
  let arrDates = [data[dayOne], data[dayTwo], data[dayThree]]
  console.log("showCardForecast -> arrDates", arrDates)
  arrDates.forEach(date => {
    elementCard.innerHTML +=
      `<div class="card">
        <div class="card-day">
        <img src="http://openweathermap.org/img/w/${date.weather[0].icon}.png" />
          <div class="day">
            <h6>${new Date(date.dt_txt).getDay()}</h6>
            <small>${date.weather[0].main}</small>
          </div>
        </div>
        <div class="card-temperature">
          <p><span class="max">31°</span> / <span class="min"> 23°</span></p>
        </div>
      </div>`
  })



}


getData();
class WeatherBogota {

  constructor(data) {
    this.data = data;
    this.temperature;
    this.weather;
    this.forecast;
  }

  formatTemperature(temperature) {
    return Math.round(temperature - 273.15);
  }

  getTemperature() {
    this.temperature = this.formatTemperature(this.data.main.temp);
    return this.temperature;
  }

  getWeather() {
    this.weather = this.data.weather;
    return this.weather;
  }

  getForecast() {
    this.forecast = this.data.list;
    return this.forecast;
  }
}