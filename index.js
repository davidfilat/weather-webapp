import { DateTime } from 'luxon';
import { Table } from './Table.js';

let inputEl = document.querySelectorAll('input');
inputEl.forEach((node) => (node.onchange = getCurrentWeather));

async function getCurrentWeather(event) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/weather?q=${event.srcElement.value}` +
    `&appid=***REMOVED***&units=metric&lang=ro`;
  const response = await fetch(OPEN_WEATHER_MAP_API);
  const data = await response.json();
  return data.coord;
}

async function getWeatherFor8Days({ lat, lon }) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}` +
    `&appid=***REMOVED***&units=metric&lang=ro`;
  const response = await fetch(OPEN_WEATHER_MAP_API);
  const data = await response.json();
  return data.daily;
}

function generateForecastTable(dailyData) {
  const units = {
    temperature: ' °C',
    wind_speed: ' m/s',
  };
  const header = [
    'Data',
    'Temperatura Minimă',
    'Temperatura Maximă',
    'Viteza vântului',
  ];
  const table = new Table({ header });
  dailyData.forEach((dayData) => {
    const date = DateTime.fromSeconds(dayData.dt)
      .setLocale('ro')
      .toLocaleString(DateTime.DATE_MED);

    const row = [
      date,
      dayData.temp.max + units.temperature,
      dayData.temp.min + units.temperature,
      dayData.wind_speed + units.wind_speed,
    ];

    table.push(row);
  });

  return table;
}

async function displayWeatherForecast(event) {
  const coords = await getCurrentWeather(event);
  const dailyData = await getWeatherFor8Days(coords);
  const table = generateForecastTable(dailyData);
  const tableEele = document.getElementById('table-container');
  tableEele.innerHTML = table.toHTMLString();
}
