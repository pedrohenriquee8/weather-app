const cityLocation = document.querySelector(".wrapper .temperature-now .location span");
const temperatureNow = document.querySelector(".wrapper .temperature-now .temperature-measurement .temperature-celsius");
const temperatureMax = document.querySelector(".wrapper .temperature-now .temperature-measurement .temperature-max-min p");
const temperatureMin = document.querySelector(".wrapper .temperature-now .temperature-measurement .temperature-max-min span");
const windVelocity = document.querySelector(".wrapper .temperature-now .environment-information .item .info-item .wind-velocity");
const humidityPercentage = document.querySelector(".wrapper .temperature-now .environment-information .item .info-item .humidity-percentage");
const rainPercentage = document.querySelector(".wrapper .temperature-now .environment-information .item .info-item .rain-percentage");

const gbDrefaText = document.querySelector(".wrapper .additional-info .air-quality .air-main p");
const gbDrefaIndex = document.querySelector(".wrapper .additional-info .air-quality .air-main span");
const airQualityPM2_5 = document.querySelector(".wrapper .additional-info .air-quality .air-info .air-pm2_5 span");
const airQualityPM10 = document.querySelector(".wrapper .additional-info .air-quality .air-info .air-pm10 span");
const airQualitySO2 = document.querySelector(".wrapper .additional-info .air-quality .air-info .air-so2 span");
const airQualityNO2 = document.querySelector(".wrapper .additional-info .air-quality .air-info .air-no2 span");
const airQualityO3 = document.querySelector(".wrapper .additional-info .air-quality .air-info .air-o3 span");
const airQualityCO = document.querySelector(".wrapper .additional-info .air-quality .air-info .air-co span");

const daysWeekWeather = document.querySelectorAll(".wrapper .additional-info .week-weather .item .day");
const imgDaysWeekWeather = document.querySelectorAll(".wrapper .additional-info .week-weather .item img");
const daysWeekWeatherTemperatureMax = document.querySelectorAll(".wrapper .additional-info .week-weather .item .temperature-max-min p");
const daysWeekWeatherTemperatureMin = document.querySelectorAll(".wrapper .additional-info .week-weather .item .temperature-max-min span");

const sunriseTime = document.querySelector(".wrapper .additional-info .sun-time .sun-main .sunset-time p");
const sunsetTime = document.querySelector(".wrapper .additional-info .sun-time .sun-main .sunset-time span");


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        getData({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    }, function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("Permissão negada.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Posição rejeitada.");
                break;
        }
    });
} else {
    alert("Seu navegador não suporta geolocalização.");
}

async function getData(props) {
    const { latitude, longitude } = props;

    try {
        const response = await fetch(`https://weather-server-es00.onrender.com/location?lat=${latitude}&long=${longitude}`);
        const data = await response.json();
        localWeatherInformation(data);
    } catch (error) {
        console.error(error);
    }
}

function localWeatherInformation(data) {
    cityLocation.textContent = `${data.location.name}, ${data.location.region}`
    temperatureNow.textContent = `${data.current.temp_c}`;
    temperatureMax.textContent = `${data.forecast.forecastday[0].day.maxtemp_c}°`;
    temperatureMin.textContent = `${data.forecast.forecastday[0].day.mintemp_c}°`;
    windVelocity.textContent = `${data.current.wind_kph}`;
    humidityPercentage.textContent = `${data.current.humidity}`;
    rainPercentage.textContent = `${data.forecast.forecastday[0].day.daily_chance_of_rain}`;

    airQualityPM2_5.textContent = parseFloat(`${data.current.air_quality.pm2_5}`).toFixed(1);
    airQualityPM10.textContent = parseFloat(`${data.current.air_quality.pm10}`).toFixed(1);
    airQualitySO2.textContent = parseFloat(`${data.current.air_quality.so2}`).toFixed(1);
    airQualityNO2.textContent = parseFloat(`${data.current.air_quality.no2}`).toFixed(1);
    airQualityO3.textContent = parseFloat(`${data.current.air_quality.o3}`).toFixed(1);
    airQualityCO.textContent = parseFloat(`${data.current.air_quality.co}`).toFixed(1);
    gbDrefaIndex.textContent = `${data.current.air_quality["gb-defra-index"]}`;
    gbDrefaText.textContent = determineDefraIndex(gbDrefaIndex.textContent);

    sunriseTime.textContent = `${data.forecast.forecastday[0].astro.sunrise}`.substring(0, 5);
    sunsetTime.textContent = `${(parseInt(data.forecast.forecastday[0].astro.sunset.substring(0, 2)) + 12).toString()}:${data.forecast.forecastday[0].astro.sunset.substring(3, 5)}`;

    forecastDays(data.forecast.forecastday);
}

function determineDefraIndex(index) {
    if (index >= 1 && index <= 3) {
        return "Boa";
    } else if (index > 3 && index <= 6) {
        return "Moderada";
    } else if (index > 6 && index <= 9) {
        return "Baixa";
    } else {
        return "Muito baixa";
    }
}

function forecastDays(currentDayAndNextDays) {
    currentDayAndNextDays.forEach((day, index) => {
        const getDateDay = new Date(`${day.date}T00:00:00`).getDay();
        const condition = day.day.condition;
        const temperatureMax = day.day.maxtemp_c;
        const temperatureMin = day.day.mintemp_c;

        insertDaysWeek(getDateDay, index, condition, temperatureMax, temperatureMin);
    });
}

function insertDaysWeek(dateDay, index, condition, temperatureMax, temperatureMin) {
    switch (dateDay) {
        case 0:
            daysWeekWeather[index].textContent = "Domingo";
            imgDaysWeekWeather[index].setAttribute("src", `${condition.icon}`);
            imgDaysWeekWeather[index].setAttribute("alt", `${condition.text}`);
            daysWeekWeatherTemperatureMax[index].textContent = `${temperatureMax}°`;
            daysWeekWeatherTemperatureMin[index].textContent = `${temperatureMin}°`;
            break;
        case 1:
            daysWeekWeather[index].textContent = "Segunda";
            imgDaysWeekWeather[index].setAttribute("src", `${condition.icon}`);
            imgDaysWeekWeather[index].setAttribute("alt", `${condition.text}`);
            daysWeekWeatherTemperatureMax[index].textContent = `${temperatureMax}°`;
            daysWeekWeatherTemperatureMin[index].textContent = `${temperatureMin}°`;
            break;
        case 2:
            daysWeekWeather[index].textContent = "Terça";
            imgDaysWeekWeather[index].setAttribute("src", `${condition.icon}`);
            imgDaysWeekWeather[index].setAttribute("alt", `${condition.text}`);
            daysWeekWeatherTemperatureMax[index].textContent = `${temperatureMax}°`;
            daysWeekWeatherTemperatureMin[index].textContent = `${temperatureMin}°`;
            break;
        case 3:
            daysWeekWeather[index].textContent = "Quarta";
            imgDaysWeekWeather[index].setAttribute("src", `${condition.icon}`);
            imgDaysWeekWeather[index].setAttribute("alt", `${condition.text}`);
            daysWeekWeatherTemperatureMax[index].textContent = `${temperatureMax}°`;
            daysWeekWeatherTemperatureMin[index].textContent = `${temperatureMin}°`;
            break;
        case 4:
            daysWeekWeather[index].textContent = "Quinta";
            imgDaysWeekWeather[index].setAttribute("src", `${condition.icon}`);
            imgDaysWeekWeather[index].setAttribute("alt", `${condition.text}`);
            daysWeekWeatherTemperatureMax[index].textContent = `${temperatureMax}°`;
            daysWeekWeatherTemperatureMin[index].textContent = `${temperatureMin}°`;
            break;
        case 5:
            daysWeekWeather[index].textContent = "Sexta";
            imgDaysWeekWeather[index].setAttribute("src", `${condition.icon}`);
            imgDaysWeekWeather[index].setAttribute("alt", `${condition.text}`);
            daysWeekWeatherTemperatureMax[index].textContent = `${temperatureMax}°`;
            daysWeekWeatherTemperatureMin[index].textContent = `${temperatureMin}°`;
            break;
        case 6:
            daysWeekWeather[index].textContent = "Sábado";
            imgDaysWeekWeather[index].setAttribute("src", `${condition.icon}`);
            imgDaysWeekWeather[index].setAttribute("alt", `${condition.text}`);
            daysWeekWeatherTemperatureMax[index].textContent = `${temperatureMax}°`;
            daysWeekWeatherTemperatureMin[index].textContent = `${temperatureMin}°`;
            break;
    };
}

localWeatherInformation();