import { useState, useEffect } from "react";
import axios from "axios";

import styles from './appMeteo.module.css'

 export const AppMeteo = () => {
    // const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  

    const [data, setData] = useState()
    const [city, setCity] = useState('Warszawa')
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [backgroundStyle, setBackgroundStyle] = useState({});



    useEffect(() => {
        const apiKey = 'd85daf91dafd86f7e18c1e31cb1df93c';
        const lang = 'pl';
    
        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&appid=${apiKey}&units=metric`)
          .then((response) => {
            setData(response.data);

            const weatherMain = response.data.weather[0].main;
        let backgroundGradient = '';

        if (weatherMain === "Rain") {
          backgroundGradient = 'linear-gradient(to bottom, #2f3640, #718093)';
        } else if (weatherMain === "Clouds") {
          backgroundGradient = 'linear-gradient(to bottom, #718093, #f2994a)';
        } else {
          backgroundGradient = 'linear-gradient(to bottom, #f2994a, #f2c94c)';
        }

        setBackgroundStyle({ background: backgroundGradient });  
          })
          .catch((error) => {
            console.error('Błąd podczas pobierania danych', error);
          });
    

      axios
      .get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=${lang}&appid=${apiKey}&units=metric`)
      .then((response) => {
        setForecastData(response.data.list);
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania prognozy', error);
      });
  }, [city]);




      // const formatTime = (date) => {
      //   return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      // };

      const formatDate = (date) => {
        const options = { day: 'numeric', month: 'numeric' };
        return new Intl.DateTimeFormat('pl-PL', options).format(date);
      };
    
      const formatHour = (date) => {
        return `${date.getHours()}:00`;
      };

      const StyleImg = {
        backgroundImage: data && `url(http://openweathermap.org/img/w/${data.weather[0].icon}.png)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }

      const handleSearch = () => {
        setCity(searchInput);
        setSearchOpen(false);
      };

      

    return(
        <div  className={styles.app}>
          {data && (
            <div className={styles.weather} style={backgroundStyle}>
                <div className={styles.weather__search}>
                    {searchOpen ? (
                    <>
                        <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Wyszukaj miasto"
                        />
                        <button onClick={handleSearch}>Szukaj</button>
                    </>
                    ) : (
                    <button onClick={() => setSearchOpen(true)}>Znajdz miejscowość</button>
                    )}
                </div>
                <div style={StyleImg} className={styles.weather__title}>
                    <h2 className={styles.weather__titleH2}>{data.name}{/* {data.sys.country} */}</h2>
                    <p className={styles.weather__titleTemp}>{Math.round(data.main.temp)}°C</p>
                    <p className={styles.weather__titleDes}>{data.weather[0].description}</p>
                </div>
                <div className={styles.weather__divLists}>
                  <ul className={styles.weather__list}>
                    <li className={styles.weather__listEl}>temp</li>
                    <li className={styles.weather__listEl}>{Math.round(data.main.temp_min)} °C</li>
                    <li className={styles.weather__listEl}>{Math.round(data.main.temp_max)} °C</li>
                  </ul>
                  <ul className={styles.weather__list}>
                    <li>Warunki</li>
                    <li>{data.main.pressure} hPa</li>
                    <li>{data.main.humidity} %</li>
                  </ul>
                  <ul className={styles.weather__list}>
                    <li>Wiatr</li>
                    <li>{data.wind.speed} m/s</li>
                    <li>{data.wind.deg}°</li>
                  </ul>
                </div>
                  <h2 className={styles.forecast__title}>Prognoza na 5 dni:</h2>
                <div className={styles.forecast__layout}>
                  {forecastData.length > 0 && (
            <div className={styles.forecast}>
              

              {forecastData.reduce((uniqueDates, forecastItem) => {
                const date = forecastItem.dt_txt.split(" ")[0];
                if (!uniqueDates.includes(date)) {
                  uniqueDates.push(date);
                  return [...uniqueDates];
                }
                return uniqueDates;
              }, []).slice(0, 5).map((date, index) => {
                const forecastsForDay = forecastData.filter(item => item.dt_txt.includes(date));
                const forecastDate = new Date(forecastsForDay[0].dt_txt);
                const formattedDate = formatDate(forecastDate);
                
                return (
                  <ul className={styles.forecast__listHead} key={index}>
                    <li className={styles.forecast__listHeadEl}>
                      <h3 className={styles.forecast__listHeadH3}>Data: {formattedDate}</h3>
                      <ul className={styles.forecast__list}>
                        {forecastsForDay.map((forecast, innerIndex) => {
                          return (
                            <li className={styles.forecast__listEl} key={innerIndex}>
                              <p className={styles.forecast__listElPar}>{formatHour(new Date(forecast.dt_txt))}</p>
                              <p className={styles.forecast__listElPar}>{Math.round(forecast.main.temp)} °C</p>
                              <img className={styles.forecast__listElImg} src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`} alt="Weather Icon" />
                              <p className={styles.forecast__listElPar}>Min: {Math.round(forecast.main.temp_min)} °C</p>
                              <p className={styles.forecast__listElPar}>Max: {Math.round(forecast.main.temp_max)} °C</p>
                              {/* <p>Opis: {forecast.weather[0].description}</p> */}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  </ul>
                );
              })}
        </div>
      )}
    </div>
 </div>
   )}
</div>
    )
}




