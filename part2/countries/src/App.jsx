import axios from "axios";
import { useEffect, useState } from "react";

const api_key = import.meta.env.VITE_SOME_KEY;
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";

const Show = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const capital = country.capital?.[0];

  useEffect(() => {
    if (!capital) return;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital[0]}&appid=${api_key}`,
      )
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => console.log(error));
  }, [capital]);

  return (
    <div id={country.area}>
      <h1>{country.name.common}</h1>
      <p>
        Capital:{" "}
        {country.capital.length === 1
          ? country.capital
          : country.capital.map((ca) => <p>{ca}</p>)}
      </p>
      <p>Area: {country.area}</p>
      <h1>Languages:</h1>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => (
          <li id={key}>{value}</li>
        ))}
      </ul>
      <div>
        <img src={`${country.flags.png}`} alt={`${country.flags.alt}`} />
      </div>
      <h1>Weather in {country.capital[0]}</h1>
      {weather !== null ? (
        <div>
          <p>Temperature {(weather.main.temp - 273.15).toFixed(2)} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState(null);
  const [showDetails, setShowDetails] = useState({ show: false, c: null });

  //console.log(search);

  const handleOnchange = (e) => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    axios.get(baseUrl).then((response) => {
      setCountries(response.data);
    });
  }, []);

  /*if (countries !== null) {
    countries.map((c) => console.log(c));
  }*/

  const result =
    countries === null
      ? ""
      : countries.filter((c) =>
          c.name.common.toLowerCase().includes(search.toLowerCase()),
        );

  //console.log("Result: ", result);

  if (result.length !== 0) {
    // result.map((c) => console.log(c.capital));
  }

  const handleShow = (c) => {
    setShowDetails({
      show: true,
      c: c,
    });
  };

  return (
    <div>
      find countries:{" "}
      <input type="text" value={search} onChange={handleOnchange} />
      {showDetails.show ? (
        <div>{showDetails.show && <Show c={showDetails.c} />}</div>
      ) : (
        <div>
          {result.length === 0 ? (
            ""
          ) : result.length > 10 ? (
            <p>Too many matches, specify another filter.</p>
          ) : result.length !== 1 ? (
            result.map((country) => (
              <p id={country.area}>
                {country.name.common}
                <button onClick={() => handleShow(country)}>Show</button>
              </p>
            ))
          ) : (
            result.map((country) => <Show country={country} />)
          )}
        </div>
      )}
    </div>
  );
}

export default App;
