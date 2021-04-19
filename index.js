import {DateTime} from "luxon";
import Table from "./Table.js";
import {OPEN_WEATHER_MAP_API_KEY} from "./credentials.js";

const OPEN_WEATHER_MAP_API_BASE = "https://api.openweathermap.org/data/2.5"

const inputEl = document.getElementById("cityName");
inputEl.onkeypress = displayWeatherForecast;

async function getCurrentWeather(city) {
  const OPEN_WEATHER_MAP_API =
    OPEN_WEATHER_MAP_API_BASE + `/weather?q=${city}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;
  const response = await fetch(OPEN_WEATHER_MAP_API);
  const {coord} = await response.json();
  return coord;
}

async function getWeatherFor8Days({ lat, lon }) {
  const OPEN_WEATHER_MAP_API =
    OPEN_WEATHER_MAP_API_BASE +`/onecall?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;
  const response = await fetch(OPEN_WEATHER_MAP_API);
  const {daily} = await response.json();
  return daily;
}

function generateForecastTable(dailyData) {
  const units = {
    temperature: " °C",
    wind_speed: " m/s",
  };

  const header = ["Data", "Temp. Minimă", "Temp. Maximă", "Viteza vântului"];
  const rows = dailyData.map((dayData) => {
    const date = DateTime.fromSeconds(dayData.dt)
      .setLocale("ro")
      .toLocaleString(DateTime.DATE_MED);

    return [
      date,
      dayData.temp.max + units.temperature,
      dayData.temp.min + units.temperature,
      dayData.wind_speed + units.wind_speed,
    ]
  });

  return new Table({header, rows});
}

async function displayWeatherForecast(event) {
  const code = event.keyCode ? event.keyCode : event.which;
  if (code === 13) {
    const city = event.target.value
    const coords = await getCurrentWeather(city);
    const dailyData = await getWeatherFor8Days(coords);
    const table = generateForecastTable(dailyData);
    const tableEle = document.getElementById("table-container");
    tableEle.innerHTML = table.toHTMLString();
  }
}
