import { DateTime } from 'luxon';

let inputEl = document.querySelectorAll('input');

document.querySelector('table').style.display = 'none';

console.log(inputEl);
inputEl.forEach((node) => (node.onchange = printCurrentWeather));

function printCurrentWeather(event) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/weather?q=${event.srcElement.value}` +
    `&appid=***REMOVED***&units=metric&lang=ro`;
  fetch(OPEN_WEATHER_MAP_API)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      printWeatherFor7Days(data.coord);
    });
}

function printWeatherFor7Days({ lat, lon }) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}` +
    `&appid=***REMOVED***&units=metric&lang=ro`;
  fetch(OPEN_WEATHER_MAP_API)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      class WeatherOneDay {
        constructor(data, tempMax, tempMin, vitezaVant) {
          this.data = data;
          this.tempMax = tempMax;
          this.tempMin = tempMin;
          this.vitezaVant = vitezaVant;
        }
      }
      let daysArray = [];
      data.daily.forEach((day) => {
        //   console.log(day);
        const data = DateTime.fromSeconds(day.dt)
          .setLocale('ro')
          .toLocaleString(luxon.DateTime.DATE_MED);
        const tempMax = day.temp.max;
        const tempMin = day.temp.min;
        const vitezaVant = day.wind_speed;

        const _day = new WeatherOneDay(data, tempMax, tempMin, vitezaVant);

        daysArray.push(_day);
      });
      console.log(daysArray);
      let tableRows = document.querySelectorAll('tr:not(:first-child)');
      console.log(tableRows);
      tableRows.forEach((tr, trIndex) => {
        console.log(tr.children, trIndex);
        Array.from(tr.children).forEach((el, tdIndex) => {
          switch (tdIndex) {
            case 0:
              el.innerText = daysArray[trIndex].data;
              break;
            case 1:
              el.innerText = daysArray[trIndex].tempMax;
              break;
            case 2:
              el.innerText = daysArray[trIndex].tempMin;
              break;
            case 3:
              el.innerText = daysArray[trIndex].vitezaVant;
              break;
          }
        });
      });
      document.querySelector('table').style.display = 'block';
    });
}
